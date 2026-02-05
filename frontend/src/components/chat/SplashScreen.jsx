import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 100 100">
          {/* Radiation trefoil symbol */}
          <circle cx="50" cy="50" r="8" fill="white"/>
          {/* Three blades */}
          <path d="M50 42 L50 8 A42 42 0 0 1 86 71 L58 55 A16 16 0 0 0 50 42" fill="white"/>
          <path d="M42 55 L14 71 A42 42 0 0 1 50 8 L50 42 A16 16 0 0 0 42 55" fill="white"/>
          <path d="M58 55 L86 71 A42 42 0 0 1 14 71 L42 55 A16 16 0 0 0 58 55" fill="white"/>
        </svg>
        <h1 className="font-heading text-2xl font-medium text-white">Aether Labs</h1>
      </div>
    </div>
  );
}
