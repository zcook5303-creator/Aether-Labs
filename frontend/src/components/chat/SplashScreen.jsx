import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <g fill="#ffffff" transform="translate(50,50)">
            <circle r="10"/>
            <path d="M0,-40 A40,40 0 0,1 34.64,20 L17.32,10 A20,20 0 0,0 0,-20 Z"/>
            <path d="M34.64,20 A40,40 0 0,1 -34.64,20 L-17.32,10 A20,20 0 0,0 17.32,10 Z"/>
            <path d="M-34.64,20 A40,40 0 0,1 0,-40 L0,-20 A20,20 0 0,0 -17.32,10 Z"/>
          </g>
        </svg>
        <h1 className="font-heading text-2xl font-medium text-white">Aether Labs</h1>
      </div>
    </div>
  );
}
