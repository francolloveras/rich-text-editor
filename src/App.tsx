import TextEditor from '@/components/rich-text-editor'
import Section from '@/components/section'
import { SECTIONS } from '@/lib/const'
import { useState } from 'react'
import { cx } from './lib/utils'

export default function App() {
  const [formValue, setFormValue] = useState<string | undefined>(undefined)

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const field = data.get(SECTIONS.FORM_VALUE.id)?.toString()

    setFormValue(field)
  }

  return (
    <main className="space-y-16">
      <Section id={SECTIONS.DEFAULT.id} title={SECTIONS.DEFAULT.label}>
        <TextEditor name={SECTIONS.DEFAULT.id} />
      </Section>
      <Section id={SECTIONS.DISABLED.id} title={SECTIONS.DISABLED.label}>
        <TextEditor name={SECTIONS.DISABLED.id} disabled />
      </Section>
      <Section id={SECTIONS.WITH_ICON.id} title={SECTIONS.WITH_ICON.label}>
        <TextEditor name={SECTIONS.WITH_ICON.id} icon="badgePlus" />
      </Section>
      <Section id={SECTIONS.WITH_LABEL.id} title={SECTIONS.WITH_LABEL.label}>
        <TextEditor name={SECTIONS.WITH_LABEL.id} label="Comment" required />
      </Section>
      <Section id={SECTIONS.WITH_ERROR.id} title={SECTIONS.WITH_ERROR.label}>
        <TextEditor
          name={SECTIONS.WITH_ERROR.id}
          error="The comment must be at least 10 characters long."
        />
      </Section>
      <Section id={SECTIONS.WITH_SUPPORTING_TEXT.id} title={SECTIONS.WITH_SUPPORTING_TEXT.label}>
        <TextEditor
          name={SECTIONS.WITH_SUPPORTING_TEXT.id}
          supportingText="You can paste images from the clipboard!"
        />
      </Section>
      <Section id={SECTIONS.FORM_VALUE.id} title={SECTIONS.FORM_VALUE.label}>
        <form onSubmit={handleOnSubmit}>
          <TextEditor name={SECTIONS.FORM_VALUE.id} />
          <footer className="flex justify-end mb-6">
            <button
              type="submit"
              className="cursor-pointer bg-neutral-900 text-white px-8 py-1.5 rounded-lg hover:bg-neutral-800"
            >
              Submit
            </button>
          </footer>
        </form>
        <div className="border border-neutral-300 rounded-md p-3 bg-white w-135">
          <h4 className="font-medium text-base">Form data</h4>
          <code className={cx({ 'italic text-neutral-600': formValue === undefined })}>
            {formValue ?? 'Submit the form to view the form data.'}
          </code>
        </div>
      </Section>
      <Section
        id={SECTIONS.DRAG_AND_DROP.id}
        title={SECTIONS.DRAG_AND_DROP.label}
        description={SECTIONS.DRAG_AND_DROP.description}
      >
        <div className="flex flex-col gap-y-4 justify-center">
          <div className="flex gap-x-2">
            <img
              src="/image-1.jpg"
              alt="demo image 1"
              className="h-44 block rounded-xl shadow-sm"
            />
            <img
              src="/image-2.jpg"
              alt="demo image 2"
              className="h-44 block rounded-xl shadow-sm"
            />
          </div>
          <TextEditor name={SECTIONS.FORM_VALUE.id} />
        </div>
      </Section>
      <Section
        id={SECTIONS.CLIPBOARD_FILES.id}
        title={SECTIONS.CLIPBOARD_FILES.label}
        description={SECTIONS.CLIPBOARD_FILES.description}
      >
        <TextEditor name={SECTIONS.CLIPBOARD_FILES.id} />
      </Section>
    </main>
  )
}
