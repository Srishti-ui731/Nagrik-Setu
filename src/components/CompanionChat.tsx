import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Volume2,
  Languages,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  FileText,
  VolumeX,
  Play,
  ArrowRight
} from 'lucide-react';
import { Logger } from '../utils/logger';
import { ApiClient } from '../utils/api';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: string;
  audioLoading?: boolean;
  audioPlaying?: boolean;
}

interface CompanionChatProps {
  initialLanguage?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'English', label: 'English (US/UK)' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)' },
  { code: 'Tamil', label: 'தமிழ் (Tamil)' },
  { code: 'Telugu', label: 'తెలుగు (Telugu)' },
  { code: 'Bengali', label: 'বাংলা (Bengali)' },
  { code: 'Marathi', label: 'मराठी (Marathi)' },
  { code: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'Gujarati', label: 'ગુજરાતી (Gujarati)' },
  { code: 'Malayalam', label: 'മലയാളം (Malayalam)' },
  { code: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' }
];

const SUGGESTED_PROMPTS = [
  {
    title: 'Document Requirements',
    prompt: 'What exact documents do I need to update my house address in my Aadhaar Card?',
    icon: FileText
  },
  {
    title: 'Farmer Assistance',
    prompt:
      'I am a small landholding farmer from Uttar Pradesh. What welfare schemes do I qualify for and how do I apply?',
    icon: Sparkles
  },
  {
    title: 'Draft an Application',
    prompt:
      'Draft a formal application letter to the Municipal Commissioner regarding water stagnation and mosquitoes in my ward.',
    icon: Building2
  }
];

