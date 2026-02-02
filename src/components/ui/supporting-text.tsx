import { cx } from '@/lib/utils'
import Icon from '@/components/ui/icon'

export default function SupportingText({
  error,
  text,
  className
}: {
  error?: string
  text?: React.ReactNode
  className?: string
}) {
  if (!error && !text) {
    return <div className="h-5" />
  }

  return (
    <p
      className={cx(
        'min-h-5 text-right text-neutral-800 text-sm',
        {
          'text-red-600': error
        },
        [className]
      )}
    >
      <Icon icon="circleAlert" className="mr-1.5" />
      {error ?? text}
    </p>
  )
}
