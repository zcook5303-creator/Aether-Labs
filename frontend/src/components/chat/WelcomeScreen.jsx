import React, { useState } from 'react';
import { Code, FileText, Lightbulb, Rocket, Users, X, QrCode, ScrollText } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function WelcomeScreen({ onSuggestedPrompt }) {
  const [modal, setModal] = useState(null);

  const closeModal = () => setModal(null);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8" data-testid="welcome-screen">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <svg width="60" height="60" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="5"/>
            <circle cx="50" cy="50" r="10" fill="white"/>
            <path d="M50,40 L35,15 A35,35 0 0,1 65,15 Z" fill="white"/>
            <path d="M42,55 L15,70 A35,35 0 0,1 30,35 Z" fill="white"/>
            <path d="M58,55 L85,70 A35,35 0 0,1 70,35 Z" fill="white"/>
          </svg>
          <h1 className="font-heading text-3xl md:text-4xl font-medium text-white">Aether Labs</h1>
          <p className="text-white/50 text-lg">How can I help you today?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => onSuggestedPrompt('Help me write a Python function')} className="flex items-start gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left">
            <Code size={20} className="text-white/40 mt-0.5" />
            <div><p className="text-sm font-medium text-white/80">Help me write code</p><p className="text-xs text-white/40 mt-1">Help me write a Python function</p></div>
          </button>
          <button onClick={() => onSuggestedPrompt('Explain how neural networks work')} className="flex items-start gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left">
            <FileText size={20} className="text-white/40 mt-0.5" />
            <div><p className="text-sm font-medium text-white/80">Explain a concept</p><p className="text-xs text-white/40 mt-1">Explain how neural networks work</p></div>
          </button>
          <button onClick={() => onSuggestedPrompt('Give me startup ideas in AI')} className="flex items-start gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left">
            <Lightbulb size={20} className="text-white/40 mt-0.5" />
            <div><p className="text-sm font-medium text-white/80">Brainstorm ideas</p><p className="text-xs text-white/40 mt-1">Give me startup ideas in AI</p></div>
          </button>
          <button onClick={() => onSuggestedPrompt('Help me debug this code')} className="flex items-start gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left">
            <Rocket size={20} className="text-white/40 mt-0.5" />
            <div><p className="text-sm font-medium text-white/80">Help me debug</p><p className="text-xs text-white/40 mt-1">Help me debug this code</p></div>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button onClick={() => setModal('team')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 text-sm" data-testid="team-button"><Users size={16} />Team</button>
          <button onClick={() => setModal('qr')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 text-sm" data-testid="qr-button"><QrCode size={16} />Share QR</button>
          <button onClick={() => setModal('log')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 text-sm" data-testid="update-log-button"><ScrollText size={16} />Update Log</button>
        </div>

        <p className="text-[11px] text-white/20 pt-2">Founder: Zachary Cook</p>
      </div>

      {modal === 'team' && <TeamModal close={closeModal} />}
      {modal === 'qr' && <QRModal close={closeModal} />}
      {modal === 'log' && <LogModal close={closeModal} />}
    </div>
  );
}

function TeamModal({ close }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={close}>
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-lg font-semibold text-white">Our Team</h2>
          <button onClick={close}><X size={20} className="text-white/50" /></button>
        </div>
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
  );
}

function QRModal({ close }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={close}>
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-lg font-semibold text-white">Share App</h2>
          <button onClick={close}><X size={20} className="text-white/50" /></button>
        </div>
        <div className="flex justify-center p-6 bg-white rounded-xl">
          <QRCodeSVG value={window.location.origin} size={180} />
        </div>
        <p className="text-xs text-white/50 text-center mt-4">Scan to open Aether Labs</p>
      </div>
    </div>
  );
}

function LogModal({ close }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={close}>
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="font-heading text-lg font-semibold text-white">Update Log</h2>
          <button onClick={close}><X size={20} className="text-white/50" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-white">v1.2.0</span>
              <span className="text-xs text-white/40">Feb 3, 2026</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">Latest</span>
            </div>
            <p className="text-sm text-white/70 ml-2">• QR code sharing</p>
            <p className="text-sm text-white/70 ml-2">• Update Log</p>
            <p className="text-sm text-white/70 ml-2">• Splash screen</p>
            <p className="text-sm text-white/70 ml-2">• New tester: Kaleb Youngblood</p>
            <p className="text-sm text-white/70 ml-2">• New favicon</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-white">v1.1.0</span>
              <span className="text-xs text-white/40">Feb 2, 2026</span>
            </div>
            <p className="text-sm text-white/70 ml-2">• Team button</p>
            <p className="text-sm text-white/70 ml-2">• ChatGPT-style layout</p>
            <p className="text-sm text-white/70 ml-2">• Mobile navigation fix</p>
            <p className="text-sm text-white/70 ml-2">• Home button</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-white">v1.0.0</span>
              <span className="text-xs text-white/40">Feb 2, 2026</span>
            </div>
            <p className="text-sm text-white/70 ml-2">• Initial release</p>
            <p className="text-sm text-white/70 ml-2">• GPT-5.2 integration</p>
            <p className="text-sm text-white/70 ml-2">• Chat history</p>
            <p className="text-sm text-white/70 ml-2">• Code highlighting</p>
            <p className="text-sm text-white/70 ml-2">• Dark theme</p>
          </div>
        </div>
      </div>
    </div>
  );
}