export default function CompanionChat({ initialLanguage = 'English' }: CompanionChatProps) {
  const [language, setLanguage] = useState(initialLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste! I am your AI Civic Companion, **Bapu / Bharat Sevak**. I am here to assist you with public service procedures, explain government schemes, translate civic laws, prepare application letter templates, and help you file grievances. \n\nSelect your language above and let me know how I can guide you today!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: 'English'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showLanguageGate, setShowLanguageGate] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (!showLanguageGate) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages, loading, showLanguageGate]);

  useEffect(() => {
    const pending = sessionStorage.getItem('initial_chat_prompt');
    if (pending) {
      sessionStorage.removeItem('initial_chat_prompt');
      setInputText(pending);
      setPendingPrompt(pending);
      setShowLanguageGate(true);
    }
  }, []);
  useEffect(() => {
    const bcp47Map: Record<string, string> = {
      English: 'en',
      Hindi: 'hi',
      Tamil: 'ta',
      Telugu: 'te',
      Bengali: 'bn',
      Marathi: 'mr',
      Kannada: 'kn'
    };
    const bcp47Code = bcp47Map[language] || 'en';
    document.documentElement.setAttribute('lang', bcp47Code);
  }, [language]);
  /**
   * Sends a user message to the backend Bapu chat endpoint and appends the AI's response to messages list.
   *
   * @param {string} textToSend - Raw text input from user
   * @param {string} [overrideLanguage] - Optional language override if state has not updated yet
   */
  const handleSendMessage = async (textToSend: string, overrideLanguage?: string) => {
    if (!textToSend.trim() || loading) return;

    const activeLanguage = overrideLanguage || language;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: activeLanguage
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);
    setError(null);

    try {
      const history = messages.slice(-10).map((msg) => ({
        sender: msg.sender,
        text: msg.text
      }));

      const data = await ApiClient.sendChatMessage(textToSend, history, activeLanguage);

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: activeLanguage
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      Logger.error('Failed to send chat message in CompanionChat.tsx', err);
      setError(err.message || 'Something went wrong while contacting the AI server.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Instantly saves the selected language, hides the language selection gate,
   * retrieves the pending prompt, and automatically submits it.
   *
   * @param {string} selectedLang - Language code (e.g. 'English', 'Hindi')
   */
  const handleSelectAndSubmitLanguage = async (selectedLang: string) => {
    setLanguage(selectedLang);
    setShowLanguageGate(false);

    const promptToSubmit = pendingPrompt || inputText;
    if (promptToSubmit.trim()) {
      await handleSendMessage(promptToSubmit, selectedLang);
    }

    setPendingPrompt('');
  };

  /**
   * Copies specified text to the system clipboard and tracks the copied state for user feedback.
   *
   * @param {string} id - Message ID
   * @param {string} text - Message text to copy
   */
  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /**
   * Converts a base64 encoded audio string into a reusable Object URL.
   *
   * @param {string} base64 - The base64 encoded audio data string
   * @returns {string} The local object URL referencing the audio blob
   */
  const createAudioUrlFromBase64 = (base64: string): string => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  /**
   * Generates text-to-speech audio for a message using Gemini TTS and handles playback.
   *
   * @param {string} msgId - Target message ID
   * @param {string} text - Text to read aloud
   */
  const handleSpeakText = async (msgId: string, text: string) => {
    // If already playing this message, stop it
    if (currentlyPlayingId === msgId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentlyPlayingId(null);
      return;
    }

    // Stop any other currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setCurrentlyPlayingId(null);
    }

    // Set loading indicator
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, audioLoading: true } : m)));

    try {
      const voice = language === 'Hindi' ? 'Kore' : 'Zephyr';
      const data = await ApiClient.generateTts(text, voice);

      if (data.audio) {
        const url = createAudioUrlFromBase64(data.audio);
        const audio = new Audio(url);
        audioRef.current = audio;
        setCurrentlyPlayingId(msgId);

        audio.onended = () => {
          setCurrentlyPlayingId(null);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setCurrentlyPlayingId(null);
          audioRef.current = null;
          Logger.warn('TTS audio playback failed in CompanionChat.tsx');
        };

        await audio.play();
      }
    } catch (err) {
      Logger.error('Speech Synthesis failed in CompanionChat.tsx', err);
    } finally {
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, audioLoading: false } : m)));
    }
  };

  return (
    <div
      id="companion-chat-root"
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]"
    >
      {/* Left Config Panel: Language & Suggestion prompts */}
      <div id="companion-sidebar" className="lg:col-span-1 flex flex-col gap-4">
        {/* Language selector card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800 font-display font-bold text-sm">
            <Languages className="w-4 h-4 text-orange-600" />
            Prefer Region Language
          </div>
          <p className="text-xs text-slate-400">
            Select your language. Bapu will understand and translate the responses specifically.
          </p>

          <div className="space-y-1.5">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  if (showLanguageGate) {
                    handleSelectAndSubmitLanguage(lang.code);
                  } else {
                    setLanguage(lang.code);
                  }
                }}
                className={`w-full px-3 py-2 text-left text-xs rounded-lg border font-medium transition-all cursor-pointer flex justify-between items-center
                  ${
                    language === lang.code
                      ? 'border-orange-500 bg-orange-50/50 text-orange-700 font-semibold shadow-xs'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 text-slate-600'
                  }
                `}
              >
                {lang.label}
                {language === lang.code && (
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestion Prompts */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-sm flex-1 hidden lg:block overflow-y-auto">
          <div className="text-slate-800 font-display font-bold text-sm">💡 Sample Scenarios</div>
          <p className="text-xs text-slate-400">
            Click any card to load the prompt directly to Bapu.
          </p>

          <div className="space-y-3 pt-1">
            {SUGGESTED_PROMPTS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 transition-all cursor-pointer space-y-1 group"
                >
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs group-hover:text-orange-600">
                    <IconComp className="w-3.5 h-3.5" />
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    "{item.prompt}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Core Chat window */}
      <div
        id="companion-chat-window"
        className="lg:col-span-3 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full"
      >
        {showLanguageGate ? (
          <div className="flex-1 flex flex-col justify-between bg-slate-50/20 p-6 sm:p-8 overflow-y-auto">
            <div className="space-y-6 max-w-xl mx-auto w-full">
              {/* Header */}
              <div className="text-center space-y-2 mt-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                  <Languages className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-display font-black text-slate-800 tracking-tight">
                  Choose Language for Bapu AI Assistant
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bapu will translate official welfare schemes and documents into your chosen
                  language.
                </p>
              </div>

              {/* User's Prompt Preview */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Your Current Prompt:
                </p>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 font-sans italic leading-relaxed relative overflow-hidden shadow-xs">
                  "{inputText || pendingPrompt}"
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 blur-xl pointer-events-none"></div>
                </div>
              </div>

              {/* Language selection grid */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Select Your Language:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectAndSubmitLanguage(lang.code)}
                        className={`px-4 py-3.5 text-left text-xs rounded-2xl border font-bold transition-all cursor-pointer flex items-center justify-between gap-3 group
                          ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/80 text-orange-800 shadow-xs ring-2 ring-orange-500/10 font-black'
                              : 'border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/20 text-slate-700'
                          }
                        `}
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-xs sm:text-sm font-bold">{lang.label}</span>
                          {isSelected && (
                            <span className="text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider scale-90 origin-left">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 group-hover:text-orange-600 font-bold transition-colors">
                            Select
                          </span>
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all
                            ${isSelected ? 'bg-orange-500 text-white shadow-xs' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-500 group-hover:text-white'}
                          `}
                          >
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action buttons at bottom */}
            <div className="border-t border-slate-150 pt-6 mt-8 max-w-xl mx-auto w-full flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => {
                  setShowLanguageGate(false);
                }}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                Go Back to Prompt (Edit / View)
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSelectAndSubmitLanguage(language);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black shadow-md shadow-orange-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                Ask Bapu in{' '}
                {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.label.split(' ')[0] ||
                  language}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Title bar */}
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 border border-orange-100 flex items-center justify-center text-white font-display font-bold text-base shadow-sm">
                  B
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    Bapu – AI Civic Companion
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Translating to {language}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                Gemini GenAI Active
              </div>
            </div>

            {/* Chat Message Scroll */}
            <div
              id="chat-messages-container"
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30"
              aria-live="polite"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-4xl ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 text-orange-700 font-bold font-display text-xs flex items-center justify-center shrink-0 shadow-xs">
                      B
                    </div>
                  )}

                  <div className="space-y-1.5 max-w-[85%]">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm border shadow-xs leading-relaxed transition-all
                      ${
                        msg.sender === 'user'
                          ? 'bg-orange-500 border-orange-600 text-white rounded-tr-none'
                          : 'bg-white border-slate-200 text-slate-600 rounded-tl-none'
                      }
                    `}
                    >
                      {msg.sender === 'assistant' ? (
                        <MarkdownRenderer text={msg.text} />
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>

                    {/* Micro Action Buttons next to AI answer */}
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center gap-3 px-1 text-slate-400 text-[11px] font-medium">
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.text)}
                          className="hover:text-orange-600 cursor-pointer flex items-center gap-1"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSpeakText(msg.id, msg.text)}
                          className={`cursor-pointer flex items-center gap-1 font-semibold
                            ${
                              currentlyPlayingId === msg.id
                                ? 'text-emerald-600 hover:text-emerald-700'
                                : 'hover:text-orange-600'
                            }
                          `}
                          disabled={msg.audioLoading}
                        >
                          {msg.audioLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                              Generating voice...
                            </>
                          ) : currentlyPlayingId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                              Stop Listening
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              Listen (AI Voice)
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {msg.sender === 'user' && (
                      <div className="text-right px-1 text-[10px] text-slate-400">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* AI generating loader */}
              {loading && (
                <div className="flex gap-3 max-w-4xl justify-start">
                  <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 text-orange-700 font-bold font-display text-xs flex items-center justify-center shrink-0 animate-pulse">
                    B
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-xs text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                    Bapu is consulting official directories and policies...
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 max-w-2xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input box */}
            <div className="p-4 border-t border-slate-50 shrink-0 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Ask Bapu a question about public services in ${language}...`}
                  className="flex-1 p-3 text-xs sm:text-sm border border-slate-100 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 placeholder-slate-400 font-sans"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || loading}
                  className="p-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-1.5 px-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>Powered by Gemini 3.5 Flash Model</span>
                <span>Accurate, Secure, Server-Verified</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
