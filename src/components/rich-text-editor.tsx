import React, { useEffect, useRef, useState } from 'react'
import { FloatingPortal } from '@floating-ui/react'
import { type Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { useFloating } from '@/lib/hooks'
import Label from '@/components/ui/label'
import SupportingText from '@/components/ui/supporting-text'
import Tooltip from '@/components/ui/tooltip'
import { cx } from '@/lib/utils'
import Icon, { type IconName } from '@/components/ui/icon'
import Input from '@/components/ui/input'

export default function Textarea({
  name,
  label,
  defaultValue,
  defaultFiles,
  icon,
  error,
  required,
  lang = 'en',
  wrapperClassName,
  supportingText,
  disableSupportingText = false,
  className,
  editorClassName,
  disabled,
  onChange
}: {
  name: string
  label?: string
  defaultValue?: string
  defaultFiles?: string[] | null
  className?: string
  icon?:
    | IconName
    | {
        icon: IconName
        className?: string
      }
  error?: string
  required?: boolean
  lang?: string
  wrapperClassName?: string
  editorClassName?: string
  supportingText?: React.ReactNode
  disableSupportingText?: boolean
  disabled?: boolean
  onChange?: (value: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({})
  const [dropFileHighlight, setDropFileHighlight] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [files, setFiles] = useState<InputFile[]>(
    defaultFiles
      ? defaultFiles.map((file) => {
          const [name, type] = file.split('/').at(-1)!.split('.')

          return { name, type, preview: file, rawFile: null }
        })
      : []
  )

  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content: defaultValue,
    onUpdate: ({ editor }) => {
      const value = editor.getHTML()

      onChange?.(value)
    }
  })

  const syncInputFiles = (fileList: InputFile[]) => {
    const dt = new DataTransfer()

    fileList.forEach(({ rawFile }) => (rawFile ? dt.items.add(rawFile) : undefined))

    if (inputRef.current) {
      inputRef.current.files = dt.files
    }
  }

  const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    insertFiles(event.target.files)
  }

  const insertFiles = (newFiles: FileList | null) => {
    if (newFiles) {
      const updated = [
        ...files,
        ...Array.from(newFiles)
          .filter((file) => !files.some((f) => f.name === file.name))
          .map((file) => ({
            name: file.name,
            type: file.type.split('/')[1],
            preview: URL.createObjectURL(file),
            rawFile: file
          }))
      ]

      setFiles(updated)
      syncInputFiles(updated)
    }
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    syncInputFiles(updated)
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    if (!dropFileHighlight && !disabled) setDropFileHighlight(true)
  }

  const handleDragLeave = (event: DragEvent) => {
    if (event.relatedTarget === null) {
      setDropFileHighlight(false)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    setTransitionEnabled(false)
    setDropFileHighlight(false)

    requestAnimationFrame(() => {
      setTransitionEnabled(true)
    })

    insertFiles(event.dataTransfer.files)
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    insertFiles(event.clipboardData.files)
  }

  useEffect(() => {
    if (document) {
      document.addEventListener('dragover', handleDragOver)
      document.addEventListener('dragleave', handleDragLeave)
      document.addEventListener('drop', handleDragLeave)
      document.addEventListener('dragend', handleDragLeave)
    }

    return () => {
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('drop', handleDragLeave)
      document.removeEventListener('dragend', handleDragLeave)
    }
  }, [])

  useEffect(() => {
    if (!editor) return

    const update = () => {
      setActiveFormats({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike'),
        orderedList: editor.isActive('orderedList'),
        bulletList: editor.isActive('bulletList')
      })
    }

    editor.on('selectionUpdate', update)
    editor.on('transaction', update)
    update()

    return () => {
      editor.off('selectionUpdate', update)
      editor.off('transaction', update)
    }
  }, [editor])

  return (
    <div className={cx('w-full space-y-1.5', [wrapperClassName])}>
      {label && (
        <Label name={name} required={required}>
          {label}
        </Label>
      )}
      <div
        className={cx(
          'flex gap-x-2 overflow-y-auto rounded-md border border-neutral-300 p-1 shadow',
          {
            'pointer-events-none cursor-not-allowed opacity-50': disabled
          }
        )}
      >
        <div className="flex gap-x-0.5">
          <ToolbarControl
            label="Bold"
            icon="bold"
            shortcut="Ctrl B"
            isActive={activeFormats.bold}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <ToolbarControl
            label="Italic"
            icon="italic"
            shortcut="Ctrl I"
            isActive={activeFormats.italic}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <ToolbarControl
            label="Underline"
            icon="underline"
            shortcut="Ctrl U"
            isActive={activeFormats.underline}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          />
          <ToolbarControl
            label="Strikethrough"
            icon="strikethrough"
            shortcut="Ctrl Shift S"
            isActive={activeFormats.strike}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          />
        </div>
        <div className="mx-1 w-px border-l border-neutral-300" />
        <div className="flex gap-x-0.5">
          <ToolbarControl
            label="Ordered list"
            icon="listOrdered"
            shortcut="Ctrl Shift 7"
            isActive={activeFormats.orderedList}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarControl
            label="Disordered list"
            icon="list"
            shortcut="Ctrl Shift 8"
            isActive={activeFormats.bulletList}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ToolbarControl
            label="Increase indent"
            icon="indentIncrease"
            shortcut="Tab"
            onClick={() => editor?.chain().focus().sinkListItem('listItem').run()}
          />
          <ToolbarControl
            label="Increase indent"
            icon="indentDecrease"
            shortcut="Shift Tab"
            onClick={() => editor?.chain().focus().liftListItem('listItem').run()}
          />
        </div>
        <div className="mx-1 w-px border-l border-neutral-300" />
        <div className="flex gap-x-0.5">
          <InsertLinkControl editor={editor} />
          <ToolbarControl
            label="Remove link"
            icon="link2Off"
            onClick={() => editor?.chain().focus().unsetLink().run()}
          />
          <div>
            <input
              ref={inputRef}
              accept="image/*,.pdf"
              name={`${name}-attachments`}
              type="file"
              className="hidden"
              onChange={handleInputFileChange}
              multiple
            />
            <ToolbarControl
              label="Insert file"
              icon="images"
              onClick={() => inputRef.current?.click()}
            />
          </div>
        </div>
        <div className="mx-1 w-px border-l border-neutral-300" />
        <div className="flex">
          <ToolbarControl
            label="Remove format"
            icon="removeFormatting"
            onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
          />
        </div>
      </div>
      <div className="relative shadow-md rounded-md">
        {icon && (
          <Icon
            icon={typeof icon === 'string' ? icon : icon.icon}
            className={cx('absolute left-3 top-3 size-4 text-neutral-800', [
              typeof icon !== 'string' && icon.className
            ])}
          />
        )}
        <input
          type="hidden"
          id={name}
          name={name}
          value={editor?.getHTML() ?? ''}
          disabled={disabled}
        />
        <div
          className={cx(
            'flex flex-col  gap-y-4 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-transparent outline-2 -outline-offset-2',
            {
              'pl-10': icon,
              'pl-3': !icon,
              'outline-red-600': error,
              'pointer-events-none opacity-50': disabled
            },
            [className]
          )}
        >
          <EditorContent
            editor={editor}
            disabled={disabled}
            onClick={() => editor?.chain().focus()}
            onPaste={handlePaste}
            lang={lang}
            className={cx('rich-text-editor min-h-32 max-h-52 overflow-y-auto w-full cursor-text', [
              editorClassName
            ])}
            spellCheck
          />
          {files.length > 0 && (
            <ul className="flex w-full flex-wrap gap-1">
              {files.map(({ name, type, preview }, index) => (
                <li
                  key={`${name}-${index}`}
                  className="flex items-center gap-x-2 rounded border border-neutral-300 px-2 py-1 text-xs"
                >
                  {type?.includes('png') || type?.includes('jpeg') || type?.includes('webp') ? (
                    <img
                      alt={name}
                      src={preview}
                      height={20}
                      width={20}
                      className="aspect-square rounded object-cover"
                    />
                  ) : (
                    <div className="grid size-5 place-content-center rounded">
                      <Icon icon="images" />
                    </div>
                  )}
                  <p>{name}</p>
                  <Tooltip content="Remove file">
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="cursor-pointer size-fit rounded px-0.5 hover:bg-red-500 hover:text-red-100"
                    >
                      <Icon icon="x" className="mb-px size-3.5" />
                    </button>
                  </Tooltip>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          onDrop={handleDrop}
          className={cx(
            'invisible absolute inset-0 flex size-full items-center justify-center rounded-md border border-dashed border-neutral-700 bg-neutral-100',
            {
              visible: dropFileHighlight,
              'transition-all duration-200': transitionEnabled
            }
          )}
        >
          <p>
            <Icon icon="badgePlus" />
            Drop files here yo add as attachments.
          </p>
        </div>
      </div>
      {!disableSupportingText && <SupportingText error={error} text={supportingText} />}
    </div>
  )
}

function ToolbarControl({
  label,
  shortcut,
  isActive,
  icon,
  onClick
}: {
  label: string
  icon: IconName
  shortcut?: string
  onClick?: () => void
  isActive?: boolean
}) {
  return (
    <Tooltip
      content={
        <p>
          {label}{' '}
          {shortcut && <code className="rounded border border-neutral-300 px-1">{shortcut}</code>}
        </p>
      }
    >
      <button
        type="button"
        onClick={onClick}
        className={cx(
          'cursor-pointer px-2.5 py-1 rounded-md text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200',
          {
            'bg-neutral-200': isActive
          }
        )}
      >
        <Icon icon={icon} />
      </button>
    </Tooltip>
  )
}

function InsertLinkControl({ editor }: { editor: Editor | null }) {
  const initialState = {
    text: '',
    url: ''
  }

  const [link, setLink] = useState(initialState)
  const [errors, setErrors] = useState<{ text?: string; url?: string } | undefined>(undefined)
  const {
    isOpen,
    floatingStyles,
    closeModal,
    setFloating,
    setReference,
    getReferenceProps,
    getFloatingProps
  } = useFloating()

  const handleLink = (event: React.ChangeEvent<HTMLInputElement>, key: 'text' | 'url') => {
    const value = event.target.value

    setLink((prev) => ({ ...prev, [key]: value }))
  }

  const openLinkModal = () => {
    const selectedText = editor?.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    )

    setLink((prev) => ({ ...prev, text: selectedText ?? '' }))
  }

  const insertLink = () => {
    const textIsEmpty = link.text.length === 0
    const urlIsEmpty = link.url.length === 0

    if (textIsEmpty || urlIsEmpty) {
      return setErrors({
        text: textIsEmpty ? 'Escribí el texto' : undefined,
        url: urlIsEmpty ? 'Escribí la URL' : undefined
      })
    }

    editor
      ?.chain()
      .focus()
      .insertContent({
        type: 'text',
        text: link.text,
        marks: [{ type: 'link', attrs: { href: link.url, target: '_blank' } }]
      })
      .run()
    closeModal()
    setLink(initialState)
  }

  return (
    <>
      <div ref={setReference} {...getReferenceProps()}>
        <ToolbarControl label="Insert link" icon="link2" onClick={openLinkModal} />
      </div>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 flex flex-col gap-y-2 rounded-md border border-neutral-300 bg-white p-2.5 text-sm text-neutral-900 shadow-sm"
          >
            <Input
              name="link-text"
              icon="text"
              value={link.text}
              error={errors?.text}
              onChange={(event) => handleLink(event, 'text')}
              placeholder="Text"
              disableSupportingText
              required
            />
            <Input
              name="link-url"
              icon="link2"
              value={link.url}
              error={errors?.url}
              onChange={(event) => handleLink(event, 'url')}
              placeholder="URL"
              disableSupportingText
              required
            />
            <button
              type="button"
              onClick={insertLink}
              className="cursor-pointer h-9.5 rounded-md bg-neutral-950 font-medium text-white hover:bg-neutral-800"
            >
              <Icon icon="check" />
              Insert link
            </button>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}

interface ActiveFormats {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strike?: boolean
  orderedList?: boolean
  bulletList?: boolean
}

interface InputFile {
  name: string
  type: string
  preview: string
  rawFile: File | null
}
