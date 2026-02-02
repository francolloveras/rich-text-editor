import { SECTIONS } from '@/lib/const'
import { useActiveHash } from '@/lib/hooks'
import { cx } from '@/lib/utils'

export default function Nav() {
  const activeHash = useActiveHash()

  return (
    <nav className="sticky top-4 h-64 w-48 flex flex-col gap-y-1.5">
      <h3 className="text-lg font-medium">Rich Text Editor</h3>
      {Object.values(SECTIONS).map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={cx(
            'px-3 py-1.5 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100',
            {
              'bg-neutral-100 text-neutral-900 font-medium': activeHash === `#${id}`
            }
          )}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
