import React from 'react';
import { Sparkles, Code, FileText, Lightbulb, Rocket } from 'lucide-react';
import { Button } from '../../components/ui/button';

const suggestedPrompts = [
  {
    icon: Code,
    title: 'Write code',
    prompt: 'Help me write a Python function that calculates the Fibonacci sequence'
  },
  {
    icon: FileText,
    title: 'Explain concepts',
    prompt: 'Explain how neural networks work in simple terms'
  },
  {
    icon: Lightbulb,
    title: 'Brainstorm ideas',
    prompt: 'Give me 5 creative startup ideas in the AI space'
  },
  {
    icon: Rocket,
    title: 'Debug code',
    prompt: 'Help me debug this code that\'s throwing an error'
  }
];

export default function WelcomeScreen({ onNewChat, onSuggestedPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8" data-testid="welcome-screen">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-pulse-glow">
            <Sparkles size={40} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Aether Labs
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Your AI assistant powered by GPT-5.2
            </p>
          </div>
        </div>

        {/* Suggested prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 animate-slide-up">
          {suggestedPrompts.map((item, index) => (
            <button
              key={index}
              onClick={() => onSuggestedPrompt(item.prompt)}
              className="group flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-left transition-all duration-300"
              data-testid={`suggested-prompt-${index}`}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/30 transition-colors">
                <item.icon size={20} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{item.prompt}</p>
              </div>
            </button>
          ))}
        </div>

        {/* New chat button */}
        <div className="pt-4">
          <Button
            onClick={onNewChat}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-8 py-6 rounded-xl text-lg font-medium shadow-lg shadow-indigo-500/20 transition-all duration-300"
            data-testid="start-chat-button"
          >
            <Sparkles size={20} className="mr-2" />
            Start a new conversation
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground/50 pt-8">
          Aether can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
