'use client';
import { motion } from 'framer-motion';
import SmartAvatar from './SmartAvatar';

export default function TreePop({ photo }: { photo: string | null }) {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 1.2 }}
        style={{ position: 'relative', width: 320, height: 350 }}
      >
        {/* Coconut Tree (Main background) */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tree.png" alt="Coconut Tree" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.4))' }} />
        </div>

        {/* User's head with cap, standing under the tree */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ position: 'absolute', bottom: 20, right: 30, zIndex: 10 }}
        >
          {/* Head */}
          <SmartAvatar photo={photo} size={90} className="border-4 border-[var(--goa-yellow)]" />
          {/* Mini Cap */}
          <div style={{ position: 'absolute', top: -35, left: -10, width: 110, height: 70, zIndex: 11 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Cap.png" alt="Safari Cap" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
