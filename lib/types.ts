// ─── Central Journey Types ────────────────────────────────────────────────────

export type JourneyStep =
  | 'arrival'
  | 'portrait'
  | 'builder-dna'
  | 'tribe'
  | 'builder-class'
  | 'reveal'
  | 'complete';

export interface BuilderProfile {
  builderId: string;
  registrationId?: string;
  verified: boolean;

  name: string;
  photo?: string;           // processed square data URL

  primaryRole?: string;     // e.g. "AI / ML"
  stack?: string[];         // e.g. ["Python", "PyTorch"]

  tribe?: 'solo' | 'team';
  teamName?: string;

  builderClass?: string;
  builderClassEmoji?: string;
  builderClassDescription?: string;

  createdAt?: string;
  cardId?: string;
}
