import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Subtle noise texture via a CSS pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          {/* Left side -- big statement */}
          <div className="flex flex-col lg:max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 max-w-12 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                Escrow where both must agree
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-[4.5rem]">
              Money only moves
              <br />
              when <span className="text-primary">both</span> agree.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              Freelance: you lock pay, they get it when you both mark done. Bets: you both lock; you both pick the winner. No deal? Funds stay locked.
            </p>
            <ul className="mt-4 max-w-lg list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>One deposits or both deposit (e.g. freelancer guarantee)</li>
              <li>Other party accepts; both submit the same outcome to release</li>
            </ul>

            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/create/agreement"
                className="inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Create agreement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center px-1 text-sm font-medium text-muted-foreground underline underline-offset-4 decoration-border transition-colors hover:text-foreground hover:decoration-foreground"
              >
                View dashboard
              </Link>
            </div>
          </div>

          {/* Right side -- network info */}
          <div className="w-full shrink-0 lg:max-w-xs">
            <div className="rounded-sm border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Network
                </span>
              </div>
              <div className="flex flex-col divide-y divide-border">
                {[
                  { label: "Chain", value: "Arc Testnet" },
                  { label: "Asset", value: "USDC" },
                  { label: "Resolution", value: "Dual consensus" },
                  { label: "Custody", value: "On-chain" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <span className="font-mono text-sm font-semibold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
