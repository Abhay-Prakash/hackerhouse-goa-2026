'use client';
import { motion } from 'framer-motion';
import SmartAvatar from './SmartAvatar';

export default function CapPop({ photo }: { photo: string | null }) {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      {/* 2.5D Composite Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.6, duration: 1 }}
        style={{ position: 'relative', width: 220, height: 220 }}
      >
        {/* User's head */}
        <div style={{ position: 'absolute', top: 70, left: 45 }}>
          <SmartAvatar photo={photo} size={130} />
        </div>
        
        {/* Safari Cap absolute positioned on top of the head */}
        <motion.div 
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, left: 10, width: 200, height: 120, zIndex: 10 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Cap.png" alt="Safari Cap" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}
