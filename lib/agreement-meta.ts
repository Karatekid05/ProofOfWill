const STORAGE_PREFIX = "agreementMeta:"

export interface AgreementMeta {
  title: string
  description: string
}

export function getAgreementMeta(id: number): AgreementMeta | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AgreementMeta
    return { title: parsed?.title ?? "", description: parsed?.description ?? "" }
  } catch {
    return null
  }
}

export function setAgreementMeta(id: number, meta: AgreementMeta): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(meta))
  } catch {
    // ignore
  }
}
