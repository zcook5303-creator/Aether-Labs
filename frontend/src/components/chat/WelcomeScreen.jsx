import React, { useState } from 'react';
import { Code, FileText, Lightbulb, Rocket, Users, X } from 'lucide-react';

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
];

export default function WelcomeScreen({ onNewChat, onSuggestedPrompt }) {
  const [showTeam, setShowTeam] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative" data-testid="welcome-screen">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
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

        {/* Team button */}
        <div className="pt-4">
          <button
            onClick={() => setShowTeam(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white/80 text-sm transition-colors"
            data-testid="team-button"
          >
            <Users size={16} />
            App Moderators & Testers
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

            <div className="space-y-4">
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
    </div>
  );
}
