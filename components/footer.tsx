export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary font-mono text-[10px] font-bold text-primary-foreground">
            {"PW"}
          </div>
          <span className="text-xs text-muted-foreground">
            proof of will
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs text-muted-foreground">
            No backend. No middlemen. Just code.
          </span>
          <span className="hidden h-3 w-px bg-border md:block" />
          <span className="hidden text-xs text-muted-foreground md:block">
            Sepolia Testnet
          </span>
        </div>
      </div>
    </footer>
  )
}
