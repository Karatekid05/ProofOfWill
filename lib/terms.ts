const STORAGE_KEY = "dualagree_terms_accepted"
const CURRENT_VERSION = "2025-02"

export function getTermsAccepted(): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(STORAGE_KEY) === CURRENT_VERSION
  } catch {
    return false
  }
}

export function setTermsAccepted(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, CURRENT_VERSION)
  } catch {
    // ignore
  }
}

export const TERMS_VERSION = CURRENT_VERSION
