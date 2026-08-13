import React from 'react';

interface Props {
  orientation: 'horizontal' | 'vertical';
  size: number;
  length: number;
}

export default function TribalBorder({ orientation, size, length }: Props) {
  const isHorizontal = orientation === 'horizontal';
  const w = isHorizontal ? length : size;
  const h = isHorizontal ? size : length;

  return (
    <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
      <defs>
        <pattern
          id={`tribal-${size}`}
          x="0"
          y="0"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          {/* Base yellow stripe */}
          <rect x="0" y="0" width={size} height={size} fill="rgb(235,190,20)" />
          {/* Red diamond */}
          <polygon
            points={`0,${size/2} ${size/2},0 ${size},${size/2} ${size/2},${size}`}
            fill="rgb(210,25,50)"
          />
          {/* Green diamond cutout */}
          <polygon
            points={`${size/4},${size/2} ${size/2},${size/4} ${size*0.75},${size/2} ${size/2},${size*0.75}`}
            fill="rgb(18,70,48)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#tribal-${size})`} />
    </svg>
  );
}
