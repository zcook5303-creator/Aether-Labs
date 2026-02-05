import React, { useState } from 'react';
import { Code, FileText, Lightbulb, Rocket, Users, X, QrCode, ScrollText } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { updateLog, teamMembers } from '../../lib/appData';

function PromptButton({ icon: Icon, title, prompt, onClick }) {
  return (
    <button onClick={() => onClick(prompt)} className="group flex items-start gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left transition-colors">
      <Icon size={20} className="text-white/40 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{title}</p>
        <p className="text-xs text-white/40 mt-1 line-clamp-2">{prompt}</p>
      </div>
    </button>
  );
}

function TeamModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg"><X size={20} className="text-white/50" /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center"><Users size={20} className="text-white" /></div>
          <div><h2 className="font-heading text-lg font-semibold text-white">Our Team</h2></div>
        </div>
        <div className="space-y-3">
          {teamMembers.map((m, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center"><span className="text-indigo-400 font-medium">{m.name[0]}</span></div>
              <div><p className="text-sm font-medium text-white">{m.name}</p><p className="text-xs text-white/50">{m.role}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QRModal({ onClose, appUrl }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg"><X size={20} className="text-white/50" /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center"><QrCode size={20} className="text-white" /></div>
          <div><h2 className="font-heading text-lg font-semibold text-white">Share Aether Labs</h2></div>
        </div>
        <div className="flex justify-center p-6 bg-white rounded-xl"><QRCodeSVG value={appUrl} size={200} level="H" /></div>
        <p className="text-xs text-white/50 text-center mt-4 break-all">{appUrl}</p>
      </div>
    </div>
  );
}

function UpdateLogModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg"><X size={20} className="text-white/50" /></button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center"><ScrollText size={20} className="text-white" /></div>
            <div><h2 className="font-heading text-lg font-semibold text-white">Update Log</h2></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {updateLog.map((u, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-4 h-4 rounded-full bg-indigo-500 shrink-0 mt-1" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-white">v{u.version}</span>
                  <span className="text-xs text-white/40">{u.date}</span>
                  {i === 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">Latest</span>}
                </div>
                <ul className="space-y-1">
                  {u.changes.map((c, j) => <li key={j} className="text-sm text-white/70">• {c}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WelcomeScreen({ onSuggestedPrompt }) {
  const [modal, setModal] = useState(null);
  const appUrl = window.location.origin;

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
          <PromptButton icon={Code} title="Help me write code" prompt="Help me write a Python function that calculates the Fibonacci sequence" onClick={onSuggestedPrompt} />
          <PromptButton icon={FileText} title="Explain a concept" prompt="Explain how neural networks work in simple terms" onClick={onSuggestedPrompt} />
          <PromptButton icon={Lightbulb} title="Brainstorm ideas" prompt="Give me 5 creative startup ideas in the AI space" onClick={onSuggestedPrompt} />
          <PromptButton icon={Rocket} title="Help me debug" prompt="Help me debug this code that is throwing an error" onClick={onSuggestedPrompt} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button onClick={() => setModal('team')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white/80 text-sm" data-testid="team-button"><Users size={16} />Team</button>
          <button onClick={() => setModal('qr')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white/80 text-sm" data-testid="qr-button"><QrCode size={16} />Share QR</button>
          <button onClick={() => setModal('log')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white/80 text-sm" data-testid="update-log-button"><ScrollText size={16} />Update Log</button>
        </div>

        <p className="text-[11px] text-white/20 pt-2">Founder: Zachary Cook</p>
      </div>

      {modal === 'team' && <TeamModal onClose={() => setModal(null)} />}
      {modal === 'qr' && <QRModal onClose={() => setModal(null)} appUrl={appUrl} />}
      {modal === 'log' && <UpdateLogModal onClose={() => setModal(null)} />}
    </div>
  );
}
