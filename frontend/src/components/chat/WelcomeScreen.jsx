import React from 'react';
import { Code, FileText, Lightbulb, Rocket } from 'lucide-react';

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

export default function WelcomeScreen({ onNewChat, onSuggestedPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8" data-testid="welcome-screen">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-heading text-3xl md:text-4xl font-medium text-white">
            Aether Labs
          </h1>
          <p className="text-white/50 text-lg">How can I help you today?</p>
        </div>

        {/* Suggested prompts - ChatGPT grid style */}
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

        {/* Footer */}
        <p className="text-[11px] text-white/20 pt-6">
          Founder: Zachary Cook
        </p>
      </div>
    </div>
  );
}
