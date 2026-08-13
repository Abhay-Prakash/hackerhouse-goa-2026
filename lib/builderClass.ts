// ─── Builder Class Determination ──────────────────────────────────────────────
// Maps Builder DNA (role + stack) to a dramatic Builder Class reveal.

export interface BuilderClassInfo {
  name: string;
  emoji: string;
  description: string;
}

// Base class per primary role
const ROLE_BASE: Record<string, BuilderClassInfo> = {
  'AI / ML':    { name: 'The Model Maker',            emoji: '', description: 'You speak fluent tensor.' },
  'Software':   { name: 'The Systems Builder',        emoji: '', description: 'You think in systems.' },
  'Product':    { name: 'The Product Hacker',         emoji: '', description: 'You ship ideas into reality.' },
  'Design':     { name: 'The Interface Architect',    emoji: '', description: 'You make screens feel alive.' },
  'Hardware':   { name: 'The Byte Bender',            emoji: '', description: 'You make atoms do your bidding.' },
  'Research':   { name: 'The Signal Hunter',          emoji: '', description: 'You find patterns in the noise.' },
  'Web':        { name: 'The Web Weaver',             emoji: '', description: 'The internet is your canvas.' },
  'Crypto':     { name: 'The Chain Breaker',          emoji: '', description: 'Decentralisation is your doctrine.' },
  'Automation': { name: 'The Automation Architect',   emoji: '', description: 'You automate what others repeat.' },
  'Other':      { name: 'The Builder',               emoji: '', description: "You build what doesn't exist yet." },
};

// Stack combinations that override the base class (checked in order)
const STACK_REFINEMENTS: Array<{
  stacks: string[];
  minMatch: number;
  result: BuilderClassInfo;
}> = [
  {
    stacks: ['Python', 'PyTorch', 'TensorFlow', 'JAX'],
    minMatch: 2,
    result: { name: 'The Code Alchemist', emoji: '', description: 'Turning raw data into intelligent systems.' },
  },
  {
    stacks: ['Rust', 'Go', 'C++', 'Zig'],
    minMatch: 2,
    result: { name: 'The Speed Daemon', emoji: '', description: 'Performance is your religion.' },
  },
  {
    stacks: ['React', 'Next.js', 'Vue.js', 'Svelte'],
    minMatch: 2,
    result: { name: 'The UI Sculptor', emoji: '', description: 'Every pixel has a purpose.' },
  },
  {
    stacks: ['Solidity', 'Web3.js', 'Ethereum', 'Move'],
    minMatch: 1,
    result: { name: 'The Chain Architect', emoji: '', description: 'You build on trustless foundations.' },
  },
  {
    stacks: ['Flutter', 'React Native', 'Swift', 'Kotlin'],
    minMatch: 2,
    result: { name: 'The App Craftsman', emoji: '', description: 'Billions of screens are your canvas.' },
  },
  {
    stacks: ['Arduino', 'Raspberry Pi', 'FPGA', 'VHDL'],
    minMatch: 1,
    result: { name: 'The Silicon Whisperer', emoji: '', description: 'You make hardware obey.' },
  },
  {
    stacks: ['Docker', 'Kubernetes', 'Terraform', 'Ansible'],
    minMatch: 2,
    result: { name: 'The Infrastructure Tactician', emoji: '', description: 'Your pipelines never sleep.' },
  },
  {
    stacks: ['Python', 'R', 'SQL', 'Spark'],
    minMatch: 2,
    result: { name: 'The Data Cartographer', emoji: '', description: 'You map the territory of data.' },
  },
];

export function determineBuilderClass(
  role?: string,
  stack?: string[]
): BuilderClassInfo {
  const base = role
    ? (ROLE_BASE[role] ?? ROLE_BASE['Other'])
    : ROLE_BASE['Other'];

  if (!stack || stack.length === 0) return base;

  for (const refinement of STACK_REFINEMENTS) {
    const matched = refinement.stacks.filter((s) => stack.includes(s)).length;
    if (matched >= refinement.minMatch) {
      return refinement.result;
    }
  }

  return base;
}
