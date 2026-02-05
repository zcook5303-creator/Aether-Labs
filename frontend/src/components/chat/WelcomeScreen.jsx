import React, { useState } from 'react';
import { Code, FileText, Lightbulb, Rocket, Users, X, QrCode, ScrollText } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const teamMembers = [
  { role: 'Founder & Owner', name: 'Zachary Cook' },
  { role: 'App Tester', name: 'Donna Cook' },
  { role: 'App Tester', name: 'Kaleb Youngblood' },
];

const updates = [
  { ver: '1.2.0', date: 'Feb 3, 2026', items: ['QR code sharing', 'Update Log', 'Splash screen', 'New tester: Kaleb Youngblood', 'New favicon'] },
  { ver: '1.1.0', date: 'Feb 2, 2026', items: ['Team button', 'ChatGPT-style layout', 'Mobile navigation fix', 'Home button'] },
  { ver: '1.0.0', date: 'Feb 2, 2026', items: ['Initial release', 'GPT-5.2 integration', 'Chat history', 'Code highlighting', 'Dark theme'] },
];

export default function WelcomeScreen({ onSuggestedPrompt }) {
  const [modal, setModal] = useState(null);

  const prompts = [
    { icon: Code, title: 'Help me write code', text: 'Help me write a Python function' },
    { icon: FileText, title: 'Explain a concept', text: 'Explain how neural networks work' },
    { icon: Lightbulb, title: 'Brainstorm ideas', text: 'Give me startup ideas in AI' },
    { icon: Rocket, title: 'Help me debug', text: 'Help me debug this code' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8" data-testid="welcome-screen">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <svg width="60" height="60" viewBox="0 0 100 100">
            <g fill="#ffffff" transform="translate(50,50)">
              <circle r="10"/>
              <path d="M0,-40 A40,40 0 0,1 34.64,20 L17.32,10 A20,20 0 0,0 0,-20 Z"/>
              <path d="M34.64,20 A40,40 0 0,1 -34.64,20 L-17.32,10 A20,20 0 0,0 17.32,10 Z"/>
              <path d="M-34.64,20 A40,40 0 0,1 0,-40 L0,-20 A20,20 0 0,0 -17.32,10 Z"/>
            </g>
          </svg>
          <h1 className="font-heading text-3xl md:text-4xl font-medium text-white">Aether Labs</h1>
          <p className="text-white/50 text-lg">How can I help you today?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prompts.map((p, i) => (
            <button key={i} onClick={() => onSuggestedPrompt(p.text)} className="group flex items-start gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left">
              <p.icon size={20} className="text-white/40 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white/80">{p.title}</p>
                <p className="text-xs text-white/40 mt-1">{p.text}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button onClick={() => setModal('team')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 text-sm" data-testid="team-button"><Users size={16} />Team</button>
          <button onClick={() => setModal('qr')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 text-sm" data-testid="qr-button"><QrCode size={16} />Share QR</button>
          <button onClick={() => setModal('log')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 text-sm" data-testid="update-log-button"><ScrollText size={16} />Update Log</button>
        </div>

        <p className="text-[11px] text-white/20 pt-2">Founder: Zachary Cook</p>
      </div>

      {modal === 'team' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">Our Team</h2>
              <button onClick={() => setModal(null)}><X size={20} className="text-white/50" /></button>
            </div>
            {teamMembers.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-2">
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center">
                  <span className="text-indigo-400">{m.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm text-white">{m.name}</p>
                  <p className="text-xs text-white/50">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modal === 'qr' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">Share App</h2>
              <button onClick={() => setModal(null)}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="flex justify-center p-6 bg-white rounded-xl">
              <QRCodeSVG value={window.location.origin} size={180} />
            </div>
            <p className="text-xs text-white/50 text-center mt-4">Scan to open Aether Labs</p>
          </div>
        </div>
      )}

      {modal === 'log' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="font-heading text-lg font-semibold text-white">Update Log</h2>
              <button onClick={() => setModal(null)}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {updates.map((u, i) => (
                <div key={i} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-white">v{u.ver}</span>
                    <span className="text-xs text-white/40">{u.date}</span>
                    {i === 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">Latest</span>}
                  </div>
                  {u.items.map((item, j) => (
                    <p key={j} className="text-sm text-white/70 ml-2">• {item}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
