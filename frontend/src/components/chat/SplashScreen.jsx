import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="white"/>
          <circle cx="50" cy="50" r="12" fill="black"/>
          <path d="M50 10 A40 40 0 0 1 84.64 70 L60 58 A16 16 0 0 0 50 26 Z" fill="black"/>
          <path d="M84.64 70 A40 40 0 0 1 15.36 70 L40 58 A16 16 0 0 0 60 58 Z" fill="black"/>
          <path d="M15.36 70 A40 40 0 0 1 50 10 L50 26 A16 16 0 0 0 40 58 Z" fill="black"/>
        </svg>
        <h1 className="font-heading text-2xl font-medium text-white">Aether Labs</h1>
      </div>
    </div>
  );
}
