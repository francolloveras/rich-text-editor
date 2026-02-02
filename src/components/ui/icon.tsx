import { cx } from '@/lib/utils'
import {
  BadgePlus,
  Bold,
  Check,
  CircleAlert,
  Code,
  Eye,
  Images,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  RemoveFormatting,
  Strikethrough,
  Text,
  Underline,
  X
} from 'lucide-react'

export default function Icon({
  icon,
  strokeWidth,
  className
}: {
  icon: IconName
  strokeWidth?: number
  className?: string
}) {
  const IconComponent = iconMap[icon]

  if (!IconComponent) {
    throw new Error(`Icon "${icon}" not found.`)
  }

  return (
    <IconComponent
      strokeWidth={strokeWidth}
      className={cx('inline-block mb-0.5 size-4 align-middle', [className])}
    />
  )
}

export type IconName = keyof typeof iconMap

const iconMap = {
  badgePlus: BadgePlus,
  bold: Bold,
  check: Check,
  circleAlert: CircleAlert,
  code: Code,
  eye: Eye,
  images: Images,
  indentDecrease: IndentDecrease,
  indentIncrease: IndentIncrease,
  italic: Italic,
  link2: Link2,
  link2Off: Link2Off,
  list: List,
  listOrdered: ListOrdered,
  removeFormatting: RemoveFormatting,
  strikethrough: Strikethrough,
  text: Text,
  underline: Underline,
  x: X
}
