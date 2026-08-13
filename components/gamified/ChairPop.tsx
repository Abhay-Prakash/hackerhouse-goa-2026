'use client';
import { motion } from 'framer-motion';
import SmartAvatar from './SmartAvatar';

export default function ChairPop({ photo }: { photo: string | null }) {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 1 }}
        style={{ position: 'relative', width: 340, height: 260 }}
      >
        {/* Beach Chair */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/chair.png" alt="Beach Chair" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
        </div>

        {/* User sleeping on chair */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ position: 'absolute', top: 50, left: 110, zIndex: 10, transform: 'rotate(-15deg)' }}
        >
          {/* Head (rotated 90 deg to sleep) */}
          <div style={{ transform: 'rotate(-70deg)' }}>
            <SmartAvatar photo={photo} size={85} className="border-2 border-[var(--goa-yellow)]" />
            {/* Mini Cap */}
            <div style={{ position: 'absolute', top: -25, left: -5, width: 100, height: 60, zIndex: 11 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Cap.png" alt="Safari Cap" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          
          {/* Zzz Animation */}
          <motion.div
            animate={{ y: [0, -30], opacity: [0, 1, 0], scale: [0.5, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
            style={{ position: 'absolute', top: -40, right: -30, fontSize: 24, fontWeight: 'bold', color: '#00F0FF', textShadow: '0 0 10px #00F0FF' }}
          >
            Z
          </motion.div>
          <motion.div
            animate={{ y: [0, -40], opacity: [0, 1, 0], scale: [0.5, 1.4, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
            style={{ position: 'absolute', top: -60, right: -50, fontSize: 28, fontWeight: 'bold', color: '#FFE600', textShadow: '0 0 10px #FFE600' }}
          >
            z
          </motion.div>
          <motion.div
            animate={{ y: [0, -50], opacity: [0, 1, 0], scale: [0.5, 1.6, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1.6 }}
            style={{ position: 'absolute', top: -85, right: -75, fontSize: 36, fontWeight: 'bold', color: '#FF007A', textShadow: '0 0 10px #FF007A' }}
          >
            z
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
