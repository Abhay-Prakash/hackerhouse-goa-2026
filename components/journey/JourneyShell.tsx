'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { BuilderProfile, JourneyStep } from '@/lib/types';

import JourneyProgress from './JourneyProgress';
import ArrivalStep from './ArrivalStep';
import PortraitStep from './PortraitStep';
import BuilderDnaStep from './BuilderDnaStep';
import TribeStep from './TribeStep';
import BuilderClassStep from './BuilderClassStep';
import RevealStep from './RevealStep';
import FinalStep from './FinalStep';

const PROGRESS_STEPS = ['portrait', 'builder-dna', 'tribe', 'reveal'] as const;

// Vertical Scroll Down Transitions (Requested format)
const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function JourneyShell() {
  const [step, setStep] = useState<JourneyStep>('arrival');
  const [direction, setDirection] = useState(1); // 1 = forward down, -1 = back up
  const [profile, setProfile] = useState<BuilderProfile>(() => ({
    builderId: `HH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    verified: true,
    name: '',
  }));

  const advance = useCallback((to: JourneyStep) => {
    setDirection(1);
    setStep(to);
  }, []);

  const goBack = useCallback((to: JourneyStep) => {
    setDirection(-1);
    setStep(to);
  }, []);

  const updateProfile = useCallback((patch: Partial<BuilderProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const showProgress = step !== 'arrival';

  return (
    <div style={{ background: 'var(--bg-void)', minHeight: '100svh', overflow: 'hidden', position: 'relative' }}>
      {showProgress && (
        <JourneyProgress
          currentStep={step}
          progressSteps={PROGRESS_STEPS}
          profile={profile}
        />
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {step === 'arrival' && (
            <ArrivalStep onStart={() => advance('portrait')} />
          )}

          {step === 'portrait' && (
            <PortraitStep
              initialName={profile.name}
              onComplete={(photo, name) => {
                updateProfile({ photo, name });
                advance('builder-dna');
              }}
              onBack={() => goBack('arrival')}
            />
          )}

          {step === 'builder-dna' && (
            <BuilderDnaStep
              onComplete={(role, stack) => {
                updateProfile({ primaryRole: role, stack });
                advance('tribe');
              }}
              onBack={() => goBack('portrait')}
            />
          )}

          {step === 'tribe' && (
            <TribeStep
              onComplete={(tribe, teamName) => {
                updateProfile({ tribe, teamName });
                advance('builder-class');
              }}
              onBack={() => goBack('builder-dna')}
            />
          )}

          {step === 'builder-class' && (
            <BuilderClassStep
              role={profile.primaryRole}
              stack={profile.stack}
              onComplete={(cls, emoji, desc) => {
                updateProfile({ builderClass: cls, builderClassEmoji: emoji, builderClassDescription: desc });
                advance('reveal');
              }}
            />
          )}

          {step === 'reveal' && (
            <RevealStep
              profile={profile}
              onUpdateProfile={updateProfile}
              onEnterHouse={() => advance('complete')}
              onRebuild={() => goBack('portrait')}
            />
          )}

          {step === 'complete' && (
            <FinalStep profile={profile} onRestart={() => {
              setProfile({ builderId: `HH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, verified: true, name: '' });
              advance('arrival');
            }} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
