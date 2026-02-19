import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CommitmentForm } from "@/components/create/commitment-form"

export default function CreatePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-6 py-14 md:py-20">
          <div className="mb-10 flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              New Commitment
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Lock capital to a goal
            </h1>
            <p className="text-sm text-muted-foreground">
              Define your terms, choose a verifier, and lock USDC into the vault.
            </p>
          </div>

          <CommitmentForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
