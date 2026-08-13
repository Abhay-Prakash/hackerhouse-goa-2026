import React from 'react';

interface SmartAvatarProps {
  photo: string | null;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function SmartAvatar({ photo, size = 100, className = '', style }: SmartAvatarProps) {
  return (
    <div 
      className={`rounded-full overflow-hidden bg-[#e8e0d0] border-2 border-white shadow-lg flex items-center justify-center ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="Builder Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontSize: size * 0.4 }}>😎</span>
      )}
    </div>
  );
}
