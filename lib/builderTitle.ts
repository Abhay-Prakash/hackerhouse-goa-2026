// ─── Builder Title Generator ──────────────────────────────────────────────────
// Extensible stack → fun builder title mapping.

export interface TitleRule {
  keywords: string[];
  title: string;
  emoji: string;
}

// Add new rules here — they are checked in order; first match wins.
export const TITLE_RULES: TitleRule[] = [
  { keywords: ['ai', 'ml', 'machine learning', 'data science', 'deep learning', 'llm', 'nlp'], title: 'The Model Whisperer', emoji: '🧠' },
  { keywords: ['devops', 'sre', 'platform', 'infra', 'infrastructure', 'cloud', 'k8s', 'kubernetes', 'docker'], title: 'The Infrastructure Hacker', emoji: '⚙️' },
  { keywords: ['backend', 'server', 'api', 'database', 'golang', 'rust', 'python', 'java', 'node'], title: 'The Systems Builder', emoji: '🔧' },
  { keywords: ['frontend', 'ui', 'ux', 'design', 'react', 'vue', 'svelte', 'css', 'html', 'figma'], title: 'The Interface Architect', emoji: '🎨' },
  { keywords: ['full stack', 'fullstack', 'full-stack', 'product', 'indie hacker', 'solopreneur'], title: 'The Product Hacker', emoji: '🚀' },
  { keywords: ['mobile', 'ios', 'android', 'flutter', 'react native', 'swift', 'kotlin'], title: 'The App Craftsman', emoji: '📱' },
  { keywords: ['blockchain', 'web3', 'crypto', 'defi', 'solidity', 'ethereum'], title: 'The Chain Breaker', emoji: '🔗' },
  { keywords: ['security', 'cyber', 'pentest', 'ctf', 'hacker', 'red team'], title: 'The Code Sentinel', emoji: '🛡️' },
  { keywords: ['game', 'unity', 'unreal', 'godot', 'gamedev'], title: 'The World Builder', emoji: '🎮' },
  { keywords: ['hardware', 'iot', 'embedded', 'firmware', 'arduino', 'raspberry'], title: 'The Byte Bender', emoji: '🔌' },
  { keywords: ['founder', 'ceo', 'entrepreneur', 'startup', 'business'], title: 'The Venture Hacker', emoji: '💡' },
  { keywords: ['open source', 'oss', 'contributor'], title: 'The Commons Builder', emoji: '🌐' },
];

const DEFAULT_TITLE: TitleRule = { keywords: [], title: 'The Builder', emoji: '⚡' };

export function getBuilderTitle(stackOrRole: string): TitleRule {
  const normalized = stackOrRole.toLowerCase();
  for (const rule of TITLE_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return rule;
    }
  }
  return DEFAULT_TITLE;
}
