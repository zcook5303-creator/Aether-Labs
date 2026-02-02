import React, { useState } from 'react';
import { User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MessageBubble({ message, isLast }) {
  const isUser = message.role === 'user';

  return (
    <div 
      className={`flex items-start gap-4 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}
      data-testid={`message-${message.id}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <User size={16} className="text-white/70" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">A</span>
        </div>
      )}

      {/* Message content */}
      <div
        className={`
          max-w-[85%] rounded-2xl px-5 py-3
          ${isUser 
            ? 'bg-indigo-500 text-white rounded-tr-sm shadow-lg shadow-indigo-500/10' 
            : 'bg-white/5 border border-white/5 text-foreground rounded-tl-sm backdrop-blur-sm'
          }
        `}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  
                  if (!inline && language) {
                    return (
                      <CodeBlock language={language}>
                        {String(children).replace(/\n$/, '')}
                      </CodeBlock>
                    );
                  }
                  
                  return (
                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
                p({ children }) {
                  return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
                },
                h1({ children }) {
                  return <h1 className="text-xl font-heading font-semibold mb-3 mt-4">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-lg font-heading font-semibold mb-2 mt-3">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-base font-heading font-semibold mb-2 mt-3">{children}</h3>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-3 border-indigo-500 pl-4 my-3 text-muted-foreground italic">
                      {children}
                    </blockquote>
                  );
                },
                a({ href, children }) {
                  return (
                    <a href={href} className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-3">
                      <table className="min-w-full border border-white/10 rounded-lg overflow-hidden">
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return <th className="bg-white/5 px-4 py-2 text-left border-b border-white/10">{children}</th>;
                },
                td({ children }) {
                  return <td className="px-4 py-2 border-b border-white/5">{children}</td>;
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
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
    <div className="relative group my-3 rounded-lg overflow-hidden bg-[#0A0A0A] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
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
              <span>Copy</span>
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
          fontSize: '0.875rem',
        }}
        showLineNumbers={children.split('\n').length > 5}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
