import Icon, { type IconName } from '@/components/ui/icon'
import Label from '@/components/ui/label'
import SupportingText from '@/components/ui/supporting-text'
import { cx } from '@/lib/utils'

export default function Input({
  name,
  label,
  icon,
  error,
  wrapperClassName,
  supportingText,
  disableSupportingText = false,
  className,
  ...rest
}: {
  name: string
  label?: string
  icon?:
    | IconName
    | {
        icon: IconName
        className?: string
      }
  error?: string
  wrapperClassName?: string
  supportingText?: React.ReactNode
  disableSupportingText?: boolean
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <div className={cx('w-full space-y-1.5', [wrapperClassName])}>
      {label && (
        <Label name={name} required={rest.required}>
          {label}
        </Label>
      )}
      <div className="relative">
        {icon && (
          <Icon
            icon={typeof icon === 'string' ? icon : icon.icon}
            className={cx('absolute left-3 top-3 size-4 text-neutral-500', [
              typeof icon !== 'string' && icon.className
            ])}
          />
        )}
        <input
          {...rest}
          id={name}
          name={name}
          className={cx(
            'flex h-9.5 w-full bg-white rounded-md border border-neutral-200 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-800 placeholder:text-neutral-500 outline-transparent outline-2 -outline-offset-2 focus:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 readonly:opacity-50 readonly:cursor-not-allowed',
            {
              'pl-10': icon,
              'pl-3': !icon,
              'outline-red-600': error
            },
            [className]
          )}
        />
      </div>
      {!disableSupportingText && <SupportingText error={error} text={supportingText} />}
    </div>
  )
}
