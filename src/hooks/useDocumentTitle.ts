import { useEffect } from 'react'

/** Atualiza o título da aba. Com `null`, não mexe no título (útil quando a página é "não encontrada"). */
export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])
}
