import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 100 100">
          {/* Center circle */}
          <circle cx="50" cy="50" r="10" fill="white"/>
          {/* Three triangular blades - 120 degrees apart */}
          {/* Blade pointing up (12 o'clock) */}
          <path d="M50 40 L35 10 L65 10 Z" fill="white"/>
          {/* Blade pointing bottom-right (4 o'clock) */}
          <path d="M58 54 L88 64 L73 90 Z" fill="white"/>
          {/* Blade pointing bottom-left (8 o'clock) */}
          <path d="M42 54 L27 90 L12 64 Z" fill="white"/>
        </svg>
        <h1 className="font-heading text-2xl font-medium text-white">Aether Labs</h1>
      </div>
    </div>
  );
}
