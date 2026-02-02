import React from 'react';
import { Sparkles, Code, FileText, Lightbulb, Rocket } from 'lucide-react';

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
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Sparkles size={28} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-semibold text-white">
              How can I help you today?
            </h1>
          </div>
        </div>

        {/* Suggested prompts - ChatGPT grid style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8 px-2">
          {suggestedPrompts.map((item, index) => (
            <button
              key={index}
              onClick={() => onSuggestedPrompt(item.prompt)}
              className="group flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/5 text-left transition-colors"
              data-testid={`suggested-prompt-${index}`}
            >
              <item.icon size={18} className="text-white/40 shrink-0" />
              <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                {item.title}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-white/30 pt-4">
          Created by Zachary Cook • Powered by GPT-5.2
        </p>
      </div>
    </div>
  );
}
