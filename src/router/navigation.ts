import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react'

/*
 * Roteador mínimo do Daydreaming (micro tarefa 2.1).
 *
 * Por que não usar uma biblioteca: o site tem poucas rotas e nenhuma exigência
 * especial. Se a navegação crescer (rotas aninhadas, carregamento de dados por
 * rota), troque este arquivo por react-router-dom: as páginas só dependem de
 * `Link`, `navigate` e `useLocation`.
 *
 * Servidor: rotas como /paises/alemanha precisam que o servidor devolva o
 * index.html para qualquer caminho (o servidor do Vite já faz isso).
 */

const listeners = new Set<() => void>()
/** Conta navegações iniciadas pelo site (cliques em Link). Botão voltar/avançar não conta. */
let navigationCount = 0

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
  }
}

function getHref() {
  return window.location.pathname + window.location.search + window.location.hash
}

/** Vai para outro endereço do site sem recarregar a página. Endereços de outros sites recarregam. */
export function navigate(to: string) {
  const url = new URL(to, window.location.href)
  if (url.origin !== window.location.origin) {
    window.location.assign(to)
    return
  }
  window.history.pushState(null, '', url.pathname + url.search + url.hash)
  navigationCount += 1
  emit()
}

export function useLocation() {
  const href = useSyncExternalStore(subscribe, getHref, () => '/')
  return useMemo(() => {
    const url = new URL(href, 'http://localhost')
    return { pathname: url.pathname, search: url.search, hash: url.hash }
  }, [href])
}

function useNavigationCount() {
  return useSyncExternalStore(
    subscribe,
    () => navigationCount,
    () => 0,
  )
}

function scrollToHash(hash: string) {
  if (!hash) return false
  const element = document.getElementById(decodeURIComponent(hash.slice(1)))
  if (!element) return false
  element.scrollIntoView()
  return true
}

/**
 * Cuida da rolagem e do foco quando a pessoa navega:
 * - com #âncora: rola até o elemento;
 * - sem âncora: volta ao topo e move o foco para o conteúdo (importante para quem usa teclado ou leitor de tela).
 * Na primeira carga, também rola até a âncora da URL (o conteúdo só existe depois que o React renderiza).
 */
export function useScrollOnNavigate() {
  const count = useNavigationCount()
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const handledCount = useRef(0)

  useEffect(() => {
    scrollToHash(window.location.hash)
  }, [])

  useEffect(() => {
    const pathChanged = previousPath.current !== pathname
    previousPath.current = pathname
    if (count === handledCount.current) return
    handledCount.current = count

    if (scrollToHash(window.location.hash)) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    if (pathChanged) document.getElementById('conteudo')?.focus({ preventScroll: true })
  }, [count, pathname])
}
