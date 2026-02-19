export interface Commitment {
  id: number
  title: string
  description: string
  creator: string
  amount: number
  deadline: Date
  verifier: string
  penaltyReceiver: string
  resolved: boolean
  success: boolean
  createdAt: Date
}

// Demo commitments for the dashboard
export const demoCommitments: Commitment[] = [
  {
    id: 0,
    title: "Ship MVP by end of Q1",
    description: "Complete and launch the minimum viable product for the DeFi aggregator project.",
    creator: "0x1a2b...3c4d",
    amount: 5000,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    verifier: "0x5e6f...7a8b",
    penaltyReceiver: "0x9c0d...1e2f",
    resolved: false,
    success: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 1,
    title: "Complete smart contract audit",
    description: "Finish the full security audit of the lending protocol contracts.",
    creator: "0x3a4b...5c6d",
    amount: 2500,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    verifier: "0x7e8f...9a0b",
    penaltyReceiver: "0x1c2d...3e4f",
    resolved: false,
    success: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "Deliver design system v2",
    description: "Complete the redesign of all core components for the design system.",
    creator: "0x5a6b...7c8d",
    amount: 1500,
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    verifier: "0x9e0f...1a2b",
    penaltyReceiver: "0x3c4d...5e6f",
    resolved: true,
    success: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "Freelance website project",
    description: "Build and deploy the client portfolio website with CMS integration.",
    creator: "0x7a8b...9c0d",
    amount: 3000,
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    verifier: "0x1e2f...3a4b",
    penaltyReceiver: "0x5c6d...7e8f",
    resolved: true,
    success: false,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: "DAO governance proposal",
    description: "Draft and submit the tokenomics restructuring proposal to the DAO.",
    creator: "0x9a0b...1c2d",
    amount: 1000,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    verifier: "0x3e4f...5a6b",
    penaltyReceiver: "0x7c8d...9e0f",
    resolved: false,
    success: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
]

export function getStatusLabel(commitment: Commitment): "active" | "pending" | "succeeded" | "failed" {
  if (commitment.resolved) {
    return commitment.success ? "succeeded" : "failed"
  }
  if (new Date() >= commitment.deadline) {
    return "pending"
  }
  return "active"
}

export function getTimeRemaining(deadline: Date): string {
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()

  if (diff <= 0) return "Expired"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days}d ${hours}h remaining`
  return `${hours}h remaining`
}
