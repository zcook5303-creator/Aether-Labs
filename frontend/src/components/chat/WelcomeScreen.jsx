import React, { useState } from 'react';
import { Code, FileText, Lightbulb, Rocket, Users, X, QrCode, ScrollText } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const suggestedPrompts = [
  {
    icon: Code,
    title: 'Help me write code',
    prompt: 'Help me write a Python function that calculates the Fibonacci sequence'
  },
  {
    icon: FileText,
    title: 'Explain a concept',
    prompt: 'Explain how neural networks work in simple terms'
  },
  {
    icon: Lightbulb,
    title: 'Brainstorm ideas',
    prompt: 'Give me 5 creative startup ideas in the AI space'
  },
  {
    icon: Rocket,
    title: 'Help me debug',
    prompt: 'Help me debug this code that\'s throwing an error'
  }
];

const teamMembers = [
  { role: 'Founder & Owner', name: 'Zachary Cook' },
  { role: 'App Tester', name: 'Donna Cook' },
  { role: 'App Tester', name: 'Kaleb Youngblood' },
];

const updateLog = [
  {
    version: '1.2.0',
    date: 'Feb 3, 2026',
    changes: [
      'Added QR code sharing feature',
      'Added Update Log to track changes',
      'New splash screen with Aether logo',
      'New app tester: Kaleb Youngblood',
      'Fixed favicon/bookmark icon',
    ]
  },
  {
    version: '1.1.0',
    date: 'Feb 2, 2026',
    changes: [
      'Added App Moderators & Testers button',
      'Added team members: Zachary Cook (Founder), Donna Cook (Tester)',
      'Improved ChatGPT-style message layout',
      'Fixed mobile navigation',
      'Added Home button in sidebar',
    ]
  },
  {
    version: '1.0.0',
    date: 'Feb 2, 2026',
    changes: [
      'Initial release of Aether Labs',
      'GPT-5.2 AI integration',
      'Chat history with sidebar',
      'Code syntax highlighting',
      'Markdown rendering support',
      'Dark theme UI',
    ]
  },
];

export default function WelcomeScreen({ onNewChat, onSuggestedPrompt }) {
  const [showTeam, setShowTeam] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showUpdateLog, setShowUpdateLog] = useState(false);

  const appUrl = window.location.origin;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative" data-testid="welcome-screen">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          {/* Radiation Symbol */}
          <svg width="60" height="60" viewBox="0 0 100 100">
            <g fill="#ffffff" transform="translate(50,50)">
              <circle r="10"/>
              <path d="M0,-40 A40,40 0 0,1 34.64,20 L17.32,10 A20,20 0 0,0 0,-20 Z"/>
              <path d="M34.64,20 A40,40 0 0,1 -34.64,20 L-17.32,10 A20,20 0 0,0 17.32,10 Z"/>
              <path d="M-34.64,20 A40,40 0 0,1 0,-40 L0,-20 A20,20 0 0,0 -17.32,10 Z"/>
            </g>
          </svg>
          <h1 className="font-heading text-3xl md:text-4xl font-medium text-white">
            Aether Labs
          </h1>
          <p className="text-white/50 text-lg">How can I help you today?</p>
        </div>

        {/* Suggested prompts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {suggestedPrompts.map((item, index) => (
            <button
              key={index}
              onClick={() => onSuggestedPrompt(item.prompt)}
              className="group flex items-start gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left transition-colors"
              data-testid={`suggested-prompt-${index}`}
            >
              <item.icon size={20} className="text-white/40 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-white/40 mt-1 line-clamp-2">
                  {item.prompt}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setShowTeam(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white/80 text-sm transition-colors"
            data-testid="team-button"
          >
            <Users size={16} />
            Team
          </button>
          
          <button
            onClick={() => setShowQR(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white/80 text-sm transition-colors"
            data-testid="qr-button"
          >
            <QrCode size={16} />
            Share QR
          </button>

          <button
            onClick={() => setShowUpdateLog(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white/80 text-sm transition-colors"
            data-testid="update-log-button"
          >
            <ScrollText size={16} />
            Update Log
          </button>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-white/20 pt-2">
          Founder: Zachary Cook
        </p>
      </div>

      {/* Team Modal */}
      {showTeam && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowTeam(false)}>
          <div 
            className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTeam(false)}
              className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-white/50" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-white">Our Team</h2>
                <p className="text-xs text-white/50">The people behind Aether Labs</p>
              </div>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center">
                    <span className="text-indigo-400 font-medium">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{member.name}</p>
                    <p className="text-xs text-white/50">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-white/30 text-center mt-6">
              Thank you for using Aether Labs!
            </p>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
          <div 
            className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-white/50" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <QrCode size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-white">Share Aether Labs</h2>
                <p className="text-xs text-white/50">Scan to open the app</p>
              </div>
            </div>

            <div className="flex justify-center p-6 bg-white rounded-xl">
              <QRCodeSVG 
                value={appUrl}
                size={200}
                level="H"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            <p className="text-xs text-white/50 text-center mt-4 break-all">
              {appUrl}
            </p>

            <p className="text-[10px] text-white/30 text-center mt-4">
              Scan this QR code with your phone camera
            </p>
          </div>
        </div>
      )}

      {/* Update Log Modal */}
      {showUpdateLog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowUpdateLog(false)}>
          <div 
            className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/5">
              <button
                onClick={() => setShowUpdateLog(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-white/50" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                  <ScrollText size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white">Update Log</h2>
                  <p className="text-xs text-white/50">What's new in Aether Labs</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {updateLog.map((update, index) => (
                <div key={index} className="relative">
                  {index !== updateLog.length - 1 && (
                    <div className="absolute left-[7px] top-8 bottom-0 w-0.5 bg-white/10" />
                  )}
                  <div className="flex gap-4">
                    <div className="w-4 h-4 rounded-full bg-indigo-500 shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-white">v{update.version}</span>
                        <span className="text-xs text-white/40">{update.date}</span>
                        {index === 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">Latest</span>
                        )}
                      </div>
                      <ul className="space-y-1.5">
                        {update.changes.map((change, i) => (
                          <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                            <span className="text-indigo-400 mt-1">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5">
              <p className="text-[10px] text-white/30 text-center">
                Aether Labs by Zachary Cook
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
