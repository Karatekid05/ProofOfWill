export function UseCasesSection() {
  const cases = [
    {
      tag: "One deposits, one receives",
      title: "Client locks pay; freelancer receives when both agree",
      body: "The client locks the payment in USDC. The worker delivers and marks «done». The money only goes to the worker when the client also marks «done». If both mark «cancel», the client gets their funds back. If one says done and the other cancel, it goes to dispute until consensus. No one can move the funds alone.",
    },
    {
      tag: "Both deposit, one receives",
      title: "Freelancer guarantee: both stake, client can get both back",
      body: "Client and freelancer both lock funds (e.g. client locks the fee, freelancer locks a guarantee). When both agree «completed», the freelancer receives both amounts. When both agree «cancel», each gets their own back. If the freelancer doesn't deliver and both agree «refund client», the client gets both — so the freelancer's stake protects the client from being scammed. Same logic for bets: both put in the same amount; one wins the pot when both agree on the outcome.",
    },
    {
      tag: "Bets between friends",
      title: "Two lock, two decide the winner",
      body: "Each locks e.g. $10. After the game, both come to the app and must agree on who won — the winner takes the pot. If they agree to cancel, each gets their stake back. No agreement means funds stay locked until consensus. No cheating: both must sign the same result.",
    },
    {
      tag: "Anti-scam",
      title: "No one can take the money alone",
      body: "Current MVP uses a single verifier. Next: dual consensus — both parties must submit the same decision onchain. Timeouts and dispute rules (e.g. deadline to respond, or arbitration) can follow.",
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
            Freelance, bets, agreements: money only moves when both agree.
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
