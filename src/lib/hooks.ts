import { useCallback, useEffect, useState } from 'react'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating as useFloatingNative,
  type UseFloatingOptions,
  useInteractions
} from '@floating-ui/react'

export function useFloating(options?: UseFloatingOptions) {
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloatingNative({
    ...options,
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(9), flip(), shift(), ...(options?.middleware ?? [])]
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const setReference = useCallback(
    (node: HTMLElement | null) => {
      refs.setReference(node)
    },
    [refs]
  )

  const setFloating = useCallback(
    (node: HTMLElement | null) => {
      refs.setFloating(node)
    },
    [refs]
  )

  return {
    isOpen,
    refs,
    floatingStyles,
    openModal,
    closeModal,
    getReferenceProps,
    getFloatingProps,
    setReference,
    setFloating
  }
}

export function useActiveHash() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return hash
}
