import React, { useState } from 'react';
import { User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div 
      className={`py-4 ${isUser ? '' : 'bg-transparent'}`}
      data-testid={`message-${message.id}`}
    >
      <div className="flex gap-3 md:gap-4">
        {/* Avatar */}
        {isUser ? (
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
            <User size={16} className="text-white" />
          </div>
        ) : (
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">A</span>
          </div>
        )}

        {/* Message content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-xs font-medium text-white/60 mb-1">
            {isUser ? 'You' : 'Aether'}
          </p>
          {isUser ? (
            <p className="text-[15px] text-white/90 whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose-chat text-[15px] leading-relaxed">
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
                    return <p className="mb-3 last:mb-0 text-white/90">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 mb-3 space-y-1.5 text-white/90">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-white/90">{children}</ol>;
                  },
                  li({ children }) {
                    return <li className="text-white/90">{children}</li>;
                  },
                  h1({ children }) {
                    return <h1 className="text-xl font-heading font-semibold mb-3 mt-4 text-white">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-lg font-heading font-semibold mb-2 mt-4 text-white">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-base font-heading font-semibold mb-2 mt-3 text-white">{children}</h3>;
                  },
                  strong({ children }) {
                    return <strong className="font-semibold text-white">{children}</strong>;
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-2 border-white/20 pl-4 my-3 text-white/60 italic">
                        {children}
                      </blockquote>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-3 rounded-lg border border-white/10">
                        <table className="min-w-full">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return <th className="bg-white/5 px-3 py-2 text-left text-sm font-medium text-white/80 border-b border-white/10">{children}</th>;
                  },
                  td({ children }) {
                    return <td className="px-3 py-2 text-sm text-white/70 border-b border-white/5">{children}</td>;
                  },
                  hr() {
                    return <hr className="my-4 border-white/10" />;
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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5">
        <span className="text-xs text-white/50 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          data-testid="copy-code-button"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '13px',
          lineHeight: '1.5',
        }}
        showLineNumbers={children.split('\n').length > 3}
        lineNumberStyle={{ color: 'rgba(255,255,255,0.2)', paddingRight: '1em' }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
