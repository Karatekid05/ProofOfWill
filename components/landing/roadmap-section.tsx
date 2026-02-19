export function RoadmapSection() {
  const phases = [
    {
      phase: "Today (MVP)",
      title: "Single verifier",
      body: "One party locks capital; creator or verifier can resolve (success / fail). You can already use it for commitments with a third party confirming.",
    },
    {
      phase: "Next",
      title: "Dual consensus + two types",
      body: "New contract: two parties. Money only moves when both submit the same decision onchain. Two modes: (1) One deposits, one receives — e.g. client locks, freelancer gets paid when both agree. (2) Both deposit, one receives — e.g. freelancer guarantee; client can get both stakes back if both agree the work wasn't delivered. Same for bets: both lock, one wins the pot when both agree.",
    },
    {
      phase: "Later",
      title: "Disputes and timeouts",
      body: "If one says done and the other cancel: deadline for the other party to respond (e.g. 7 days). If no response, default rule (e.g. refund to depositor) or future arbitration. All defined at agreement creation.",
    },
    {
      phase: "Sustainability",
      title: "Protocol fee",
      body: "Small fee on resolution (e.g. 0.5–1% of released amount, or fixed fee per agreement) to sustain the project. Optional: part of the fee as incentives. To be decided with the community.",
    },
  ]

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Roadmap
          </span>
          <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            From single verifier to dual consensus, disputes and fee
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {phases.map((p) => (
            <div
              key={p.phase}
              className="flex flex-col gap-3 rounded-sm border border-border bg-card p-6 md:p-8"
            >
              <span className="w-fit font-mono text-[11px] uppercase tracking-wider text-primary">
                {p.phase}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
