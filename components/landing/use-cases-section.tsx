export function UseCasesSection() {
  const cases = [
    {
      tag: "Freelancers",
      title: "Escrow that bites back",
      body: "Lock payment before starting work. Deliver on time, get paid. Miss the deadline, the client keeps your deposit.",
    },
    {
      tag: "Founders",
      title: "Ship-or-slash milestones",
      body: "Tie capital to quarterly targets. Your investors see real commitment -- not slides, not promises, locked USDC.",
    },
    {
      tag: "DAOs",
      title: "Trustless contributor accountability",
      body: "Grant recipients lock a portion against deliverables. The DAO treasury gets automatic enforcement without governance votes.",
    },
    {
      tag: "Personal",
      title: "The most expensive alarm clock",
      body: "Want to quit smoking? Ship a side project? Put $500 behind it. Losing money hurts more than losing motivation.",
    },
  ]

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Use cases
          </span>
          <h2 className="mt-2 max-w-lg text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Not a habit tracker. A financial accountability layer.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {cases.map((c) => (
            <div
              key={c.tag}
              className="group flex flex-col gap-4 rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary/30 md:p-8"
            >
              <span className="w-fit font-mono text-[11px] uppercase tracking-wider text-primary">
                {c.tag}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
