import { useEffect, useRef, useState } from 'react'

/**
 * Conta quantos passos da trilha já "passaram" pela linha de leitura enquanto a pessoa rola a página.
 * É só um efeito de demonstração ligado à rolagem: não grava nada, não guarda progresso.
 *
 * Um passo conta como concluído quando o centro dele sobe acima de 40% da altura da janela.
 * No fim da página, todos contam como concluídos (para o último passo nunca ficar fora de alcance).
 */
export function useTrailProgress(total: number) {
  const refs = useRef<(HTMLElement | null)[]>([])
  const [done, setDone] = useState(0)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.4
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      let count = 0
      for (let i = 0; i < total; i += 1) {
        const el = refs.current[i]
        if (!el) break
        const rect = el.getBoundingClientRect()
        if (rect.top + rect.height / 2 < line) count = i + 1
        else break
      }
      const lastRect = refs.current[total - 1]?.getBoundingClientRect()
      // no fim da página só vale se a trilha já entrou na tela (evita completar sem ter chegado nela)
      if (atBottom && lastRect && lastRect.top < window.innerHeight) count = total
      setDone((prev) => (prev === count ? prev : count))
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [total])

  return { done, refs }
}
