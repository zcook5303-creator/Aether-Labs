import React, { useState } from 'react';
import { Users, X, QrCode, ScrollText, Plus, Image, BookOpen, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { chatApi } from '../../lib/api';

export default function WelcomeScreen({ onNewChat }) {
  const [modal, setModal] = useState(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  const closeModal = () => {
    setModal(null);
    setGeneratedImage(null);
    setImagePrompt('');
    setImageError('');
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || imageLoading) return;
    setImageLoading(true);
    setImageError('');
    setGeneratedImage(null);
    
    try {
      const result = await chatApi.generateImage(imagePrompt);
      setGeneratedImage(result.image_base64);
    } catch (error) {
      setImageError('Failed to generate image. Please try again.');
      console.error('Image generation error:', error);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8" data-testid="welcome-screen">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <svg width="70" height="70" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="6"/>
            <circle cx="50" cy="50" r="8" fill="white"/>
            <path d="M50 42 L38 12 A38 38 0 0 1 62 12 Z" fill="white"/>
            <path d="M43 54 L13 72 A38 38 0 0 1 26 28 Z" fill="white"/>
            <path d="M57 54 L87 72 A38 38 0 0 1 74 28 Z" fill="white"/>
          </svg>
          <h1 className="font-heading text-3xl md:text-4xl font-medium text-white">Aether Labs</h1>
          <p className="text-white/50">How can I help you today?</p>
        </div>

        {/* Main Buttons */}
        <div className="space-y-3 pt-4">
          <button onClick={onNewChat} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg transition-colors" data-testid="new-chat-button">
            <Plus size={22} />New Chat
          </button>
          <button onClick={() => setModal('image')} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors" data-testid="image-gen-button">
            <Image size={20} />Generate Image
          </button>
          <button onClick={() => setModal('team')} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors" data-testid="team-button">
            <Users size={20} />Team
          </button>
          <button onClick={() => setModal('guidelines')} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors" data-testid="guidelines-button">
            <BookOpen size={20} />Guidelines
          </button>
          <button onClick={() => setModal('qr')} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors" data-testid="qr-button">
            <QrCode size={20} />Share QR
          </button>
          <button onClick={() => setModal('log')} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors" data-testid="update-log-button">
            <ScrollText size={20} />Update Log
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 space-y-2">
          <button onClick={() => setModal('aether')} className="text-[11px] text-white/30 hover:text-white/60 transition-colors underline underline-offset-2" data-testid="aether-meaning-button">Aether?</button>
          <p className="text-[11px] text-white/20">Founder: Zachary Cook</p>
        </div>
      </div>

      {/* Image Generation Modal */}
      {modal === 'image' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">Generate AI Image</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="space-y-4">
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 resize-none h-24"
                disabled={imageLoading}
              />
              <button
                onClick={handleGenerateImage}
                disabled={!imagePrompt.trim() || imageLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                {imageLoading ? <><Loader2 size={20} className="animate-spin" />Generating...</> : <><Image size={20} />Generate Image</>}
              </button>
              {imageError && <p className="text-red-400 text-sm text-center">{imageError}</p>}
              {generatedImage && (
                <div className="mt-4">
                  <img src={`data:image/png;base64,${generatedImage}`} alt="Generated" className="w-full rounded-xl border border-white/10" />
                  <a href={`data:image/png;base64,${generatedImage}`} download="aether-image.png" className="block text-center text-indigo-400 text-sm mt-2 hover:underline">Download Image</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guidelines Modal */}
      {modal === 'guidelines' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="font-heading text-lg font-semibold text-white">Guidelines</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              <div className="p-4 rounded-xl bg-white/5">
                <h3 className="font-semibold text-white mb-2">✅ Do</h3>
                <ul className="text-sm text-white/70 space-y-1">
                  <li>• Be respectful and kind</li>
                  <li>• Ask clear questions for better answers</li>
                  <li>• Use image generation responsibly</li>
                  <li>• Report bugs to help improve Aether</li>
                  <li>• Share feedback with our team</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <h3 className="font-semibold text-white mb-2">❌ Don't</h3>
                <ul className="text-sm text-white/70 space-y-1">
                  <li>• Generate harmful or inappropriate content</li>
                  <li>• Share personal sensitive information</li>
                  <li>• Use Aether for illegal activities</li>
                  <li>• Spam or abuse the service</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <h3 className="font-semibold text-indigo-400 mb-2">💡 Tips</h3>
                <ul className="text-sm text-white/70 space-y-1">
                  <li>• Be specific in your prompts</li>
                  <li>• Use markdown for formatted responses</li>
                  <li>• Ask follow-up questions for clarity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {modal === 'team' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">Our Team</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            {/* Zachary Cook - Gold */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-600/30 to-amber-500/30 border border-yellow-500/30 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
                  <path d="M17.64 15L22 10.64"/><path d="M20 6l-3-3"/><path d="M9 3l3 3-6 6"/>
                </svg>
              </div>
              <div><p className="text-sm text-white font-semibold">Zachary Cook</p><p className="text-xs text-yellow-400/80">Founder & Owner</p></div>
            </div>
            {/* Billy Cook - Silver */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-400/20 to-slate-300/20 border border-gray-400/30 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-slate-400 flex items-center justify-center shadow-lg shadow-gray-400/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11.5 3.5c.5-1 1.5-1.5 2.5-1.5 1.5 0 2.5 1 3 2l1 3c.5 1.5 0 3-1 4l-3 3"/>
                  <path d="M6 12l-2 2c-1 1-1 3 0 4l2 2c1 1 3 1 4 0l8-8"/>
                  <path d="M5 21l1-1"/><path d="M10 21l-1-1"/>
                </svg>
              </div>
              <div><p className="text-sm text-white font-semibold">Billy Cook</p><p className="text-xs text-gray-400">App Moderator</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center"><span className="text-indigo-400">D</span></div>
              <div><p className="text-sm text-white">Donna Cook</p><p className="text-xs text-white/50">App Tester (Ripple)</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center"><span className="text-indigo-400">K</span></div>
              <div><p className="text-sm text-white">Kaleb Youngblood</p><p className="text-xs text-white/50">App Tester</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center"><span className="text-indigo-400">K</span></div>
              <div><p className="text-sm text-white">Kane Youngblood</p><p className="text-xs text-white/50">App Tester</p></div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {modal === 'qr' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">Share App</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="flex justify-center p-6 bg-white rounded-xl"><QRCodeSVG value={window.location.origin} size={180} /></div>
            <p className="text-xs text-white/50 text-center mt-4">Scan to open Aether Labs</p>
          </div>
        </div>
      )}

      {/* Update Log Modal */}
      {modal === 'log' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="font-heading text-lg font-semibold text-white">Update Log</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">v1.4.0</span>
                  <span className="text-xs text-white/40">Feb 5, 2026</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">Latest</span>
                </div>
                <p className="text-sm text-white/70 ml-2">• AI Image Generation</p>
                <p className="text-sm text-white/70 ml-2">• Guidelines page</p>
                <p className="text-sm text-white/70 ml-2">• New moderator: Billy Cook</p>
                <p className="text-sm text-white/70 ml-2">• AETHER meaning button</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">v1.3.0</span>
                  <span className="text-xs text-white/40">Feb 5, 2026</span>
                </div>
                <p className="text-sm text-white/70 ml-2">• Simplified main menu</p>
                <p className="text-sm text-white/70 ml-2">• New tester: Kane Youngblood</p>
                <p className="text-sm text-white/70 ml-2">• Chat privacy</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">v1.2.0</span>
                  <span className="text-xs text-white/40">Feb 3, 2026</span>
                </div>
                <p className="text-sm text-white/70 ml-2">• QR code sharing</p>
                <p className="text-sm text-white/70 ml-2">• Splash screen</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">v1.0.0</span>
                  <span className="text-xs text-white/40">Feb 2, 2026</span>
                </div>
                <p className="text-sm text-white/70 ml-2">• Initial release</p>
                <p className="text-sm text-white/70 ml-2">• GPT-5.2 integration</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aether Meaning Modal */}
      {modal === 'aether' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">What is AETHER?</h2>
              <button onClick={closeModal}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">A</span><span className="text-white/80">Artificial</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">E</span><span className="text-white/80">Engineering</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">T</span><span className="text-white/80">Technology</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">H</span><span className="text-white/80">Hyper Systems</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">E</span><span className="text-white/80">Energy</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">R</span><span className="text-white/80">Robotics</span></div>
            </div>
            <p className="text-xs text-white/40 text-center mt-4">The future of AI technology</p>
          </div>
        </div>
      )}
    </div>
  );
}
