import React, { cloneElement, useCallback, useState } from 'react'
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  type Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions
} from '@floating-ui/react'

import { cx } from '@/lib/utils'

export default function Tooltip({
  placement = 'top',
  className,
  content,
  children
}: {
  placement?: Placement
  className?: string
  content: React.ReactNode
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>
}) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(9), flip({ fallbackAxisSideDirection: 'start' }), shift()]
  })

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

  const hover = useHover(context, { move: false })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss])

  return (
    <>
      {cloneElement(children, {
        // @ts-expect-error TypeScript doesn't like ref props here for some reason.
        ref: setReference,
        ...getReferenceProps()
      })}
      <FloatingPortal>
        {isOpen && (
          <div
            ref={setFloating}
            {...getFloatingProps()}
            style={floatingStyles}
            className={cx(
              'z-50 text-xs max-w-fit border border-neutral-200 rounded bg-white px-3 py-1.5 shadow-md',
              className
            )}
          >
            {content}
          </div>
        )}
      </FloatingPortal>
    </>
  )
}
