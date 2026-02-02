import { cx } from '@/lib/utils'

export default function Label({
  name,
  required,
  children,
  ...rest
}: {
  name: string
  required?: boolean
  children: React.ReactNode
} & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...rest}
      htmlFor={name}
      className={cx(
        'block text-base font-medium text-nowrap leading-none',
        {
          'after:ml-1 after:text-base after:text-red-700 after:content-["*"]': required
        },
        [rest.className]
      )}
    >
      {children}
    </label>
  )
}
