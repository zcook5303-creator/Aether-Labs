import React, { useState } from 'react';
import { Users, X, QrCode, ScrollText, Plus } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function WelcomeScreen({ onNewChat }) {
  const [modal, setModal] = useState(null);

  const closeModal = () => setModal(null);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8" data-testid="welcome-screen">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <svg width="70" height="70" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="6"/>
            <circle cx="50" cy="50" r="8" fill="white"/>
            <path d="M50 42 L38 12 A38 38 0 0 1 62 12 Z" fill="white"/>
            <path d="M43 54 L13 72 A38 38 0 0 1 26 28 Z" fill="white"/>
            <path d="M57 54 L87 72 A38 38 0 0 1 74 28 Z" fill="white"/>
          </svg>
          <h1 className="font-heading text-3xl md:text-4xl font-medium text-white">Aether Labs</h1>
          <p className="text-white/50">How can I help you today?</p>
        </div>

        {/* Main Buttons */}
        <div className="space-y-3 pt-4">
          {/* New Chat - Primary button */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg transition-colors"
            data-testid="new-chat-button"
          >
            <Plus size={22} />
            New Chat
          </button>

          {/* Team Button */}
          <button
            onClick={() => setModal('team')}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors"
            data-testid="team-button"
          >
            <Users size={20} />
            Team
          </button>

          {/* Share QR Button */}
          <button
            onClick={() => setModal('qr')}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors"
            data-testid="qr-button"
          >
            <QrCode size={20} />
            Share QR
          </button>

          {/* Update Log Button */}
          <button
            onClick={() => setModal('log')}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors"
            data-testid="update-log-button"
          >
            <ScrollText size={20} />
            Update Log
          </button>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-white/20 pt-4">Founder: Zachary Cook</p>
      </div>

      {/* Team Modal */}
      {modal === 'team' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">Our Team</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            {/* Zachary Cook - Gold */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-600/30 to-amber-500/30 border border-yellow-500/30 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
                  <path d="M17.64 15L22 10.64"/>
                  <path d="M20 6l-3-3"/>
                  <path d="M9 3l3 3-6 6"/>
                </svg>
              </div>
              <div><p className="text-sm text-white font-semibold">Zachary Cook</p><p className="text-xs text-yellow-400/80">Founder & Owner</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center"><span className="text-indigo-400">D</span></div>
              <div><p className="text-sm text-white">Donna Cook</p><p className="text-xs text-white/50">App Tester</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center"><span className="text-indigo-400">K</span></div>
              <div><p className="text-sm text-white">Kaleb Youngblood</p><p className="text-xs text-white/50">App Tester</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center"><span className="text-indigo-400">K</span></div>
              <div><p className="text-sm text-white">Kane Youngblood</p><p className="text-xs text-white/50">App Tester</p></div>
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
            <div className="flex justify-center p-6 bg-white rounded-xl">
              <QRCodeSVG value={window.location.origin} size={180} />
            </div>
            <p className="text-xs text-white/50 text-center mt-4">Scan to open Aether Labs</p>
          </div>
        </div>
      )}

      {/* Update Log Modal */}
      {modal === 'log' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="font-heading text-lg font-semibold text-white">Update Log</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">v1.3.0</span>
                  <span className="text-xs text-white/40">Feb 5, 2026</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">Latest</span>
                </div>
                <p className="text-sm text-white/70 ml-2">• Simplified main menu</p>
                <p className="text-sm text-white/70 ml-2">• New tester: Kane Youngblood</p>
                <p className="text-sm text-white/70 ml-2">• Fixed radiation logo</p>
                <p className="text-sm text-white/70 ml-2">• Chat privacy - only see your chats</p>
                <p className="text-sm text-white/70 ml-2">• Zachary Cook gold profile</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">v1.2.0</span>
                  <span className="text-xs text-white/40">Feb 3, 2026</span>
                </div>
                <p className="text-sm text-white/70 ml-2">• QR code sharing</p>
                <p className="text-sm text-white/70 ml-2">• Update Log</p>
                <p className="text-sm text-white/70 ml-2">• Splash screen</p>
                <p className="text-sm text-white/70 ml-2">• New tester: Kaleb Youngblood</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">v1.1.0</span>
                  <span className="text-xs text-white/40">Feb 2, 2026</span>
                </div>
                <p className="text-sm text-white/70 ml-2">• Team button</p>
                <p className="text-sm text-white/70 ml-2">• ChatGPT-style layout</p>
                <p className="text-sm text-white/70 ml-2">• Mobile navigation fix</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">v1.0.0</span>
                  <span className="text-xs text-white/40">Feb 2, 2026</span>
                </div>
                <p className="text-sm text-white/70 ml-2">• Initial release</p>
                <p className="text-sm text-white/70 ml-2">• GPT-5.2 integration</p>
                <p className="text-sm text-white/70 ml-2">• Chat history</p>
                <p className="text-sm text-white/70 ml-2">• Dark theme</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
