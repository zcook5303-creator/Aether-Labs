import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 100 100">
          {/* Outer circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="5"/>
          {/* Center circle */}
          <circle cx="50" cy="50" r="10" fill="white"/>
          {/* Three blades - trefoil pattern */}
          <path d="M50,40 L35,15 A35,35 0 0,1 65,15 Z" fill="white"/>
          <path d="M42,55 L15,70 A35,35 0 0,1 30,35 Z" fill="white"/>
          <path d="M58,55 L85,70 A35,35 0 0,1 70,35 Z" fill="white"/>
        </svg>
        <h1 className="font-heading text-2xl font-medium text-white">Aether Labs</h1>
      </div>
    </div>
  );
}
