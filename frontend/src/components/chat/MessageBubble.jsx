import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      data-testid={`message-${message.id}`}
    >
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-medium">Y</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-semibold">A</span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`
            rounded-2xl px-4 py-3
            ${isUser 
              ? 'bg-indigo-600 text-white rounded-tr-sm' 
              : 'bg-[#1a1a1a] text-white/90 rounded-tl-sm border border-white/10'
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose-chat leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    
                    if (!inline && (language || String(children).includes('\n'))) {
                      return (
                        <CodeBlock language={language || 'text'}>
                          {String(children).replace(/\n$/, '')}
                        </CodeBlock>
                      );
                    }
                    
                    return (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-[13px] text-indigo-300" {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre({ children }) {
                    return <>{children}</>;
                  },
                  p({ children }) {
                    return <p className="mb-3 last:mb-0">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
                  },
                  h1({ children }) {
                    return <h1 className="text-lg font-semibold mb-2 mt-3">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-base font-semibold mb-2 mt-3">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-sm font-semibold mb-2 mt-2">{children}</h3>;
                  },
                  strong({ children }) {
                    return <strong className="font-semibold">{children}</strong>;
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-2 border-white/30 pl-3 my-2 text-white/70 italic">
                        {children}
                      </blockquote>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} className="text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-3 rounded-lg border border-white/10">
                        <table className="min-w-full text-sm">{children}</table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return <th className="bg-white/5 px-3 py-2 text-left font-medium border-b border-white/10">{children}</th>;
                  },
                  td({ children }) {
                    return <td className="px-3 py-2 border-b border-white/5">{children}</td>;
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#2a2a2a]">
        <span className="text-xs text-white/50 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
          data-testid="copy-code-button"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: '0.75rem',
          background: 'transparent',
          fontSize: '12px',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
