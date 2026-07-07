import React, { useState } from 'react';
import { Sparkles, Languages, ArrowRight, ShieldCheck, Smartphone, Send } from 'lucide-react';
import { Service } from '../types';

interface DashboardProps {
  services: Service[];
  complaintsCount: number;
  resolvedCount: number;
  onNavigate: (tab: string) => void;
  onSelectService: (serviceId: string) => void;
}

/**
 * DashboardOverview Component
 * Renders the homepage bento grid dashboard featuring active tracking,
 * essential services, Bapu AI assistant preview, and regional access guides.
 *
 * @param {DashboardProps} props Component props containing services and grievance metrics
 * @returns {JSX.Element} The rendered dashboard overview component
 */
export default function DashboardOverview({
  services,
  complaintsCount,
  resolvedCount,
  onNavigate,
  onSelectService
}: DashboardProps) {
  const [miniChatInput, setMiniChatInput] = useState('');

  // Simulated chat messages for the Bento companion preview
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am BharatBot. Your Aadhaar link is Active and voter ID is 80% complete.'
    },
    { sender: 'user', text: 'Check if my electricity bill is valid for proof.' },
    {
      sender: 'bot',
      text: 'Scanned the bill! It is valid. I am attaching it to Application #BT-88902.'
    }
  ]);

  /**
   * Handles submission of the mini chat input box on the dashboard bento grid.
   * Stores the initial prompt in sessionStorage and redirects the user to the active Bapu Chat window.
   *
   * @param {React.FormEvent} e Form submission event
   */
  const handleMiniChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!miniChatInput.trim()) return;
    // Set sessionStorage or simply navigate to chat
    sessionStorage.setItem('initial_chat_prompt', miniChatInput);
    onNavigate('chat');
  };

  return (
    <div id="dashboard-root" className="space-y-6">
      {/* Top Welcome Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-md text-sm font-bold">
              B
            </span>
            NAGRIK SETU
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
            Civic Intelligence Hub & Services
          </p>
        </div>
        <div className="flex bg-white rounded-full p-1 border border-slate-200 shadow-sm text-xs">
          <button className="px-3.5 py-1 bg-orange-500 text-white rounded-full text-[10px] font-bold transition-all">
            EN
          </button>
          <button className="px-3.5 py-1 text-slate-500 text-[10px] font-bold">हिन्दी</button>
          <button className="px-3.5 py-1 text-slate-500 text-[10px] font-bold">தமிழ்</button>
        </div>
      </div>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: BharatBot AI Companion (Major Card - col-span-2 row-span-2) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[380px]">
          <div className="p-5 bg-slate-800 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full absolute -top-0.5 -right-0.5 border-2 border-slate-800"></div>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/25">
                  <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold">BharatBot AI Assistant</p>
                <p className="text-[10px] text-slate-400">Powered by GenAI</p>
              </div>
            </div>
            <div className="bg-white/5 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold border border-white/10 tracking-wider">
              Voice Active
            </div>
          </div>

          {/* Conversational body */}
          <div className="flex-1 p-5 space-y-3.5 overflow-y-auto bg-slate-50/20 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-[10px]">
                    B
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-tr-none font-medium'
                      : 'bg-slate-100 text-slate-700 rounded-tl-none border-l-4 border-green-500 shadow-2xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick inputs bar */}
          <form
            onSubmit={handleMiniChatSubmit}
            className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={miniChatInput}
              onChange={(e) => setMiniChatInput(e.target.value)}
              placeholder="Ask Bapu about services, or report issues..."
              className="flex-1 bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <button
              type="submit"
              className="bg-slate-800 text-white p-2.5 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Card 2: Essential Services Grid (Col-span-1) */}
        <div className="col-span-1 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3.5">
              Essential Services
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div
                onClick={() => {
                  onNavigate('schemes');
                  onSelectService('aadhaar-update');
                }}
                className="p-3.5 bg-orange-50 border border-orange-100 rounded-2xl text-center group cursor-pointer hover:border-orange-300 hover:shadow-2xs transition-all"
              >
                <div className="text-xl mb-1 text-orange-600">📜</div>
                <span className="text-[10px] font-bold text-slate-700 block truncate">Aadhaar</span>
              </div>
              <div
                onClick={() => {
                  onNavigate('schemes');
                  onSelectService('ayushman-bharat');
                }}
                className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl text-center cursor-pointer hover:border-blue-300 hover:shadow-2xs transition-all"
              >
                <div className="text-xl mb-1 text-blue-600">🏥</div>
                <span className="text-[10px] font-bold text-slate-700 block truncate">
                  Health ID
                </span>
              </div>
              <div
                onClick={() => {
                  onNavigate('schemes');
                  onSelectService('ration-card');
                }}
                className="p-3.5 bg-green-50 border border-green-100 rounded-2xl text-center cursor-pointer hover:border-green-300 hover:shadow-2xs transition-all"
              >
                <div className="text-xl mb-1 text-green-600">🌾</div>
                <span className="text-[10px] font-bold text-slate-700 block truncate">
                  Ration Card
                </span>
              </div>
              <div
                onClick={() => {
                  onNavigate('schemes');
                  onSelectService('rte-admission');
                }}
                className="p-3.5 bg-purple-50 border border-purple-100 rounded-2xl text-center cursor-pointer hover:border-purple-300 hover:shadow-2xs transition-all"
              >
                <div className="text-xl mb-1 text-purple-600">🎓</div>
                <span className="text-[10px] font-bold text-slate-700 block truncate">
                  Education
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('schemes')}
            className="w-full mt-4 py-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            Browse All Schemes
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3: Active Tracking (Col-span-1 Row-span-2) */}
        <div className="col-span-1 lg:row-span-2 bg-slate-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between border border-slate-800">
          <div className="relative z-10 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Active Tracking
            </h3>

            <div className="space-y-4">
              <div className="relative pl-5 border-l-2 border-orange-500/40">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-slate-900"></div>
                <p className="text-xs font-bold text-white">Street Light Repair</p>
                <p className="text-[9px] text-orange-400 font-semibold uppercase tracking-wider">
                  In Progress • Sector 42
                </p>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className="relative pl-5 border-l-2 border-slate-700">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-slate-600 rounded-full border-2 border-slate-900"></div>
                <p className="text-xs font-bold text-slate-350">Waste Management</p>
                <p className="text-[9px] text-slate-400">Scheduled for tomorrow</p>
              </div>

              <div className="relative pl-5 border-l-2 border-green-500/40">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
                <p className="text-xs font-bold text-white">Park Maintenance</p>
                <p className="text-[9px] text-green-400 font-semibold">Resolved Today</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-800 mt-4 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>My Grievances Filed:</span>
              <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md">
                {complaintsCount}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Resolved Issues:</span>
              <span className="font-bold text-green-400 bg-green-950/40 px-2 py-0.5 rounded-md">
                {resolvedCount}
              </span>
            </div>

            <button
              onClick={() => onNavigate('grievance')}
              className="mt-2 w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-bold border border-white/10 transition-colors cursor-pointer"
            >
              Report New Issue
            </button>
          </div>

          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-orange-500/10 blur-2xl"></div>
        </div>

        {/* Card 4: Local Pulse / Civic Satisfaction Index (Col-span-1) */}
        <div className="col-span-1 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3.5">
              Local Pulse
            </h3>

            {/* Visual Mini Chart Bars */}
            <div className="flex items-end gap-2.5 h-16 px-1 mb-2">
              <div className="flex-1 bg-slate-100 rounded-t-md h-[40%] transition-all hover:bg-orange-300"></div>
              <div className="flex-1 bg-orange-200 rounded-t-md h-[70%] transition-all hover:bg-orange-300"></div>
              <div className="flex-1 bg-orange-500 rounded-t-md h-[95%] transition-all hover:bg-orange-600"></div>
              <div className="flex-1 bg-slate-200 rounded-t-md h-[55%] transition-all hover:bg-orange-300"></div>
              <div className="flex-1 bg-slate-100 rounded-t-md h-[30%] transition-all hover:bg-orange-300"></div>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-slate-50 pt-3">
            <div>
              <p className="text-xl font-black text-slate-800 tracking-tight">84%</p>
              <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                Civic Satisfaction
              </p>
            </div>
            <span className="text-green-600 text-[10px] font-bold bg-green-50 px-2 py-1 rounded-md border border-green-100 flex items-center gap-0.5">
              +4.2% ↑
            </span>
          </div>
        </div>

        {/* Card 5: Horizontal Bottom Banner (Col-span-3 - Welfare Scheme) */}
        <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between relative shadow-md shadow-orange-500/15 overflow-hidden gap-4">
          <div className="relative z-10 space-y-2 max-w-lg">
            <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
              New Public Welfare Scheme Live
            </h2>
            <p className="text-xs text-orange-55 leading-relaxed">
              Pradhan Mantri Digital Shiksha Abhiyan: AI literacy for everyone. Check eligibility
              parameters and register instantly via BharatBot companion.
            </p>
            <div className="flex gap-2.5 pt-1.5">
              <button
                onClick={() => onNavigate('chat')}
                className="px-4 py-2 bg-white text-orange-600 rounded-xl text-[10px] font-bold shadow-xs hover:bg-orange-50 transition-colors cursor-pointer"
              >
                Apply Now
              </button>
              <button
                onClick={() => {
                  onNavigate('schemes');
                }}
                className="px-4 py-2 bg-transparent border border-white/20 text-white rounded-xl text-[10px] font-bold hover:bg-white/5 transition-colors cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="relative z-10 shrink-0 self-end sm:self-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md">
              <div className="text-2xl sm:text-3xl select-none animate-pulse">🇮🇳</div>
            </div>
          </div>

          {/* Decorative backdrop blobs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        {/* Card 6: Digital Inclusion & Accessibility Tips (Col-span-2) */}
        <div className="col-span-1 md:col-span-2 bg-slate-800 text-slate-300 rounded-3xl p-5 space-y-3.5 border border-slate-700/80 shadow-xs">
          <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-orange-400" />
            Digital Inclusion & Accessibility Tips
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We are committed to making government assistance simple, transparent, and reachable for
            every citizen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex gap-2.5">
              <Languages className="w-5 h-5 text-orange-400 shrink-0" />
              <div className="space-y-1">
                <h4 className="font-bold text-white text-[11px]">Regional Voices</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Read schemes and hear AI responses spoken aloud in regional dialects.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="space-y-1">
                <h4 className="font-bold text-white text-[11px]">Verified Checklists</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Consult physical form pre-requisites to ensure a single-visit solution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 7: Easy Citizen Journey (Col-span-2) */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Easy Citizen Journey
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Ask Bapu AI</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Type/speak in Hindi, Tamil, Telugu. Get simplified answers immediately.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Verify Readiness</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Inspect mandatory certificate documents list and eligibility criteria.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Draft Petitions</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    AI structures official letters in standard administrative form instantly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-[10px] font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Track Grievance</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Log road/light issues with visual status logs to trigger ward routing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 8: National Helpline Links (Col-span-1) */}
        <div className="col-span-1 bg-orange-50/40 border border-orange-100 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-orange-800 uppercase tracking-widest">
              National Helpline Links
            </h4>
            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="border-b border-orange-100/50 pb-1.5 flex justify-between items-center">
                <span>Civic Grievance:</span>
                <span className="font-bold text-slate-800">1800-11-4000</span>
              </div>
              <div className="border-b border-orange-100/50 pb-1.5 flex justify-between items-center">
                <span>Aadhaar Support:</span>
                <span className="font-bold text-slate-800">1947</span>
              </div>
              <div className="flex justify-between items-center">
                <span>PM-JAY Health:</span>
                <span className="font-bold text-slate-800">14555</span>
              </div>
            </div>
          </div>
          <p className="text-[9px] text-orange-500/80 font-bold uppercase tracking-wider mt-3">
            24x7 Support Available
          </p>
        </div>
      </div>

      {/* Aesthetic layout bottom bar footer details */}
      <div className="mt-8 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between text-[10px] text-slate-400 uppercase font-black tracking-widest gap-2">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <span>Verified Platform</span>
          <span>Data Privacy Guaranteed</span>
          <span>Transparency Protocol 1.4</span>
        </div>
        <div className="flex gap-4">
          <span>Emergency Helpdesk: 112</span>
          <span className="text-orange-500">© Digital India 2026</span>
        </div>
      </div>
    </div>
  );
}
