"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Terms of Service
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Last updated: February 2025
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">1. Acceptance</h2>
            <p className="text-muted-foreground">
              By accessing or using DualAgree (the App, we, our), you agree to these Terms of Service. If you do not agree, do not use the App.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">2. Description of service</h2>
            <p className="text-muted-foreground">
              DualAgree is a web interface that lets you interact with smart contracts on the Arc Testnet (and any other networks we support) to create two-party agreements where funds (e.g. USDC) are locked until both parties submit the same resolution. The App does not custody your funds; the smart contracts and your wallet do. We do not act as a custodian, escrow agent, or intermediary.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">3. Testnet and experimental use</h2>
            <p className="text-muted-foreground">
              The App and the contracts it connects to may be deployed on testnets (e.g. Arc Testnet) and use test tokens. Testnets and test tokens have no real-world value. If we offer mainnet or production use in the future, that may involve real funds and additional risks. You use the App at your own risk.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">4. No warranty</h2>
            <p className="text-muted-foreground">
              The App and any related services are provided as is and as available without warranties of any kind, express or implied. We do not warrant that the App will be uninterrupted, error-free, or free of harmful code. We are not responsible for the correctness, security, or behaviour of the underlying smart contracts or blockchains.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">5. Not financial or legal advice</h2>
            <p className="text-muted-foreground">
              Nothing in the App or these Terms constitutes financial, investment, tax, or legal advice. You are solely responsible for your use of the App, your agreements with other parties, and compliance with applicable laws. You should seek independent advice before relying on the App for any material decisions.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">6. Your responsibility; keys and wallets</h2>
            <p className="text-muted-foreground">
              You are responsible for securing your wallet, private keys, and any credentials. We do not store or have access to your keys. Loss of access to your wallet may result in loss of funds with no recourse through us. Transactions on-chain are generally irreversible.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">7. Limitation of liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by applicable law, DualAgree and its operators, affiliates, and contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or funds, arising out of or related to your use or inability to use the App, the smart contracts, or any third-party services. Our total liability shall not exceed the amount you paid to us in the twelve (12) months preceding the claim (if any), or one hundred euros (€100), whichever is less.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">8. Disputes between users</h2>
            <p className="text-muted-foreground">
              Disputes between you and another user (e.g. over whether work was delivered or whether to release funds) are solely between you and that user. We are not a party to your agreements and do not resolve disputes. The smart contracts only release funds when both parties submit the same outcome; we have no control over that process.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">9. Prohibited use</h2>
            <p className="text-muted-foreground">
              You may not use the App for any illegal purpose, to violate any law, to defraud or harm others, or to circumvent the intended use of the smart contracts. We may restrict or terminate your access if we believe you have violated these Terms or applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">10. Changes</h2>
            <p className="text-muted-foreground">
              We may change these Terms at any time. Continued use of the App after changes are posted constitutes acceptance of the revised Terms. We will indicate the last updated date at the top of this page. For material changes we may provide additional notice where feasible (e.g. in the App or by email if we have it).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">11. Governing law and venue</h2>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of Portugal. Any dispute arising out of or relating to these Terms or the App shall be subject to the exclusive jurisdiction of the courts of Portugal, unless mandatory law requires otherwise.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">12. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms or the App, you may contact us at the repository or contact method indicated on the DualAgree project (e.g. GitHub repository or website).
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            These Terms are a summary for user protection and operational clarity. They do not replace professional legal advice. If you are using DualAgree for significant value or in a regulated context, you should have these Terms reviewed by a lawyer in your jurisdiction.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
