import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardView } from "@/components/dashboard/dashboard-view"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
          <div className="mb-10 flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              Dashboard
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Your commitments
            </h1>
            <p className="text-sm text-muted-foreground">
              Track, manage, and resolve your onchain commitments.
            </p>
          </div>

          <DashboardView />
        </div>
      </main>
      <Footer />
    </div>
  )
}
