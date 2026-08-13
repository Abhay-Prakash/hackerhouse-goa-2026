// ─── Verification Service ────────────────────────────────────────────────────
// Clean adapter pattern: swap MOCK → CSV → API without touching the frontend.

export interface VerificationResult {
  success: boolean;
  participantId?: string;
  name?: string;
  email?: string;
  stack?: string;
  error?: string;
}

// ─── Mock participant data (development) ─────────────────────────────────────
// Replace this with a real API call or CSV lookup in production.
const MOCK_PARTICIPANTS: Record<string, Omit<VerificationResult, 'success'>> = {
  'HH2026-001': { participantId: 'HH2026-001', name: 'Aryan Mehta', email: 'aryan@example.com', stack: 'Full Stack' },
  'HH2026-002': { participantId: 'HH2026-002', name: 'Priya Singh', email: 'priya@example.com', stack: 'AI/ML' },
  'HH2026-003': { participantId: 'HH2026-003', name: 'Dev Patel', email: 'dev@example.com', stack: 'Backend' },
  'HH2026-004': { participantId: 'HH2026-004', name: 'Mia Chen', email: 'mia@example.com', stack: 'Frontend' },
  'HH2026-005': { participantId: 'HH2026-005', name: 'Ravi Kumar', email: 'ravi@example.com', stack: 'DevOps' },
  // Registered emails as keys too
  'aryan@example.com': { participantId: 'HH2026-001', name: 'Aryan Mehta', email: 'aryan@example.com', stack: 'Full Stack' },
  'priya@example.com': { participantId: 'HH2026-002', name: 'Priya Singh', email: 'priya@example.com', stack: 'AI/ML' },
  'dev@example.com': { participantId: 'HH2026-003', name: 'Dev Patel', email: 'dev@example.com', stack: 'Backend' },
  'mia@example.com': { participantId: 'HH2026-004', name: 'Mia Chen', email: 'mia@example.com', stack: 'Frontend' },
  'ravi@example.com': { participantId: 'HH2026-005', name: 'Ravi Kumar', email: 'ravi@example.com', stack: 'DevOps' },
};

// ─── Adapter interface ────────────────────────────────────────────────────────
type VerificationAdapter = (identifier: string) => Promise<VerificationResult>;

// ─── Mock adapter (default for local dev) ────────────────────────────────────
const mockAdapter: VerificationAdapter = async (identifier: string) => {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 800));

  const normalized = identifier.trim().toUpperCase();
  // Try uppercase (for IDs like HH2026-001)
  const byId = MOCK_PARTICIPANTS[normalized] ?? MOCK_PARTICIPANTS[identifier.trim()];

  if (byId) {
    return { success: true, ...byId };
  }

  // Try lowercase email
  const byEmail = MOCK_PARTICIPANTS[identifier.trim().toLowerCase()];
  if (byEmail) {
    return { success: true, ...byEmail };
  }

  return {
    success: false,
    error: 'Registration not found. Please check your ID or email.',
  };
};

// ─── Future: API adapter ──────────────────────────────────────────────────────
// const apiAdapter: VerificationAdapter = async (identifier) => {
//   const res = await fetch('/api/verify', {
//     method: 'POST',
//     body: JSON.stringify({ identifier }),
//     headers: { 'Content-Type': 'application/json' },
//   });
//   return res.json();
// };

// ─── Active adapter selection ─────────────────────────────────────────────────
const activeAdapter: VerificationAdapter =
  process.env.NEXT_PUBLIC_VERIFICATION_MODE === 'api' ? mockAdapter : mockAdapter;
// Replace second `mockAdapter` with `apiAdapter` when ready.

// ─── Public API ───────────────────────────────────────────────────────────────
export async function verifyParticipant(identifier: string): Promise<VerificationResult> {
  if (!identifier.trim()) {
    return { success: false, error: 'Please enter your Registration ID or email.' };
  }
  return activeAdapter(identifier);
}
