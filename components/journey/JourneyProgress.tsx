'use client';

import type { JourneyStep, BuilderProfile } from '@/lib/types';

interface Props {
  currentStep: JourneyStep;
  progressSteps: readonly JourneyStep[];
  profile: BuilderProfile;
}

const STEP_META: Record<string, { label: string; icon: string }> = {
  portrait:      { label: 'PORTRAIT',   icon: '📸' },
  'builder-dna': { label: 'DNA',        icon: '🧬' },
  tribe:         { label: 'TRIBE',      icon: '👥' },
  reveal:        { label: 'REVEAL',     icon: '✦' },
};

export default function JourneyProgress({ currentStep, progressSteps }: Props) {
  // Determine index for currentStep
  let currentIdx = progressSteps.indexOf(currentStep as typeof progressSteps[number]);
  if (currentStep === 'builder-class') {
    // builder-class is right after tribe (index 2 in ['portrait','builder-dna','tribe','reveal'])
    currentIdx = 2;
  }

  return (
    <div className="stamp-strip">
      {progressSteps.map((step, i) => {
        const meta = STEP_META[step] ?? { label: String(step).toUpperCase(), icon: '●' };
        const isDone = currentIdx > i || currentStep === 'complete';
        const isActive = currentIdx === i;

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div className={`stamp ${isDone ? 'done' : isActive ? 'active' : ''}`} style={{ flex: 1 }}>
              <div className="stamp-circle">
                {isDone ? '✓' : meta.icon}
              </div>
              <span className="stamp-label">{meta.label}</span>
            </div>
            {i < progressSteps.length - 1 && (
              <div
                className={`stamp-connector ${isDone ? 'done' : ''}`}
                style={{ flex: 1 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
