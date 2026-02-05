import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 512 512" fill="white">
          <path d="M256 200c-30.9 0-56 25.1-56 56s25.1 56 56 56 56-25.1 56-56-25.1-56-56-56zm0-144c-17.7 0-32 14.3-32 32v67.4c-60.8 17.9-105.6 74.8-105.6 141.6 0 11.6 1.3 22.9 3.9 33.8l-58.5 33.8c-15.3 8.8-20.5 28.4-11.7 43.7s28.4 20.5 43.7 11.7l58.5-33.8c31.8 36.1 78.5 59 130.7 59s98.9-22.9 130.7-59l58.5 33.8c15.3 8.8 34.9 3.6 43.7-11.7s3.6-34.9-11.7-43.7l-58.5-33.8c2.5-10.9 3.9-22.2 3.9-33.8 0-66.8-44.8-123.7-105.6-141.6V88c0-17.7-14.3-32-32-32z"/>
        </svg>
        <h1 className="font-heading text-2xl font-medium text-white">Aether Labs</h1>
      </div>
    </div>
  );
}
