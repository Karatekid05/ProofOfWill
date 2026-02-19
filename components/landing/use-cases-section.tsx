export function UseCasesSection() {
  const cases = [
    {
      tag: "Freelance",
      title: "You lock pay; they get it when you both mark done",
      body: "Cancel together → you get a refund. Disagree → funds stay locked until you agree.",
    },
    {
      tag: "Guarantee",
      title: "Both lock (e.g. freelancer stake); one receives",
      body: "Done together → freelancer gets both. Refund client → you get both. Same idea for bets.",
    },
    {
      tag: "Bets",
      title: "Two lock, two pick the winner",
      body: "Same amount each. Both agree who won → winner takes the pot. Cancel → each gets theirs back.",
    },
    {
      tag: "Safe",
      title: "No one can move the money alone",
      body: "Both must submit the same outcome onchain. No middleman.",
    },
  ]

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Use cases
          </span>
          <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            For freelance, bets, or any deal between two.
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
