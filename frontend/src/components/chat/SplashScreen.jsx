import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-4">
        <svg width="80" height="80" viewBox="-3 -3 6 6" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="trefoil-mask" maskUnits="userSpaceOnUse" x="-3" y="-3" width="6" height="6">
              <circle r="1.625" fill="none" stroke="#ffffff" strokeWidth="1.75" />
            </mask>
          </defs>
          <circle r="3" fill="#000000" />
          <circle r="0.5" fill="#ffffff" />
          <g mask="url(#trefoil-mask)">
            <g id="blade-group">
              <path id="blade" transform="rotate(30)" d="M0 0 V2.88 H3" fill="#ffffff" />
              <use href="#blade" transform="scale(-1 1)" fill="#ffffff" />
            </g>
            <use href="#blade-group" transform="rotate(120)" />
            <use href="#blade-group" transform="rotate(240)" />
          </g>
        </svg>
        <h1 className="font-heading text-2xl font-medium text-white">Aether Labs</h1>
      </div>
    </div>
  );
}
