import React, { useState, useEffect } from 'react';
import type {
  Applicant,
  Role,
  DeclineReasonCategory,
  EmailSettings,
  RecruitmentConfig,
  EmailType,
  AdminUser,
} from '../types/recruitment';
import { DatabaseService } from '../services/db';
import { EmailService } from '../services/email';
import { BackendApiService } from '../services/api';
import { NeuraMorphixLogo } from './NeuraMorphixLogo';
import { WeBareBearsMascot } from './WeBareBearsMascot';
import {
  Users,
  Search,
  Eye,
  EyeOff,
  Mail,
  Settings,
  MessageSquare,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Sliders,
  LogOut,
  Lock,
  AlertCircle,
  Key,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectTab?: (tab: 'home' | 'apply' | 'track' | 'admin') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  // Admin auth state
  const [sessionUser, setSessionUser] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('neuramorphix_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!sessionStorage.getItem('neuramorphix_admin_user');
    } catch {
      return false;
    }
  });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('moni@neuramophrix.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const adminUser = sessionUser
    ? `${sessionUser.name} (${sessionUser.role})`
    : 'Admin Recruiter';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!loginEmail.trim()) {
      setAuthError('Please enter your admin email address.');
      return;
    }
    if (!loginPassword.trim()) {
      setAuthError('Please enter your admin password.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const matchedAdmin = await BackendApiService.loginUser(loginEmail, loginPassword);
      if (matchedAdmin) {
        setSessionUser(matchedAdmin);
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem('neuramorphix_admin_user', JSON.stringify(matchedAdmin));
        } catch {
          // ignore
        }
        showToast(`Welcome back, ${matchedAdmin.name}! Authenticated as ${matchedAdmin.role}.`);
      } else {
        setAuthError('Invalid credentials. Check email & password (e.g. moni@neuramophrix.com / admin123).');
      }
    } catch {
      setAuthError('Authentication error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('neuramorphix_admin_user');
    } catch {
      // ignore
    }
    setSessionUser(null);
    setIsAuthenticated(false);
    setLoginPassword('');
    showToast('Logged out of Admin Portal.');
  };

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'applicants' | 'email_settings' | 'config'>('analytics');

  // State data from DB
  const [applicants, setApplicants] = useState<Applicant[]>(() => DatabaseService.getApplicants());
  const [roles, setRoles] = useState<Role[]>(() => DatabaseService.getRoles());
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(() => DatabaseService.getEmailSettings());
  const [config, setConfig] = useState<RecruitmentConfig>(() => DatabaseService.getConfig());

  // Search & Filters for Applicants Table
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Selected Applicant for detail view modal
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Action Modals
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState<DeclineReasonCategory>('Role capacity reached');
  const [declineNote, setDeclineNote] = useState('');

  const [showReqInfoModal, setShowReqInfoModal] = useState(false);
  const [reqInfoQuestion, setReqInfoQuestion] = useState('Please provide your GitHub repository or portfolio for your selected development role.');

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDetailsInput, setInterviewDetailsInput] = useState('Google Meet link: https://meet.google.com/nmx-recruit | Date: Sep 14, 2026 at 4:00 PM IST');

  const [showRoleAssignModal, setShowRoleAssignModal] = useState(false);
  const [assignedRoleChoice, setAssignedRoleChoice] = useState('');

  const [noteInput, setNoteInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Email Template Editing tab state
  const [editingTemplateType, setEditingTemplateType] = useState<EmailType>('application_received');
  const [templateSubject, setTemplateSubject] = useState(() => {
    const settings = DatabaseService.getEmailSettings();
    return settings.templates['application_received']?.subject || '';
  });
  const [templateBody, setTemplateBody] = useState(() => {
    const settings = DatabaseService.getEmailSettings();
    return settings.templates['application_received']?.body_template || '';
  });

  const refreshData = () => {
    const apps = DatabaseService.getApplicants();
    const rls = DatabaseService.getRoles();
    setApplicants(apps);
    setRoles(rls);
    setEmailSettings(DatabaseService.getEmailSettings());
    setConfig(DatabaseService.getConfig());
  };

  useEffect(() => {
    if (selectedApplicant) {
      const current = applicants.find((a) => a.id === selectedApplicant.id);
      if (current && current !== selectedApplicant) {
        setSelectedApplicant(current);
      }
    }
  }, [applicants, selectedApplicant]);

  useEffect(() => {
    if (emailSettings.templates[editingTemplateType]) {
      setTemplateSubject(emailSettings.templates[editingTemplateType].subject);
      setTemplateBody(emailSettings.templates[editingTemplateType].body_template);
    }
  }, [editingTemplateType, emailSettings]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Analytics Metrics
  const totalApps = applicants.length;
  const pendingApps = applicants.filter((a) => a.status === 'Application Received' || a.status === 'Under Review').length;
  const shortlistedApps = applicants.filter((a) => a.status === 'Shortlisted').length;
  const interviewApps = applicants.filter((a) => a.status === 'Interview').length;
  const acceptedApps = applicants.filter((a) => a.status === 'Accepted').length;
  const declinedApps = applicants.filter((a) => a.status === 'Declined').length;

  const getRoleApplicantCount = (roleName: string) => {
    return applicants.filter(
      (a) => a.first_preference === roleName || a.second_preference === roleName
    ).length;
  };

  // Filtered Applicants List
  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.application_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    const matchesRole =
      roleFilter === 'ALL' ||
      app.first_preference === roleFilter ||
      app.second_preference === roleFilter ||
      app.final_assigned_team === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Action Handlers
  const handleShortlist = (applicant: Applicant) => {
    const updated = DatabaseService.updateApplicant(applicant.id, {
      status: 'Shortlisted',
      reviewed_at: new Date().toISOString(),
    });
    if (updated) {
      EmailService.sendEmail('shortlisted', updated);
      refreshData();
      showToast(`Applicant ${applicant.full_name} moved to Shortlisted.`);
    }
  };

  const handleExecuteRequestInterview = () => {
    if (!selectedApplicant || !interviewDetailsInput.trim()) return;
    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      status: 'Interview',
      interview_details: interviewDetailsInput.trim(),
      reviewed_at: new Date().toISOString(),
    });
    if (updated) {
      EmailService.sendEmail('interview', updated, { interview_details: interviewDetailsInput.trim() });
      refreshData();
      setShowInterviewModal(false);
      showToast(`Interview requested for ${selectedApplicant.full_name}.`);
    }
  };

  const handleExecuteRequestInfo = () => {
    if (!selectedApplicant || !reqInfoQuestion.trim()) return;
    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      status: 'Information Requested',
      requested_info_question: reqInfoQuestion.trim(),
      reviewed_at: new Date().toISOString(),
    });
    if (updated) {
      EmailService.sendEmail('info_requested', updated, { requested_info_question: reqInfoQuestion.trim() });
      refreshData();
      setShowReqInfoModal(false);
      showToast(`Additional information requested from ${selectedApplicant.full_name}.`);
    }
  };

  const handleExecuteAccept = () => {
    if (!selectedApplicant) return;
    const assignedTeam = selectedApplicant.final_assigned_team || selectedApplicant.first_preference;

    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      status: 'Accepted',
      final_assigned_team: assignedTeam,
      accepted_at: new Date().toISOString(),
      accepted_by: adminUser,
    });
    if (updated) {
      EmailService.sendEmail('accepted', updated);
      refreshData();
      setShowAcceptModal(false);
      showToast(`Applicant ${selectedApplicant.full_name} ACCEPTED into ${assignedTeam}! Confirmation email sent.`);
    }
  };

  const handleExecuteDecline = () => {
    if (!selectedApplicant) return;
    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      status: 'Declined',
      decline_reason: declineReason,
      decline_note: declineNote.trim() || null,
      declined_at: new Date().toISOString(),
      declined_by: adminUser,
    });
    if (updated) {
      EmailService.sendEmail('declined', updated);
      refreshData();
      setShowDeclineModal(false);
      showToast(`Application for ${selectedApplicant.full_name} DECLINED. Polite email notification sent.`);
    }
  };

  const handleAddNote = () => {
    if (!selectedApplicant || !noteInput.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      author: adminUser,
      text: noteInput.trim(),
      created_at: new Date().toISOString(),
    };
    const updatedNotes = [...(selectedApplicant.admin_notes || []), newNote];
    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      admin_notes: updatedNotes,
    });
    if (updated) {
      setNoteInput('');
      refreshData();
      showToast('Internal note saved.');
    }
  };

  const handleAssignFinalTeam = () => {
    if (!selectedApplicant || !assignedRoleChoice) return;
    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      final_assigned_team: assignedRoleChoice,
    });
    if (updated) {
      refreshData();
      setShowRoleAssignModal(false);
      showToast(`Assigned final team to ${assignedRoleChoice}.`);
    }
  };

  const handleSaveEmailTemplate = () => {
    const settings = { ...emailSettings };
    settings.templates[editingTemplateType] = {
      subject: templateSubject,
      body_template: templateBody,
    };
    DatabaseService.saveEmailSettings(settings);
    setEmailSettings(settings);
    showToast(`Saved email template for [${editingTemplateType}]`);
  };

  const handleToggleEmailSetting = (key: keyof Omit<EmailSettings, 'templates'>) => {
    const settings = { ...emailSettings, [key]: !emailSettings[key] };
    DatabaseService.saveEmailSettings(settings);
    setEmailSettings(settings);
    showToast(`Updated email trigger notification settings.`);
  };

  const handleSaveConfig = (newConfig: RecruitmentConfig) => {
    DatabaseService.saveConfig(newConfig);
    setConfig(newConfig);
    showToast('Recruitment configuration saved.');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto py-10 px-4 sm:px-6">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] text-[#5C3928] text-xs font-cartoon shadow-[4px_4px_0px_#5C3928] flex items-center gap-3 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-[#D96B4C] shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="bear-card p-8 rounded-[28px] bg-[#FFF5DF] border-3 border-[#5C3928] shadow-[6px_6px_0px_#5C3928] relative overflow-hidden space-y-6">
          {/* Logo & Mascot Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-1">
              <NeuraMorphixLogo size={54} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border-2 border-[#5C3928] text-[#5C3928] text-[11px] font-cartoon uppercase tracking-wider shadow-[2px_2px_0px_#5C3928]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#527A58]" />
              NeuraMorphix Recruiter Portal
            </div>
            <h2 className="text-2xl font-cartoon font-bold text-[#5C3928] tracking-tight">Recruiter Sign In</h2>
            <p className="text-xs text-[#A96F45] font-medium">
              Enter your authorized recruiter or employee credentials to access the recruitment management dashboard.
            </p>
          </div>

          <div className="flex justify-center -my-1">
            <WeBareBearsMascot
              variant="ice_bear"
              size="sm"
              speechBubble="Ice Bear requires credentials before granting dashboard access."
            />
          </div>

          <div className="space-y-6 animate-fadeIn">
            {/* Error Alert */}
            {authError && (
              <div className="p-3.5 rounded-2xl bg-[#FFEBEE] border-2 border-[#C62828] text-[#C62828] text-xs flex items-start gap-2.5 animate-fadeIn shadow-[2px_2px_0px_#C62828]">
                <AlertCircle className="w-4 h-4 text-[#C62828] shrink-0 mt-0.5" />
                <span className="leading-snug font-medium">{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-cartoon text-[#5C3928] mb-1.5 uppercase">
                  Employee / Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="moni@neuramophrix.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-[#5C3928] text-[#5C3928] placeholder-[#A96F45]/50 text-sm focus:outline-none focus:ring-4 focus:ring-[#527A58]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cartoon text-[#5C3928] mb-1.5 uppercase">
                  Employee Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password (e.g. admin123)"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border-2 border-[#5C3928] text-[#5C3928] placeholder-[#A96F45]/50 text-sm focus:outline-none focus:ring-4 focus:ring-[#527A58]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A96F45] hover:text-[#5C3928] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="bear-btn-primary w-full py-3 rounded-2xl bg-[#527A58] hover:bg-[#436548] text-white font-cartoon text-sm shadow-[3px_3px_0px_#5C3928] border-2 border-[#5C3928] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Authenticating Employee...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In as Employee</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Fill Credentials Helper Box */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#5C3928] space-y-2.5 shadow-[2px_2px_0px_#5C3928]">
              <div className="flex items-center gap-2 text-xs font-cartoon text-[#5C3928] uppercase tracking-wider">
                <Key className="w-3.5 h-3.5 text-[#D96B4C]" />
                <span>Employee Demo Accounts</span>
              </div>
              <p className="text-[11px] text-[#A96F45] leading-normal font-medium">
                Click any employee account below to auto-fill credentials:
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('moni@neuramophrix.com');
                    setLoginPassword('admin123');
                    setAuthError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF7] border-2 border-[#5C3928] hover:border-[#527A58] text-left flex items-center justify-between group transition-all"
                >
                  <div>
                    <div className="text-xs font-bold text-[#5C3928] group-hover:text-[#527A58]">
                      moni@neuramophrix.com
                    </div>
                    <div className="text-[10px] text-[#A96F45]">Role: Executive Admin / Employee</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#FFF5DF] border border-[#5C3928] text-[#5C3928] font-mono font-bold">
                    admin123
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('recruitment.lead@neuramorphix.org');
                    setLoginPassword('admin123');
                    setAuthError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF7] border-2 border-[#5C3928] hover:border-[#527A58] text-left flex items-center justify-between group transition-all"
                >
                  <div>
                    <div className="text-xs font-bold text-[#5C3928] group-hover:text-[#527A58]">
                      recruitment.lead@neuramorphix.org
                    </div>
                    <div className="text-[10px] text-[#A96F45]">Role: Lead Recruiter (Dr. Vance)</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#FFF5DF] border border-[#5C3928] text-[#5C3928] font-mono font-bold">
                    admin123
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] text-[#5C3928] text-xs font-cartoon shadow-[4px_4px_0px_#5C3928] flex items-center gap-3 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[#D96B4C] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="bear-card p-6 rounded-[28px] bg-[#FFF5DF] border-3 border-[#5C3928] shadow-[4px_4px_0px_#5C3928] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white text-[#5C3928] text-[10px] font-cartoon uppercase border-2 border-[#5C3928] shadow-[1px_1px_0px_#5C3928]">
              Recruitment Team Portal
            </span>
            <span className="text-xs text-[#A96F45]">Logged in: <strong className="text-[#5C3928]">{adminUser}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cartoon text-[#5C3928] tracking-tight mt-1.5">
            NeuraMorphix <span className="text-[#D96B4C]">Recruitment Dashboard</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              DatabaseService.resetToDefaultSeed();
              refreshData();
              showToast('Reset database to default seed data.');
            }}
            className="bear-btn-primary px-3.5 py-2 rounded-xl text-xs font-cartoon bg-white hover:bg-[#FFFDF7] text-[#5C3928] border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928] flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Seed Data
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="bear-btn-primary px-3.5 py-2 rounded-xl text-xs font-cartoon bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#C62828] border-2 border-[#C62828] shadow-[2px_2px_0px_#C62828] flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Lock Portal
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 bg-[#FFF5DF] p-2 rounded-2xl border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-xl text-xs font-cartoon transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#527A58] text-white shadow-sm border-2 border-[#5C3928]'
              : 'text-[#5C3928] hover:bg-[#E5D7B7]/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Dashboard Metrics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('applicants')}
          className={`px-5 py-2.5 rounded-xl text-xs font-cartoon transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'applicants'
              ? 'bg-[#527A58] text-white shadow-sm border-2 border-[#5C3928]'
              : 'text-[#5C3928] hover:bg-[#E5D7B7]/60'
          }`}
        >
          <Users className="w-4 h-4" />
          Applicant Management ({applicants.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email_settings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-cartoon transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'email_settings'
              ? 'bg-[#527A58] text-white shadow-sm border-2 border-[#5C3928]'
              : 'text-[#5C3928] hover:bg-[#E5D7B7]/60'
          }`}
        >
          <Mail className="w-4 h-4" />
          Email Notifications & Templates
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`px-5 py-2.5 rounded-xl text-xs font-cartoon transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'config'
              ? 'bg-[#527A58] text-white shadow-sm border-2 border-[#5C3928]'
              : 'text-[#5C3928] hover:bg-[#E5D7B7]/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          Recruitment Date Control
        </button>
      </div>

      {/* TAB 1: ANALYTICS & METRICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
              <div className="text-[10px] uppercase font-cartoon text-[#A96F45] mb-1">Total Applications</div>
              <div className="text-3xl font-cartoon text-[#5C3928]">{totalApps}</div>
              <div className="text-[11px] text-[#527A58] mt-1 font-semibold">Logged candidates</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
              <div className="text-[10px] uppercase font-cartoon text-[#A96F45] mb-1">Pending Review</div>
              <div className="text-3xl font-cartoon text-[#F59E0B]">{pendingApps}</div>
              <div className="text-[11px] text-[#D97706] mt-1 font-semibold">Awaiting evaluation</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
              <div className="text-[10px] uppercase font-cartoon text-[#A96F45] mb-1">Shortlisted</div>
              <div className="text-3xl font-cartoon text-[#2B2D42]">{shortlistedApps}</div>
              <div className="text-[11px] text-[#2B2D42]/80 mt-1 font-semibold">Passed screening</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
              <div className="text-[10px] uppercase font-cartoon text-[#A96F45] mb-1">Interview</div>
              <div className="text-3xl font-cartoon text-[#7E22CE]">{interviewApps}</div>
              <div className="text-[11px] text-[#7E22CE]/80 mt-1 font-semibold">Scheduled interaction</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
              <div className="text-[10px] uppercase font-cartoon text-[#A96F45] mb-1">Accepted</div>
              <div className="text-3xl font-cartoon text-[#2E7D32]">{acceptedApps}</div>
              <div className="text-[11px] text-[#2E7D32]/80 mt-1 font-semibold">Selected members</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
              <div className="text-[10px] uppercase font-cartoon text-[#A96F45] mb-1">Declined</div>
              <div className="text-3xl font-cartoon text-[#C62828]">{declinedApps}</div>
              <div className="text-[11px] text-[#C62828]/80 mt-1 font-semibold">Not selected</div>
            </div>
          </div>

          {/* Role-Wise Statistics Breakdown for 10 Teams */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">Role-Wise Applicant Statistics</h3>
              <p className="text-xs text-slate-400 mt-1">Breakdown of applicant preference choices across all 10 NeuraMorphix recruitment teams.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => {
                const count = getRoleApplicantCount(role.role_name);
                const percent = totalApps > 0 ? Math.round((count / (totalApps * 2)) * 100) : 0;
                return (
                  <div key={role.role_id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-100">{role.role_name}</span>
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {count} applicants
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, percent * 2))}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPLICANT MANAGEMENT */}
      {activeTab === 'applicants' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search & Filters */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search applicants by name, ID, email, college, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl glass-input text-xs bg-slate-900 text-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="Application Received">Application Received</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Information Requested">Information Requested</option>
                <option value="Information Received">Information Received</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl glass-input text-xs bg-slate-900 text-white"
              >
                <option value="ALL">All Teams</option>
                {roles.map((r) => (
                  <option key={r.role_id} value={r.role_name}>
                    {r.role_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table of Applicants */}
          <div className="glass-panel rounded-2xl overflow-hidden border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Application ID & Name</th>
                    <th className="px-6 py-4">College & Dept</th>
                    <th className="px-6 py-4">First Preference</th>
                    <th className="px-6 py-4">Second Preference</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredApplicants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        No applicants found matching the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApplicants.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">{app.full_name}</div>
                          <div className="font-mono text-cyan-400 font-semibold">{app.application_id}</div>
                          <div className="text-[11px] text-slate-400">{app.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-200 font-medium">{app.college}</div>
                          <div className="text-[11px] text-slate-400">{app.department} ({app.year})</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-cyan-300">{app.first_preference}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-amber-300">{app.second_preference}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold border inline-block ${
                              app.status === 'Accepted'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : app.status === 'Declined'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : app.status === 'Interview'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : app.status === 'Information Requested'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedApplicant(app)}
                            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold border border-cyan-500/40 transition-all flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* APPLICANT DETAIL MODAL */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-4xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border-cyan-500/30">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                  ID: {selectedApplicant.application_id}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">{selectedApplicant.full_name}</h2>
                <p className="text-xs text-slate-400">{selectedApplicant.college} • {selectedApplicant.department} ({selectedApplicant.year})</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Quick Action Bar */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-300">
                Current Status: <span className="text-cyan-300 font-bold">{selectedApplicant.status}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleShortlist(selectedApplicant)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-slate-950 border border-blue-500/40"
                >
                  SHORTLIST
                </button>

                <button
                  type="button"
                  onClick={() => setShowInterviewModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40"
                >
                  REQUEST INTERVIEW
                </button>

                <button
                  type="button"
                  onClick={() => setShowReqInfoModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-slate-950 border border-purple-500/40"
                >
                  REQUEST INFO
                </button>

                <button
                  type="button"
                  onClick={() => setShowRoleAssignModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  CHANGE ROLE
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeclineModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 border border-rose-500/40"
                >
                  DECLINE
                </button>

                <button
                  type="button"
                  onClick={() => setShowAcceptModal(true)}
                  className="px-4 py-1.5 rounded-lg text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md"
                >
                  ACCEPT APPLICANT
                </button>
              </div>
            </div>

            {/* Application Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-400 uppercase text-[10px]">Contact Information</h4>
                  <div>Email: <strong className="text-white">{selectedApplicant.email}</strong></div>
                  <div>Phone: <strong className="text-white">{selectedApplicant.phone}</strong></div>
                  <div>Application Date: <strong className="text-white">{new Date(selectedApplicant.created_at).toLocaleDateString()}</strong></div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-400 uppercase text-[10px]">Role Preferences & Assigned Team</h4>
                  <div>🥇 First Choice: <strong className="text-cyan-300">{selectedApplicant.first_preference}</strong></div>
                  <div>🥈 Second Choice: <strong className="text-amber-300">{selectedApplicant.second_preference}</strong></div>
                  <div className="pt-2 border-t border-slate-800">
                    Final Assigned Team: <strong className="text-emerald-400">{selectedApplicant.final_assigned_team || 'Not assigned yet'}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-400 uppercase text-[10px]">Online Links</h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedApplicant.github_url && (
                      <a href={selectedApplicant.github_url} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 hover:underline flex items-center gap-1">
                        GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedApplicant.linkedin_url && (
                      <a href={selectedApplicant.linkedin_url} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded bg-slate-800 text-blue-300 hover:underline flex items-center gap-1">
                        LinkedIn <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedApplicant.portfolio_url && (
                      <a href={selectedApplicant.portfolio_url} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded bg-slate-800 text-purple-300 hover:underline flex items-center gap-1">
                        Portfolio <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedApplicant.resume_url && (
                      <a href={selectedApplicant.resume_url} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 hover:underline flex items-center gap-1">
                        Resume <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-400 uppercase text-[10px]">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplicant.skills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-400 uppercase text-[10px]">Projects / Experience</h4>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedApplicant.experience}</p>
                </div>
              </div>
            </div>

            {/* Internal Admin Notes Thread */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs uppercase flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Internal Recruiter Notes ({selectedApplicant.admin_notes?.length || 0})
              </h4>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedApplicant.admin_notes?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No internal notes added yet.</p>
                ) : (
                  selectedApplicant.admin_notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
                        <span>{note.author}</span>
                        <span>{new Date(note.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-200">{note.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Type an internal review note..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
                >
                  ADD NOTE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACCEPT CONFIRMATION MODAL */}
      {showAcceptModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-emerald-500/50">
            <h3 className="text-xl font-bold text-white">Accept Applicant Confirmation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to accept <strong>{selectedApplicant.full_name}</strong> into NeuraMorphix?
            </p>
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs">
              This will update their status to <strong>Accepted</strong>, store acceptance metadata, and automatically trigger an acceptance notification email.
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAcceptModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAccept}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                CONFIRM ACCEPTANCE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DECLINE CONFIRMATION MODAL */}
      {showDeclineModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-rose-500/50">
            <h3 className="text-xl font-bold text-white">Decline Application Confirmation</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to decline the application for <strong>{selectedApplicant.full_name}</strong>?
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Select Decline Reason (Internal)</label>
              <select
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value as DeclineReasonCategory)}
                className="w-full p-2.5 rounded-xl glass-input text-xs bg-slate-900 text-white"
              >
                <option value="Role capacity reached">Role capacity reached</option>
                <option value="Skills mismatch">Skills mismatch</option>
                <option value="Application incomplete">Application incomplete</option>
                <option value="Selection criteria">Selection criteria</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Custom Note (Internal Only)</label>
              <textarea
                rows={2}
                placeholder="Optional internal note regarding decline decision..."
                value={declineNote}
                onChange={(e) => setDeclineNote(e.target.value)}
                className="w-full p-2 rounded-xl glass-input text-xs"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              Note: The applicant will receive a polite email notification. Internal notes will <strong>NOT</strong> be exposed to the applicant.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeclineModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDecline}
                className="px-6 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold"
              >
                DECLINE APPLICATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST INFO MODAL */}
      {showReqInfoModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-purple-500/50">
            <h3 className="text-xl font-bold text-white">Request Additional Information</h3>
            <p className="text-xs text-slate-300">
              Enter the specific information or code repository needed from <strong>{selectedApplicant.full_name}</strong>:
            </p>

            <textarea
              rows={3}
              value={reqInfoQuestion}
              onChange={(e) => setReqInfoQuestion(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReqInfoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRequestInfo}
                className="px-6 py-2 rounded-xl bg-purple-500 text-slate-950 text-xs font-bold"
              >
                SEND REQUEST EMAIL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST INTERVIEW MODAL */}
      {showInterviewModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-amber-500/50">
            <h3 className="text-xl font-bold text-white">Request Interview</h3>
            <p className="text-xs text-slate-300">
              Enter interview slot details / Google Meet link for <strong>{selectedApplicant.full_name}</strong>:
            </p>

            <textarea
              rows={3}
              value={interviewDetailsInput}
              onChange={(e) => setInterviewDetailsInput(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowInterviewModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRequestInterview}
                className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                SEND INTERVIEW INVITATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROLE ALLOCATION MODAL */}
      {showRoleAssignModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-cyan-500/50">
            <h3 className="text-xl font-bold text-white">Role Allocation / Final Team</h3>
            <p className="text-xs text-slate-300">
              Assign a final team independently of the applicant's preferences.
            </p>

            <div className="text-xs text-slate-400 space-y-1">
              <div>🥇 1st Choice: <span className="text-cyan-300">{selectedApplicant.first_preference}</span></div>
              <div>🥈 2nd Choice: <span className="text-amber-300">{selectedApplicant.second_preference}</span></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Select Final Team Assignment</label>
              <select
                value={assignedRoleChoice || selectedApplicant.first_preference}
                onChange={(e) => setAssignedRoleChoice(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-input text-xs bg-slate-900 text-white"
              >
                {roles.map((r) => (
                  <option key={r.role_id} value={r.role_name}>
                    {r.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRoleAssignModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignFinalTeam}
                className="px-6 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
              >
                SAVE ROLE ASSIGNMENT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL NOTIFICATIONS & TEMPLATE EDITOR */}
      {activeTab === 'email_settings' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Toggles */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              Automated Email Event Triggers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <label className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                <span>☑ Application received email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_application_received}
                  onChange={() => handleToggleEmailSetting('enable_application_received')}
                  className="w-4 h-4 rounded text-cyan-500"
                />
              </label>

              <label className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                <span>☑ Shortlist email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_shortlist}
                  onChange={() => handleToggleEmailSetting('enable_shortlist')}
                  className="w-4 h-4 rounded text-cyan-500"
                />
              </label>

              <label className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                <span>☑ Interview email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_interview}
                  onChange={() => handleToggleEmailSetting('enable_interview')}
                  className="w-4 h-4 rounded text-cyan-500"
                />
              </label>

              <label className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                <span>☑ Information request email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_info_requested}
                  onChange={() => handleToggleEmailSetting('enable_info_requested')}
                  className="w-4 h-4 rounded text-cyan-500"
                />
              </label>

              <label className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                <span>☑ Acceptance email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_acceptance}
                  onChange={() => handleToggleEmailSetting('enable_acceptance')}
                  className="w-4 h-4 rounded text-cyan-500"
                />
              </label>

              <label className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                <span>☑ Decline email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_decline}
                  onChange={() => handleToggleEmailSetting('enable_decline')}
                  className="w-4 h-4 rounded text-cyan-500"
                />
              </label>
            </div>
          </div>

          {/* Template Editor */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Email Template Editor</h3>
                <p className="text-xs text-slate-400">Customize the subject and content for automated notification emails.</p>
              </div>

              <select
                value={editingTemplateType}
                onChange={(e) => setEditingTemplateType(e.target.value as EmailType)}
                className="px-4 py-2 rounded-xl glass-input text-xs bg-slate-900 text-cyan-300 font-bold"
              >
                <option value="application_received">Application Received Email</option>
                <option value="shortlisted">Shortlisted Email</option>
                <option value="interview">Interview Invitation Email</option>
                <option value="info_requested">Information Request Email</option>
                <option value="accepted">Acceptance Email</option>
                <option value="declined">Decline Email</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Subject Line</label>
                <input
                  type="text"
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Body Template (Markdown/Text)</label>
                <textarea
                  rows={10}
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  className="w-full p-4 rounded-xl glass-input text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Available Placeholders: <code>{`{{name}}`}</code>, <code>{`{{application_id}}`}</code>, <code>{`{{first_preference}}`}</code>, <code>{`{{second_preference}}`}</code>, <code>{`{{final_assigned_team}}`}</code>, <code>{`{{requested_info_question}}`}</code>, <code>{`{{interview_details}}`}</code>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveEmailTemplate}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg"
                >
                  SAVE EMAIL TEMPLATE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RECRUITMENT CONFIGURATION & DEADLINE CONTROL */}
      {activeTab === 'config' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              Recruitment Period & Deadline Control
            </h3>
            <p className="text-xs text-slate-400 mt-1">Configure recruitment opening and closing dates or manually override window state.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Start Date</label>
              <input
                type="date"
                value={config.start_date}
                onChange={(e) => handleSaveConfig({ ...config, start_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">End Date (Deadline)</label>
              <input
                type="date"
                value={config.end_date}
                onChange={(e) => handleSaveConfig({ ...config, end_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-white uppercase">Manual Override Options</h4>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleSaveConfig({ ...config, is_manually_open: true })}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  config.is_manually_open === true
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                FORCE OPEN RECRUITMENT
              </button>

              <button
                type="button"
                onClick={() => handleSaveConfig({ ...config, is_manually_open: false })}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  config.is_manually_open === false
                    ? 'bg-rose-500 text-slate-950 ring-2 ring-rose-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                FORCE CLOSE RECRUITMENT
              </button>

              <button
                type="button"
                onClick={() => handleSaveConfig({ ...config, is_manually_open: null })}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  config.is_manually_open === null
                    ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                USE AUTOMATIC DATES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
