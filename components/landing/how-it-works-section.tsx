export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Agree and lock",
      body: "The two parties set amount, deadline, and what counts as «done» or «cancel». One or both lock USDC onchain (one-deposits: only the payer; both-deposit: each locks their stake). Everything is recorded on the contract.",
    },
    {
      num: "02",
      title: "Work or play out",
      body: "The work is delivered or the event (game, milestone) happens. Funds sit in the vault. No one can move them alone.",
    },
    {
      num: "03",
      title: "Resolve by consensus",
      body: "Each party submits their decision onchain (done, cancel, or who won). The contract only releases funds when both submissions match: to the worker, back to the client, or to the bet winner. No match means funds stay locked.",
    },
  ]

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              Mechanism
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              How it works
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Lock → execute → both submit the same outcome. Money only moves with consensus.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col gap-4 bg-card p-6 md:p-8">
              <span className="font-mono text-3xl font-bold text-border">{step.num}</span>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
