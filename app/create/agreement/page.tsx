import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AgreementForm } from "@/components/create/agreement-form"

export default function CreateAgreementPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-6 py-14 md:py-20">
          <div className="mb-10 flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              New agreement
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Two-party agreement
            </h1>
            <p className="text-sm text-muted-foreground">
              One deposits or both deposit. The other party must accept; money only moves when both submit the same resolution.
            </p>
          </div>

          <AgreementForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
