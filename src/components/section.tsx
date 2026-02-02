export default function Section({
  id,
  title,
  description,
  children
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="flex flex-col gap-y-6 scroll-mt-2">
      <header>
        <h3 className="text-2xl font-medium">
          <a href={`#${id}`} className="hover:underline">
            {title}
          </a>
        </h3>
        <p className="text-neutral-600">{description}</p>
      </header>
      <main>{children}</main>
    </section>
  )
}
