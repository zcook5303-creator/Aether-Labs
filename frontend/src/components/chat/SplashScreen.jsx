import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 100 100">
          {/* Outer circle */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="6"/>
          {/* Center circle */}
          <circle cx="50" cy="50" r="8" fill="white"/>
          {/* Three blades */}
          <path d="M50 42 L38 12 A38 38 0 0 1 62 12 Z" fill="white"/>
          <path d="M43 54 L13 72 A38 38 0 0 1 26 28 Z" fill="white"/>
          <path d="M57 54 L87 72 A38 38 0 0 1 74 28 Z" fill="white"/>
        </svg>
        <h1 className="font-heading text-2xl font-medium text-white">Aether Labs</h1>
      </div>
    </div>
  );
}
