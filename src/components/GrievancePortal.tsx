import React, { useState, useEffect, useMemo } from 'react';
import {
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Send,
  Loader2,
  ChevronRight,
  Sparkles,
  FileText,
  Copy,
  Check,
  X,
  Building2,
  Calendar
} from 'lucide-react';
import { Complaint } from '../types';
import { ApiClient } from '../utils/api';
import { Logger } from '../utils/logger';
import { MarkdownRenderer } from './MarkdownRenderer';

const COMPLAINT_CATEGORIES = [
  'Potholes & Road Repairs',
  'Street Lights & Safety',
  'Water Supply & Sewage',
  'Garbage Cleaning & Hygiene',
  'Electricity & Feeder Box',
  'Encroachment & Parking'
];

const DEPARTMENTS: Record<string, string> = {
  'Potholes & Road Repairs': 'Municipal Works / PWD Department',
  'Street Lights & Safety': 'Bescom / State Electricity Board',
  'Water Supply & Sewage': 'Water Supply & Sewerage Board (DJB/BWSSB)',
  'Garbage Cleaning & Hygiene': 'Solid Waste Management Division',
  'Electricity & Feeder Box': 'Power Distribution Corporation',
  'Encroachment & Parking': 'Traffic Police & Ward Encroachment Wing'
};

