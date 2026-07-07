import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Building2,
  FileText,
  Sparkles,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  Languages,
  AlertCircle
} from 'lucide-react';
import { Service } from '../types';
import { OFFICIAL_SERVICES } from '../servicesData';
import { Logger } from '../utils/logger';
import { ApiClient } from '../utils/api';
import { MarkdownRenderer } from './MarkdownRenderer';

interface JanSevaCenterProps {
  selectedServiceId: string | null;
  onClearSelectedService: () => void;
}

const CATEGORIES = ['All', 'Identity', 'Welfare', 'Finance', 'Health', 'Agriculture', 'Education'];

export default function JanSevaCenter({
  selectedServiceId,
  onClearSelectedService
}: JanSevaCenterProps) {
  const [services] = useState<Service[]>(OFFICIAL_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  // AI Simplification state
  const [simplifyingId, setSimplifyingId] = useState<string | null>(null);
  const [simplifiedText, setSimplifiedText] = useState<string | null>(null);
  const [simplifyLanguage, setSimplifyLanguage] = useState('Hindi');
  const [simplifyError, setSimplifyError] = useState<string | null>(null);

  // Handle selected service from dashboard navigation
  useEffect(() => {
    if (selectedServiceId) {
      setExpandedServiceId(selectedServiceId);
      // Scroll to that element
      setTimeout(() => {
        const el = document.getElementById(`service-card-${selectedServiceId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      onClearSelectedService();
    }
  }, [selectedServiceId]);

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
    const bcp47Code = bcp47Map[simplifyLanguage] || 'en';
    document.documentElement.setAttribute('lang', bcp47Code);
  }, [simplifyLanguage]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.nameRegional && s.nameRegional.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  /**
   * Triggers the AI backend to simplify the complex wording, document requirements,
   * eligibility criteria, and benefits of a scheme into the user's preferred regional language.
   *
   * @param {Service} service - The target service details
   * @returns {Promise<void>} A promise resolving when the simplified view text is retrieved
   */
  const handleSimplifyWithAI = async (service: Service) => {
    setSimplifyingId(service.id);
    setSimplifiedText(null);
    setSimplifyError(null);

    try {
      const schemePayloadText = `
        Name: ${service.name}
        Category: ${service.category}
        Description: ${service.description}
        Eligibility: ${service.eligibility.join(', ')}
        Documents Needed: ${service.documentsRequired.join(', ')}
        Benefits: ${service.benefits}
      `;

      const data = await ApiClient.simplifyScheme(schemePayloadText, simplifyLanguage);
      setSimplifiedText(data.text);
    } catch (err: any) {
      Logger.error('Failed to simplify scheme with Bapu AI', err);
      setSimplifyError(err.message || 'Could not generate simplification.');
    }
  };

  return (
    <div id="jan-seva-root" className="space-y-6">
      {/* Intro Header */}
      <div
        id="jan-seva-header"
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-orange-500" />
            Jan Seva Center (Government Directory)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Search central and state schemes. Check eligibility, get checklist certificates, or
            translate with AI.
          </p>
        </div>

        {/* Simplify language selection */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-600">
          <Languages className="w-3.5 h-3.5 text-slate-400" />
          <span>Simplify AI Language:</span>
          <select
            value={simplifyLanguage}
            onChange={(e) => setSimplifyLanguage(e.target.value)}
            className="font-semibold bg-transparent border-none outline-none text-orange-600 cursor-pointer text-xs"
          >
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
            <option value="Telugu">తెలుగు (Telugu)</option>
            <option value="Bengali">বাংলা (Bengali)</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div id="search-filter-controls" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search schemes e.g. Aadhaar, Farmer, Ayushman Bharat..."
            className="w-full p-3.5 pl-10 text-xs sm:text-sm border border-slate-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 placeholder-slate-400 bg-white"
          />
        </div>

        {/* Categories scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />
          <div className="flex gap-1.5 w-full">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3.5 text-xs border border-slate-200 rounded-2xl focus:outline-none bg-white font-medium text-slate-600 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} Schemes
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Schemes */}
      <div id="services-grid" className="space-y-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => {
            const isExpanded = expandedServiceId === service.id;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className={`bg-white rounded-3xl border border-slate-200 transition-all shadow-sm overflow-hidden
                  ${isExpanded ? 'ring-2 ring-orange-500/15 border-orange-500 shadow-md' : 'hover:border-orange-300 hover:shadow-xs'}
                `}
              >
                {/* Header Section */}
                <div
                  onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase
                        ${service.category === 'Identity' ? 'bg-blue-50 text-blue-700' : ''}
                        ${service.category === 'Health' ? 'bg-red-50 text-red-700' : ''}
                        ${service.category === 'Agriculture' ? 'bg-emerald-50 text-emerald-700' : ''}
                        ${service.category === 'Welfare' ? 'bg-amber-50 text-amber-700' : ''}
                        ${service.category === 'Finance' ? 'bg-purple-50 text-purple-700' : ''}
                        ${service.category === 'Education' ? 'bg-indigo-50 text-indigo-700' : ''}
                      `}
                      >
                        {service.category}
                      </span>
                      {service.nameRegional && (
                        <span className="text-[11px] font-medium text-orange-500 font-sans hidden sm:inline">
                          {service.nameRegional}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-display font-bold text-slate-700">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-4xl">
                      {service.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-slate-400 hover:text-slate-600">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Details Section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left & Center: Eligibility, Docs, Benefits */}
                    <div className="md:col-span-2 space-y-4">
                      {/* Eligibility criteria */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          🎯 Eligibility Criteria
                        </h4>
                        <ul className="space-y-1">
                          {service.eligibility.map((elig, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-slate-500 flex items-start gap-1.5"
                            >
                              <span className="text-emerald-500 font-bold shrink-0">✓</span>
                              <span>{elig}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Documents checklists */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          📋 Certificates & Documents Needed
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.documentsRequired.map((doc, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                              <span className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                                {doc}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          💡 Primary Benefits
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{service.benefits}</p>
                      </div>
                    </div>

                    {/* Right side: Action Cards & AI simplification button */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Processing Duration
                          </p>
                          <p className="text-xs font-semibold text-slate-700">
                            {service.processingTime}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Official Access Point
                          </p>
                          <a
                            href={service.officialPortal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer"
                          >
                            Launch Service Portal
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* AI Simplification panel */}
                      <div className="pt-2 border-t border-slate-150 space-y-2">
                        <button
                          onClick={() => handleSimplifyWithAI(service)}
                          className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                          AI Simplified View ({simplifyLanguage})
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-100 shadow-xs space-y-3">
            <p className="text-slate-400 text-sm font-medium">
              No services found matching your query.
            </p>
            <p className="text-xs text-slate-300">
              Try modifying your category filters or search parameters.
            </p>
          </div>
        )}
      </div>

      {/* AI Simplification Output Dialog Overlay */}
      {simplifyingId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800">
                    Bapu AI Simplified Summary
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Translated and summarized in {simplifyLanguage}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSimplifyingId(null)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scroll */}
            <div className="p-6 overflow-y-auto space-y-4">
              {simplifiedText ? (
                <div className="space-y-3 text-slate-600 leading-relaxed">
                  <MarkdownRenderer text={simplifiedText} />
                </div>
              ) : simplifyError ? (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{simplifyError}</span>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  <p className="text-xs text-slate-400 font-semibold">
                    Translating terminology, simplifying clauses, and drafting checklist in{' '}
                    {simplifyLanguage}...
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-right shrink-0">
              <button
                onClick={() => setSimplifyingId(null)}
                className="py-1.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Got It, Thank You
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
