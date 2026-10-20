"""Coleta a listagem IEFA filtrada por nacionalidade Brazil, sem publicar bolsas.

Uso: python scripts/scrape_iefa.py data/imports/iefa-brazil-YYYY-MM-DD.json
Não interpreta a listagem como prova de edital aberto ou elegibilidade final.
"""
import json
import re
import sys
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlencode, urljoin
from urllib.request import Request, urlopen

BASE = "https://www.iefa.org/scholarships"
PER_PAGE = 500


def clean(value):
    return " ".join(value.split())


class ListingParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.records = []
        self.record = None
        self.column = -1
        self.capture_link = None
        self.paragraph = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "tr" and attrs.get("data-key", "").isdigit():
            self.record = dict(id=attrs["data-key"], links=[], field=[], description=[], nationality=[], host_countries=[])
            self.column = -1
        elif self.record is not None:
            if tag == "td":
                self.column += 1
            elif tag == "a" and self.column == 0 and re.match(r"^/scholarships/\d+/", attrs.get("href", "")):
                self.capture_link = [attrs["href"], []]
            elif tag == "p" and self.column == 2:
                classes = attrs.get("class", "")
                self.paragraph = "nationality" if "award-list-nationality" in classes else "host_countries" if "award-list-location" in classes else "other"

    def handle_data(self, data):
        if self.record is None:
            return
        if self.capture_link is not None:
            self.capture_link[1].append(data)
        if self.column == 1:
            self.record["field"].append(data)
        elif self.column == 2:
            if self.paragraph in ("nationality", "host_countries"):
                self.record[self.paragraph].append(data)
            elif self.paragraph is None:
                self.record["description"].append(data)

    def handle_endtag(self, tag):
        if self.record is None:
            return
        if tag == "a" and self.capture_link is not None:
            href, parts = self.capture_link
            label = clean("".join(parts))
            if label:
                self.record["links"].append((href, label))
            self.capture_link = None
        elif tag == "p":
            self.paragraph = None
        elif tag == "tr":
            links = self.record.pop("links")
            if links:
                href, title = max(links, key=lambda item: len(item[1]))
                self.record["url"] = urljoin(BASE, href)
                self.record["title"] = title
                for key in ("field", "description", "nationality", "host_countries"):
                    self.record[key] = clean("".join(self.record[key]))
                self.record["nationality"] = re.sub(r"^Nationality:\s*", "", self.record["nationality"])
                self.record["host_countries"] = re.sub(r"^Host Countries:\s*", "", self.record["host_countries"])
                self.records.append(self.record)
            self.record = None
            self.column = -1
            self.capture_link = None
            self.paragraph = None


def fetch(page):
    query = urlencode({"AwardSearch[details]": "33", "per-page": PER_PAGE, "page": page})
    request = Request(f"{BASE}?{query}", headers={"User-Agent": "DaydreamingResearch/1.0 (scholarship catalogue; contact via project owner)"})
    with urlopen(request, timeout=40) as response:
        html = response.read().decode("utf-8", errors="replace")
    count = re.search(r'Showing\s*<b>[^<]+</b>\s*of\s*<b>([\d,]+)</b>', html)
    if not count:
        raise RuntimeError(f"A página {page} não contém o total esperado; layout pode ter mudado.")
    parser = ListingParser()
    parser.feed(html)
    if not parser.records:
        raise RuntimeError(f"Nenhuma bolsa reconhecida na página {page}.")
    return int(count.group(1).replace(",", "")), parser.records


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/scrape_iefa.py CAMINHO_DO_JSON")
    output = Path(sys.argv[1]).resolve()
    if not output.is_relative_to(Path.cwd().resolve()):
        raise SystemExit("O JSON de saída deve ficar dentro do projeto.")
    total, first = fetch(1)
    records = {record["id"]: record for record in first}
    pages = (total + PER_PAGE - 1) // PER_PAGE
    print(f"IEFA informa {total} resultados em {pages} páginas.", flush=True)
    for page in range(2, pages + 1):
        time.sleep(1)
        reported, batch = fetch(page)
        if reported != total:
            raise RuntimeError("O total mudou durante a coleta; execute novamente.")
        records.update((record["id"], record) for record in batch)
        print(f"Página {page}/{pages}: {len(batch)} registros.", flush=True)
    if len(records) != total:
        raise RuntimeError(f"Esperados {total}, encontrados {len(records)} IDs únicos; nada foi salvo.")
    payload = {"source": "iefa", "filter": "Brazil", "source_url": f"{BASE}?AwardSearch%5Bdetails%5D=33",
               "fetched_at": datetime.now(timezone.utc).isoformat(), "reported_total": total,
               "records": list(records.values()), "caveat": "Listagem do IEFA; prazo, vigência e elegibilidade final não verificados."}
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Salvos {len(records)} registros em {output}")


if __name__ == "__main__":
    main()