export default function GrievancePortal() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // New Complaint Form state
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState(COMPLAINT_CATEGORIES[0]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [citizenName, setCitizenName] = useState('Srishti Upadhyay');
  const [citizenPhone, setCitizenPhone] = useState('9876543210');
  const [citizenEmail, setCitizenEmail] = useState('srishti.u@hackathon.in');
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // New Official log comment state
  const [updateText, setUpdateText] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // AI draft letter state
  const [draftingLetter, setDraftingLetter] = useState(false);
  const [letterText, setLetterText] = useState<string | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);

  /**
   * Loads all complaints logged in the civic grievance system from the backend.
   *
   * @returns {Promise<void>} A promise resolving when the state is set and loaded
   */
  const fetchComplaints = async () => {
    try {
      const data = await ApiClient.getComplaints();
      setComplaints(data);
      if (data.length > 0 && !selectedComplaint) {
        setSelectedComplaint(data[0]);
      }
    } catch (err: any) {
      Logger.error('Failed to load complaints from server', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /**
   * Form handler to register a new civic grievance with the local municipal authority.
   *
   * @param {React.FormEvent} e - Form submission event
   * @returns {Promise<void>} A promise resolving when the form has been processed
   */
  const handleRegisterGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newLocation) {
      alert('Please fill all required grievance fields!');
      return;
    }

    setFormSubmitLoading(true);
    try {
      const payload = {
        category: newCategory,
        title: newTitle,
        description: newDesc,
        location: newLocation,
        state: 'Karnataka',
        pincode: newPincode,
        priority: newPriority,
        citizenName,
        citizenPhone,
        citizenEmail,
        department: DEPARTMENTS[newCategory] || 'Local Municipal Authority'
      };

      const created = await ApiClient.submitComplaint(payload);
      setComplaints((prev) => [created, ...prev]);
      setSelectedComplaint(created);
      setShowForm(false);
      // Clear inputs
      setNewTitle('');
      setNewDesc('');
      setNewLocation('');
      setNewPincode('');
    } catch (err: any) {
      Logger.error('Failed to submit grievance', err);
      alert('Error submitting complaint.');
    } finally {
      setFormSubmitLoading(false);
    }
  };

  /**
   * Adds a new supervisor or citizen status update comment to the selected grievance.
   *
   * @returns {Promise<void>} A promise resolving when the update comment has been posted
   */
  const handlePostOfficialUpdate = async () => {
    if (!updateText.trim() || !selectedComplaint) return;
    setUpdateLoading(true);
    try {
      const updatedComplaint = await ApiClient.addComplaintUpdate(
        selectedComplaint.id,
        updateText,
        'Citizen / Portal Supervisor'
      );
      // Update both list and selection
      setComplaints((prev) =>
        prev.map((c) => (c.id === updatedComplaint.id ? updatedComplaint : c))
      );
      setSelectedComplaint(updatedComplaint);
      setUpdateText('');
    } catch (err: any) {
      Logger.error('Could not post update comment', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  /**
   * Triggers Bapu AI letter generator to outline an official administrative letter
   * regarding the selected grievance issue.
   *
   * @returns {Promise<void>} A promise resolving when the letter has been generated
   */
  const handleGenerateAILetter = async () => {
    if (!selectedComplaint) return;
    setDraftingLetter(true);
    setLetterText(null);
    try {
      const data = await ApiClient.draftLetter(
        selectedComplaint.category,
        selectedComplaint.description,
        selectedComplaint.location,
        selectedComplaint.citizenName,
        'English'
      );
      setLetterText(data.text);
    } catch (err: any) {
      Logger.error('Failed to contact Bapu AI letter builder', err);
    } finally {
      setDraftingLetter(false);
    }
  };

  /**
   * Copies the drafted letter to system clipboard with user feedback.
   *
   * @returns {void}
   */
  const copyLetterToClipboard = () => {
    if (!letterText) return;
    navigator.clipboard.writeText(letterText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  // Search filter
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, searchTerm, statusFilter, priorityFilter]);

  return (
    <div id="grievance-root" className="space-y-6">
      {/* Title block */}
      <div
        id="grievance-header"
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            Civic Grievance & Tracking Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Log municipal hazards, track public repairs visually, and generate official petitions
            with AI.
          </p>
        </div>

        <button
          id="btn-show-form"
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          File New Grievance
        </button>
      </div>

      {/* Main split: left 1/3 list, right 2/3 tracking details */}
      <div id="grievance-main-split" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: search and complaints log */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3 shadow-xs">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, keyword..."
                className="w-full p-2.5 pl-9 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 placeholder-slate-400"
              />
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl text-xs text-slate-600 cursor-pointer focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="submitted">Logged</option>
                <option value="assigned">Assigned</option>
                <option value="investigating">Inspected</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl text-xs text-slate-600 cursor-pointer focus:outline-none"
              >
                <option value="All">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Scroll List */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-500 mb-2" />
                Retrieving localized grievances...
              </div>
            ) : filteredComplaints.length > 0 ? (
              filteredComplaints.map((item) => (
                <div
                  key={item.id}
                  id={`complaint-card-${item.id}`}
                  onClick={() => setSelectedComplaint(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 select-none
                    ${
                      selectedComplaint?.id === item.id
                        ? 'border-orange-500 bg-orange-50/10 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-orange-250 hover:shadow-2xs'
                    }
                  `}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        {item.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase
                        ${item.status === 'submitted' ? 'bg-slate-100 text-slate-700' : ''}
                        ${item.status === 'assigned' ? 'bg-blue-50 text-blue-700' : ''}
                        ${item.status === 'investigating' ? 'bg-amber-50 text-amber-700' : ''}
                        ${item.status === 'in_progress' ? 'bg-purple-50 text-purple-700' : ''}
                        ${item.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : ''}
                      `}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-xs sm:text-sm text-slate-700 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-500" />
                      {item.pincode}
                    </span>
                    <span
                      className={`font-semibold uppercase ${item.priority === 'high' ? 'text-rose-600' : 'text-slate-500'}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-100 text-slate-400 text-xs">
                No complaints fit these filters.
              </div>
            )}
          </div>
        </div>

        {/* Right column: active complaint tracking log and actions */}
        <div className="lg:col-span-2">
          {selectedComplaint ? (
            <div
              id="grievance-details"
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6"
            >
              {/* Heading */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-50 pb-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-mono font-bold uppercase">
                    {selectedComplaint.id} • Registered Portal
                  </span>
                  <h2 className="text-base sm:text-lg font-display font-bold text-slate-800">
                    {selectedComplaint.title}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    {selectedComplaint.location}
                  </p>
                </div>

                <button
                  onClick={handleGenerateAILetter}
                  disabled={draftingLetter}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                >
                  {draftingLetter ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  )}
                  AI Draft Complaint Petition
                </button>
              </div>

              {/* Main Content Split: Descriptions & Visual Status Timeline Tracker */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Details list (Left 3 cols) */}
                <div className="md:col-span-3 space-y-5">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Detailed Report
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-sans">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  {/* Citizen details & Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Citizen Details
                      </h4>
                      <div className="space-y-1 text-xs text-slate-500">
                        <p className="flex items-center gap-1.5 font-medium text-slate-700">
                          <User className="w-3.5 h-3.5 text-slate-400" />{' '}
                          {selectedComplaint.citizenName}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />{' '}
                          {selectedComplaint.citizenPhone}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />{' '}
                          {selectedComplaint.citizenEmail}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Assigned Department
                      </h4>
                      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs">
                        <p className="font-bold text-blue-900">{selectedComplaint.department}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">
                          SLA Auto Routing Enabled
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Updates logs */}
                  <div className="space-y-3 pt-3 border-t border-slate-50">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Official Action Logs ({selectedComplaint.updates.length})
                    </h4>

                    {/* Add log update box */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        placeholder="Log status notes (e.g. 'Crew dispatched to locate line joint')..."
                        className="flex-1 p-2 text-xs border border-slate-100 rounded-lg focus:outline-none focus:border-orange-500 bg-slate-50"
                      />
                      <button
                        onClick={handlePostOfficialUpdate}
                        disabled={updateLoading || !updateText.trim()}
                        className="px-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-xs font-semibold flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        {updateLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[22vh] overflow-y-auto">
                      {selectedComplaint.updates.map((upd, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1"
                        >
                          <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span className="font-semibold text-slate-600">{upd.author}</span>
                            <span>{upd.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-sans leading-relaxed">
                            {upd.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tracking Visual Timeline (Right 2 cols) */}
                <div className="md:col-span-2 bg-slate-50/50 rounded-2xl border border-slate-200 p-4 space-y-5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                    Grievance Flow Tracker
                  </h4>

                  <div className="relative pl-6 border-l border-slate-200 ml-4 space-y-6 pt-1 pb-1">
                    {selectedComplaint.trackingTimeline.map((step, idx) => {
                      const isActive = step.active || selectedComplaint.status === step.status;
                      const isCompleted = step.date !== '';

                      return (
                        <div key={idx} className="relative">
                          {/* Dot */}
                          <div
                            className={`absolute -left-[30px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-[9px] font-bold text-white transition-all
                            ${
                              isCompleted
                                ? 'bg-emerald-600'
                                : isActive
                                  ? 'bg-orange-500 ring-2 ring-orange-200 animate-pulse'
                                  : 'bg-slate-200'
                            }
                          `}
                          >
                            {isCompleted && '✓'}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h5
                                className={`text-xs font-bold font-display
                                ${isActive ? 'text-slate-800' : 'text-slate-400'}
                              `}
                              >
                                {step.label}
                              </h5>
                              {step.date && (
                                <span className="text-[9px] font-mono font-medium text-slate-400">
                                  {step.date}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dynamic interactive hint */}
                  {selectedComplaint.status !== 'resolved' && (
                    <div className="text-[10px] text-slate-400 text-center bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed font-semibold">
                      💡 Tip: Submitting a log note above simulates administrative updates,
                      advancing the tracking stage!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-slate-400 bg-white rounded-xl border border-slate-100 shadow-xs">
              Select or register a civic complaint to inspect details and live timeline tracks.
            </div>
          )}
        </div>
      </div>

      {/* Form Dialog Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-xl w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <h3 className="font-display font-bold text-slate-800 text-sm">
                Register New Civic Complaint
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer animate-fade"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleRegisterGrievance}
              className="p-6 space-y-4 overflow-y-auto max-h-[75vh]"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Issue Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-100 rounded-lg bg-slate-50 focus:outline-none focus:border-orange-500 cursor-pointer font-semibold text-slate-600"
                  >
                    {COMPLAINT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Urgency Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-100 rounded-lg bg-slate-50 focus:outline-none focus:border-orange-500 cursor-pointer font-semibold text-slate-600"
                  >
                    <option value="high">High Urgency</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Complaint Heading / Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Row of 6 Streetlights blown near Sector-4 Main Park"
                  className="w-full p-2.5 text-xs border border-slate-100 rounded-lg focus:outline-none focus:border-orange-500 bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Detailed Narrative
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe details: duration of distress, current safety hazards, and any past requests."
                  className="w-full p-2.5 h-24 text-xs border border-slate-100 rounded-lg focus:outline-none focus:border-orange-500 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Specific Street / Area Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g., Sector-4, HSR Layout, Near park door"
                    className="w-full p-2.5 text-xs border border-slate-100 rounded-lg focus:outline-none focus:border-orange-500 bg-slate-50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    placeholder="e.g., 560102"
                    className="w-full p-2.5 text-xs border border-slate-100 rounded-lg focus:outline-none focus:border-orange-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Citizen Credentials Card */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Citizen Reporter Credentials
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="p-2 border border-slate-100 rounded-md bg-white text-xs text-slate-600 focus:outline-none"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="p-2 border border-slate-100 rounded-md bg-white text-xs text-slate-600 focus:outline-none"
                    placeholder="Phone"
                  />
                  <input
                    type="text"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    className="p-2 border border-slate-100 rounded-md bg-white text-xs text-slate-600 focus:outline-none"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="py-2 px-5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  {formSubmitLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Register & Route Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Letter Output Overlay Drawer */}
      {selectedComplaint && (draftingLetter || letterText) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800">
                    Bapu AI Drafted Official Petition
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Standard Indian Administrative Format
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLetterText(null)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-slate-700 bg-slate-50 leading-relaxed whitespace-pre-wrap">
              {letterText ? (
                <div>{letterText}</div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center gap-3 font-sans">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  <p className="text-xs text-slate-400 font-semibold">
                    Structuring official headings, formatting formal language, and compiling
                    grievance details...
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <p className="text-[10px] text-slate-400 font-sans">
                You can print or submit this directly to physical offices.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setLetterText(null)}
                  className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                {letterText && (
                  <button
                    onClick={copyLetterToClipboard}
                    className="py-1.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1"
                  >
                    {copiedLetter ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Letter
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
