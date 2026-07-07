import React, { useState, useEffect } from 'react';
import {
  Home,
  MessageSquare,
  Building2,
  AlertTriangle,
  Sparkles,
  Languages,
  Smartphone,
  HelpCircle,
  Menu,
  X,
  Clock,
  Shield,
  Eye,
  Settings
} from 'lucide-react';
import { Service, Complaint } from './types';
import { OFFICIAL_SERVICES } from './servicesData';
import { Logger } from './utils/logger';
import { ApiClient } from './utils/api';

// Import our modular subcomponents
import DashboardOverview from './components/DashboardOverview';
import CompanionChat from './components/CompanionChat';
import JanSevaCenter from './components/JanSevaCenter';
import GrievancePortal from './components/GrievancePortal';

/**
 * Main application component for Nagrik Setu Civic Portal.
 * Manages core layout, active tabs, e-KYC status, and accessibility modes.
 *
 * @returns {JSX.Element} The rendered application layout
 */
export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stats summary counts
  const [complaintsCount, setComplaintsCount] = useState(3);
  const [resolvedCount, setResolvedCount] = useState(0);

  // Digital Inclusion / Accessibility states
  const [largeTextMode, setLargeTextMode] = useState(false);

  // Real-time dynamic clock (Indian Standard Time or local)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Periodically syncs civic statistics and complaint counters with the backend server.
   */
  const syncStats = async () => {
    try {
      const data = await ApiClient.getComplaints();
      setComplaintsCount(data.length);
      setResolvedCount(data.filter((c) => c.status === 'resolved').length);
    } catch (err) {
      Logger.error('Failed to synchronize statistics in App.tsx', err);
    }
  };

  useEffect(() => {
    syncStats();
    // Re-check periodically every 10 seconds
    const syncInterval = setInterval(syncStats, 10000);
    return () => clearInterval(syncInterval);
  }, []);

  /**
   * Sets the active service details to view within Jan Seva Center.
   *
   * @param {string} serviceId Unique Aadhaar or policy ID
   */
  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  const navItems = [
    { id: 'dashboard', label: 'Civic Home', icon: Home },
    { id: 'chat', label: 'Talk to Bapu AI', icon: MessageSquare, badge: 'AI' },
    { id: 'schemes', label: 'Jan Seva Center', icon: Building2 },
    { id: 'grievance', label: 'Grievance Portal', icon: AlertTriangle }
  ];

  return (
    <div
      id="app-root"
      className={`min-h-screen bg-slate-50/50 font-sans text-slate-600 flex flex-col md:flex-row
        ${largeTextMode ? 'text-lg' : 'text-sm'}
      `}
    >
      {/* LEFT SIDEBAR: Desktop Navigation & App Branding */}
      <aside
        id="desktop-sidebar"
        className="w-64 bg-slate-900 text-slate-300 flex-col border-r border-slate-800 shrink-0 hidden md:flex"
      >
        {/* App Title with Flag Stripe Accent */}
        <div className="relative p-6 border-b border-slate-800">
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="flex-1 bg-orange-500"></div>
            <div className="w-1/12 bg-white"></div>
            <div className="flex-1 bg-emerald-600"></div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md font-display font-black text-lg">
              NS
            </div>
            <div>
              <h2 className="font-display font-extrabold text-white text-base tracking-tight flex items-center gap-1">
                Nagrik Setu
              </h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Civic Companion
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group
                  ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <IconComponent
                    className={`w-4.5 h-4.5 transition-colors 
                    ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}
                  `}
                  />
                  {item.label}
                </span>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                    ${isSelected ? 'bg-orange-700 text-white' : 'bg-orange-500/20 text-orange-400'}
                  `}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile / Verified Status Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-display font-semibold text-xs">
              SU
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                Srishti Upadhyay
                <Shield className="w-3 h-3 text-emerald-400" />
              </div>
              <p className="text-[10px] text-slate-500">Verified Resident (e-KYC)</p>
            </div>
          </div>

          <div className="px-2.5 py-1.5 bg-slate-900 rounded-lg border border-slate-850 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Aadhaar Link:</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR NAVIGATION */}
      <header
        id="mobile-header"
        className="md:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
            NS
          </div>
          <span className="font-display font-extrabold text-sm tracking-tight text-white">
            Nagrik Setu
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-slate-350 border-b border-slate-850 p-4 space-y-2 z-50 shrink-0">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 cursor-pointer
                  ${isSelected ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}
                `}
              >
                <IconComponent className="w-4.5 h-4.5" />
                {item.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs">
              SU
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Srishti Upadhyay</p>
              <p className="text-[10px] text-slate-500">e-KYC Verified</p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER: Top Header + Main content panel */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0">
        {/* Top Control Header Bar */}
        <header
          id="top-control-bar"
          className="bg-white border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0"
        >
          {/* Multilingual welcoming slogan */}
          <div className="flex items-center gap-2">
            <span className="p-1 bg-orange-50 rounded-md border border-orange-100 text-orange-600">
              <Languages className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-slate-400 tracking-wider">
              Selected Citizen Portal
            </span>
          </div>

          {/* Clock, Accessibility Toggles, Inclusion controls */}
          <div className="flex items-center gap-4 text-xs">
            {/* dynamic Clock */}
            <div className="hidden lg:flex items-center gap-1.5 text-slate-400 font-mono font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                IST:{' '}
                {currentTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>

            {/* Accessibility toggle */}
            <button
              onClick={() => setLargeTextMode(!largeTextMode)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all
                ${
                  largeTextMode
                    ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold'
                    : 'border-slate-150 text-slate-500 hover:bg-slate-50'
                }
              `}
              title="Enhance accessibility for children and senior citizens"
            >
              <Eye className="w-3.5 h-3.5" />
              {largeTextMode ? 'Standard Text' : 'Inclusion Text (Larger)'}
            </button>

            {/* central secure server badge */}
            <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold text-[10px] uppercase">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Secure Portal
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <section
          id="content-viewport"
          className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-7xl w-full mx-auto"
        >
          {/* Conditional rendering for Active Tabs */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              services={OFFICIAL_SERVICES}
              complaintsCount={complaintsCount}
              resolvedCount={resolvedCount}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectService={handleSelectService}
            />
          )}

          {activeTab === 'chat' && <CompanionChat />}

          {activeTab === 'schemes' && (
            <JanSevaCenter
              selectedServiceId={selectedServiceId}
              onClearSelectedService={() => setSelectedServiceId(null)}
            />
          )}

          {activeTab === 'grievance' && <GrievancePortal />}
        </section>
      </main>
    </div>
  );
}
