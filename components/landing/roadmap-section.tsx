export function RoadmapSection() {
  const phases = [
    {
      phase: "Live now",
      title: "Dual consensus agreements",
      body: "Two parties, both submit the same outcome to release. One deposits or both deposit (freelancer guarantee, bets). Plus legacy commitments (single verifier). All on Arc Testnet.",
    },
    {
      phase: "Next",
      title: "Disputes and timeouts",
      body: "When one says done and the other cancel: add a deadline for the other to respond. If no response, apply a default (e.g. refund to depositor). Defined at agreement creation.",
    },
    {
      phase: "Later",
      title: "Protocol fee and arbitration",
      body: "Small fee on resolution to sustain the project. Optional: arbitration or escalation if the two never agree (e.g. third party decides).",
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
            Roadmap
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
