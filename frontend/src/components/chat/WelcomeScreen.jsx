import React, { useState } from 'react';
import { Users, X, QrCode, ScrollText, Plus, Star } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Radiation logo SVG component
function RadiationLogo({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="-3 -3 6 6" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="trefoil-mask-logo" maskUnits="userSpaceOnUse" x="-3" y="-3" width="6" height="6">
          <circle r="1.625" fill="none" stroke="#ffffff" strokeWidth="1.75" />
        </mask>
      </defs>
      <circle r="3" fill="#000000" />
      <circle r="0.5" fill="#ffffff" />
      <g mask="url(#trefoil-mask-logo)">
        <g id="blade-group-logo">
          <path id="blade-logo" transform="rotate(30)" d="M0 0 V2.88 H3" fill="#ffffff" />
          <use href="#blade-logo" transform="scale(-1 1)" fill="#ffffff" />
        </g>
        <use href="#blade-group-logo" transform="rotate(120)" />
        <use href="#blade-group-logo" transform="rotate(240)" />
      </g>
    </svg>
  );
}

export default function WelcomeScreen({ onNewChat, theme = 'dark' }) {
  const [modal, setModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const closeModal = () => {
    setModal(null);
    if (modal === 'review') {
      setRating(0);
      setSubmitted(false);
    }
  };

  const handleRating = (stars) => {
    setRating(stars);
    setSubmitted(true);
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-4 py-8 ${theme === 'light' ? 'bg-zinc-100 text-zinc-900' : ''}`} data-testid="welcome-screen">
      <div className={`max-w-md w-full text-center space-y-6 ${theme === 'light' ? 'bg-white/95 rounded-3xl shadow-xl px-6 py-8' : ''}`}>
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <RadiationLogo size={70} />
          <h1 className={`font-heading text-3xl md:text-4xl font-medium ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>Aether Labs</h1>
          <p className={theme === 'light' ? 'text-zinc-500' : 'text-white/50'}>How can I help you today?</p>
        </div>

        {/* Main Buttons */}
        <div className="space-y-3 pt-2">
          <button onClick={onNewChat} className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium text-lg transition-colors ${theme === 'light' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`} data-testid="new-chat-button">
            <Plus size={22} />New Chat
          </button>
          <button onClick={() => setModal('team')} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors" data-testid="team-button">
            <Users size={20} />Team
          </button>
          <button onClick={() => setModal('review')} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors" data-testid="review-button">
            <Star size={20} />Leave a Review
          </button>
          <button onClick={() => setModal('qr')} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors" data-testid="qr-button">
            <QrCode size={20} />Share QR
          </button>
          <button onClick={() => setModal('log')} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors" data-testid="update-log-button">
            <ScrollText size={20} />Update Log
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 space-y-2">
          <button onClick={() => setModal('aether')} className="text-[11px] text-white/30 hover:text-white/60 transition-colors underline underline-offset-2" data-testid="aether-meaning-button">Aether?</button>
          <p className="text-[11px] text-white/20">Founder: Zachary Cook</p>
        </div>
      </div>

      {/* Review Modal - 5 Stars */}
      {modal === 'review' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">Rate Aether Labs</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            
            {submitted ? (
              <div className="text-center py-6">
                <div className="flex justify-center gap-2 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={32} fill="#FFD700" stroke="#FFD700" />
                  ))}
                </div>
                <p className="text-xl font-semibold text-white">Thanks for your feedback!</p>
              </div>
            ) : (
              <div>
                <p className="text-white/60 text-center mb-6">Tap a star to rate</p>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => handleRating(star)} className="p-1 hover:scale-110 transition-transform" data-testid={`star-${star}`}>
                      <Star size={36} fill={rating >= star ? "#FFD700" : "transparent"} stroke="#FFD700" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Modal */}
      {modal === 'team' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
              <h2 className="font-heading text-lg font-semibold text-white">Our Team</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-600/30 to-amber-500/30 border border-yellow-500/30 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
                    <path d="M17.64 15L22 10.64"/><path d="M20 6l-3-3"/><path d="M9 3l3 3-6 6"/>
                  </svg>
                </div>
                <div><p className="text-sm text-white font-semibold">Zachary Cook</p><p className="text-xs text-yellow-400/80">Founder & Owner</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-500/20 to-slate-400/20 border border-gray-300/40 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-slate-300 flex items-center justify-center shadow-lg shadow-gray-400/30">
                  <span className="text-sm font-semibold text-gray-900">D</span>
                </div>
                <div><p className="text-sm text-white">Donna Cook</p><p className="text-xs text-gray-300">App Tester (Ripple)</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-500/20 to-slate-400/20 border border-gray-300/40 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-slate-300 flex items-center justify-center shadow-lg shadow-gray-400/30">
                  <span className="text-sm font-semibold text-gray-900">K</span>
                </div>
                <div><p className="text-sm text-white">Kaleb Youngblood</p><p className="text-xs text-gray-300">App Tester</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-500/20 to-slate-400/20 border border-gray-300/40 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-slate-300 flex items-center justify-center shadow-lg shadow-gray-400/30">
                  <span className="text-sm font-semibold text-gray-900">K</span>
                </div>
                <div><p className="text-sm text-white">Kane Youngblood</p><p className="text-xs text-gray-300">App Tester</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-500/20 to-slate-400/20 border border-gray-300/40 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-slate-300 flex items-center justify-center shadow-lg shadow-gray-400/30">
                  {/* Guitar icon for Billy */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2933" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="16" r="3" fill="#e5e7eb" stroke="#1f2933" />
                    <path d="M10 14 L17 7" />
                    <path d="M18 6 L20 4" />
                    <path d="M16.5 5.5 L18.5 3.5" />
                    <path d="M17 9 L19 7" />
                  </svg>
                </div>
                <div><p className="text-sm text-white">Billy Cook</p><p className="text-xs text-gray-300">App Tester</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-500/20 to-slate-400/20 border border-gray-300/40">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-slate-300 flex items-center justify-center shadow-lg shadow-gray-400/30">
                  <span className="text-sm font-semibold text-gray-900">N</span>
                </div>
                <div><p className="text-sm text-white">Naomi Cook</p><p className="text-xs text-gray-300">App Tester</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {modal === 'qr' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">Share App</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="flex justify-center p-6 bg-white rounded-xl"><QRCodeSVG value={window.location.href} size={180} /></div>
            <p className="text-xs text-white/50 text-center mt-4">Scan to open Aether Labs</p>
          </div>
        </div>
      )}

      {/* Update Log Modal - Simplified */}
      {modal === 'log' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">Update Log</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-sm font-semibold text-white">v1.6 <span className="text-indigo-400 text-xs ml-2">Latest</span></p>
                <p className="text-xs text-white/60 mt-1">Reviews, team updates, new logo</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-sm font-semibold text-white">v1.5</p>
                <p className="text-xs text-white/60 mt-1">Image generation in chat</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-sm font-semibold text-white">v1.0</p>
                <p className="text-xs text-white/60 mt-1">Initial release with GPT-5.2</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aether Meaning Modal */}
      {modal === 'aether' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">What is AETHER?</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">A</span><span className="text-white/80">Artificial</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">E</span><span className="text-white/80">Engineering</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">T</span><span className="text-white/80">Technology</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">H</span><span className="text-white/80">Hyper Systems</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">E</span><span className="text-white/80">Energy</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">R</span><span className="text-white/80">Robotics</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
