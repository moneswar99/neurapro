import React, { useState, useRef, useEffect } from 'react';
import type { Applicant, Role } from '../types/recruitment';
import { DatabaseService } from '../services/db';
import { EmailService } from '../services/email';
import { BackendApiService } from '../services/api';
import { INDIAN_COLLEGES } from '../data/indianColleges';
import { WeBareBearsMascot } from './WeBareBearsMascot';
import { APPLICATION_STEP_TIPS } from '../data/bearQuotes';
import confetti from 'canvas-confetti';

import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Code,
  FileCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Search,
  Camera,
  XCircle,
  Sparkles,
  Award,
  Globe,
  Link2,
  FileText,
  Clock,
  Compass,
} from 'lucide-react';

interface ApplicationFormProps {
  firstChoice: string;
  secondChoice: string | null;
  roles: Role[];
  onChangePreferences: () => void;
  onApplicationSubmitted: (applicant: Applicant) => void;
  onTrackStatusDirectly?: (appId: string) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  firstChoice,
  secondChoice,
  roles,
  onChangePreferences,
  onApplicationSubmitted,
  onTrackStatusDirectly,
}) => {
  const [step, setStep] = useState<'details' | 'skills_experience' | 'review' | 'submitted'>('details');

  // =========================================================
  // FORM FIELDS
  // =========================================================
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('3rd Year');

  const [resumeUrl, setResumeUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // =========================================================
  // PHONE VALIDATION
  // =========================================================
  const phoneDigits = phone.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length === 10;
  const phoneHasInput = phone.trim().length > 0;

  // =========================================================
  // COLLEGE AUTOCOMPLETE
  // =========================================================
  const [collegeQuery, setCollegeQuery] = useState('');
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const collegeRef = useRef<HTMLDivElement>(null);

  const collegeSuggestions =
    collegeQuery.trim().length >= 2
      ? INDIAN_COLLEGES.filter((c) =>
          c.toLowerCase().includes(collegeQuery.toLowerCase())
        ).slice(0, 8)
      : [];

  const isCollegeVerified =
    INDIAN_COLLEGES.includes(college) && college.trim().length > 0;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (collegeRef.current && !collegeRef.current.contains(e.target as Node)) {
        setShowCollegeSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, []);

  // Ensure personal details and subsequent steps start strictly from the top of the viewport
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step]);

  const handleCollegeSelect = (collegeName: string) => {
    setCollege(collegeName);
    setCollegeQuery(collegeName);
    setShowCollegeSuggestions(false);
  };

  // =========================================================
  // SKILLS SELECTION
  // =========================================================
  const selectedRoleObj = roles.find((r) => r.role_name === firstChoice);
  const secondaryRoleObj = roles.find((r) => r.role_name === secondChoice);

  const suggestedSkills = Array.from(
    new Set([
      ...(selectedRoleObj?.skills || []),
      ...(secondaryRoleObj?.skills || []),
    ])
  );

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [experience, setExperience] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput('');
    }
  };

  // =========================================================
  // SUBMISSION STATUS
  // =========================================================
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [submittedApplicant, setSubmittedApplicant] = useState<Applicant | null>(null);

  // =========================================================
  // STEP 1 → STEP 2
  // =========================================================
  const handleNextFromDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!isPhoneValid) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!college.trim()) {
      setErrorMsg('Please enter or select your college name.');
      return;
    }
    if (!department.trim()) {
      setErrorMsg('Please enter your department or major.');
      return;
    }

    const windowCheck = DatabaseService.isRecruitmentOpen();
    if (!windowCheck.isOpen) {
      setErrorMsg(windowCheck.message);
      return;
    }

    setStep('skills_experience');
  };

  // =========================================================
  // STEP 2 → STEP 3
  // =========================================================
  const handleNextFromSkills = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selectedSkills.length === 0) {
      setErrorMsg('Please select or add at least one relevant skill.');
      return;
    }
    if (!experience.trim()) {
      setErrorMsg('Please provide a brief description of your previous projects or experience.');
      return;
    }

    setStep('review');
  };

  // =========================================================
  // SUBMIT APPLICATION
  // =========================================================
  const handleSubmitApplication = async () => {
    setErrorMsg(null);

    if (!confirmed) {
      setErrorMsg('You must check the confirmation box before submitting your application.');
      return;
    }

    const windowCheck = DatabaseService.isRecruitmentOpen();
    if (!windowCheck.isOpen) {
      setErrorMsg(windowCheck.message);
      return;
    }

    setIsSubmitting(true);
    setEmailStatus('sending');

    try {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const appId = `NM-2026-${randomNum}`;

      const newApplicant: Applicant = {
        id: `app-${Date.now()}`,
        application_id: appId,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college: college.trim(),
        department: department.trim(),
        year,
        skills: selectedSkills,
        experience: experience.trim(),
        first_preference: firstChoice,
        second_preference: secondChoice || 'None (Optional)',
        final_assigned_team: null,
        status: 'Application Received',
        resume_url: resumeUrl.trim(),
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        portfolio_url: portfolioUrl.trim(),
        admin_notes: [],
        decline_reason: null,
        decline_note: null,
        requested_info_question: null,
        requested_info_response: null,
        interview_details: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reviewed_at: null,
        accepted_at: null,
        declined_at: null,
      };

      // 1. Save locally
      DatabaseService.addApplicant(newApplicant);

      // 2. Sync to Spring Boot MySQL backend asynchronously
      BackendApiService.syncApplicant(newApplicant);

      // 3. Send email via Gmail SMTP
      const emailResult = await EmailService.sendEmail('application_received', newApplicant);

      if (emailResult.success) {
        setEmailStatus('sent');
      } else {
        setEmailStatus('failed');
        console.warn('Application saved, but email could not be sent:', emailResult.message);
      }

      // 4. Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#527A58', '#D96B4C', '#F59E0B', '#B9DDE2', '#5C3928'],
        });
      } catch (e) {
        console.log('Confetti triggered', e);
      }

      setSubmittedApplicant(newApplicant);
      setStep('submitted');
      onApplicationSubmitted(newApplicant);
    } catch (err) {
      console.error('Submission error:', err);
      setEmailStatus('failed');
      setErrorMsg('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTip = () => {
    switch (step) {
      case 'details':
        return APPLICATION_STEP_TIPS.details;
      case 'skills_experience':
        return APPLICATION_STEP_TIPS.skills;
      case 'review':
        return APPLICATION_STEP_TIPS.review;
      case 'submitted':
        return APPLICATION_STEP_TIPS.submitted;
      default:
        return APPLICATION_STEP_TIPS.details;
    }
  };

  const activeTip = getTip();

  return (
    <div id="application-form-top" className="max-w-4xl mx-auto pt-3 pb-12 px-4 sm:px-6">
      {/* ===================================================
          COMPACT STAGE HEADER & PROGRESS STRIP
      =================================================== */}
      <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-[#FFF5DF] border-2 border-[#5C3928] shadow-[4px_4px_0px_#5C3928] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#527A58] text-white text-xs font-black uppercase font-cartoon border border-[#5C3928] shadow-[1.5px_1.5px_0px_#5C3928]">
            <Sparkles className="w-3 h-3 fill-white" />
            <span>NeuraMorphix 2026</span>
          </div>

          <div className="text-xs font-black text-[#3D2316] font-cartoon flex items-center gap-1.5">
            <span className="text-[#527A58]">🥇 {firstChoice}</span>
            {secondChoice && secondChoice !== 'None (Optional)' && (
              <span className="text-[#D96B4C]"> • 🥈 {secondChoice}</span>
            )}
          </div>
        </div>

        {/* Step Progression Meter & Change Roles */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider font-cartoon">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all ${
                step === 'details'
                  ? 'bg-[#527A58] text-white border-[#5C3928] shadow-[2px_2px_0px_#5C3928]'
                  : 'bg-[#FFFDF7] text-[#5C3928] border-[#5C3928]/30'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#5C3928] text-[#FFFDF7] flex items-center justify-center text-[9px] font-bold">1</span>
              <span>1. Details</span>
            </div>

            <span className="text-[#A96F45] font-black font-mono">→</span>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all ${
                step === 'skills_experience'
                  ? 'bg-[#527A58] text-white border-[#5C3928] shadow-[2px_2px_0px_#5C3928]'
                  : 'bg-[#FFFDF7] text-[#5C3928] border-[#5C3928]/30'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#5C3928] text-[#FFFDF7] flex items-center justify-center text-[9px] font-bold">2</span>
              <span>2. Skills</span>
            </div>

            <span className="text-[#A96F45] font-black font-mono">→</span>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all ${
                step === 'review'
                  ? 'bg-[#527A58] text-white border-[#5C3928] shadow-[2px_2px_0px_#5C3928]'
                  : 'bg-[#FFFDF7] text-[#5C3928] border-[#5C3928]/30'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#5C3928] text-[#FFFDF7] flex items-center justify-center text-[9px] font-bold">3</span>
              <span>3. Review</span>
            </div>
          </div>

          {step !== 'submitted' && (
            <button
              type="button"
              onClick={onChangePreferences}
              className="text-[11px] text-[#5C3928] hover:text-[#3D2316] font-black uppercase font-cartoon flex items-center gap-1 bg-[#FFFDF7] px-3 py-1 rounded-xl border border-[#5C3928] hover:bg-[#FFECC7] shadow-[1.5px_1.5px_0px_#5C3928] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Change Roles</span>
            </button>
          )}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {errorMsg && (
        <div className="mb-4 p-4 rounded-2xl bg-[#FFF8F0] border-2 border-[#D96B4C] text-[#5C3928] text-xs sm:text-sm font-bold flex items-center gap-3 animate-fadeIn shadow-[4px_4px_0px_#D96B4C]">
          <AlertTriangle className="w-5 h-5 text-[#D96B4C] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ===================================================
          STEP 1: PERSONAL INFORMATION
      =================================================== */}
      {step === 'details' && (
        <form
          onSubmit={handleNextFromDetails}
          className="p-6 sm:p-8 rounded-[32px] bg-[#FFF5DF] border-[3px] border-[#5C3928] shadow-[8px_8px_0px_#5C3928] space-y-6 animate-fadeIn"
        >
          <div className="border-b-2 border-dashed border-[#5C3928]/30 pb-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#3D2316] font-cartoon uppercase flex items-center gap-2.5">
                <User className="w-6 h-6 text-[#527A58]" />
                <span>2. Personal Details</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#5C3928] font-medium mt-0.5">
                Enter your official contact and academic background details.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#527A58] text-white text-[10px] font-black uppercase border border-[#5C3928] shadow-[2px_2px_0px_#5C3928] font-cartoon">
                🥇 {firstChoice}
              </span>
              <div className="hidden lg:block bg-[#FFFDF7] px-3 py-1 rounded-xl border border-[#5C3928] text-[11px] font-bold text-[#5C3928] max-w-xs truncate">
                {activeTip.quote}
              </div>
              <WeBareBearsMascot
                pose="grizzly"
                size="xs"
                showSpeechBubble={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* FULL NAME */}
            <div>
              <label className="block text-xs font-black text-[#5C3928] uppercase tracking-wider mb-2 font-cartoon">
                Full Name <span className="text-[#D96B4C]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#5C3928] text-[#3D2316] text-sm outline-none focus:border-[#527A58] focus:shadow-[0_0_15px_rgba(82,122,88,0.2)] transition-all font-medium"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-black text-[#5C3928] uppercase tracking-wider mb-2 font-cartoon">
                Email Address <span className="text-[#D96B4C]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="e.g. aarav@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#5C3928] text-[#3D2316] text-sm outline-none focus:border-[#527A58] focus:shadow-[0_0_15px_rgba(82,122,88,0.2)] transition-all font-medium"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-xs font-black text-[#5C3928] uppercase tracking-wider mb-2 font-cartoon">
                Phone Number <span className="text-[#D96B4C]">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit number e.g. 9876543210"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))
                  }
                  className={`w-full pl-10 py-3 rounded-2xl bg-white border-2 text-[#3D2316] text-sm outline-none transition-all font-medium ${
                    phoneHasInput
                      ? isPhoneValid
                        ? 'pr-10 border-[#527A58]'
                        : 'pr-10 border-[#D96B4C]'
                      : 'pr-4 border-[#5C3928] focus:border-[#527A58]'
                  }`}
                />
                {phoneHasInput && (
                  <div className="absolute right-3 top-3.5">
                    {isPhoneValid ? (
                      <CheckCircle2 className="w-4 h-4 text-[#527A58]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#D96B4C]" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* COLLEGE AUTOCOMPLETE */}
            <div ref={collegeRef} className="relative">
              <label className="block text-xs font-black text-[#5C3928] uppercase tracking-wider mb-2 font-cartoon">
                College / Institution <span className="text-[#D96B4C]">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-3.5 z-10" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Type to search college..."
                  value={collegeQuery}
                  onFocus={() => setShowCollegeSuggestions(true)}
                  onChange={(e) => {
                    setCollegeQuery(e.target.value);
                    setCollege(e.target.value);
                    setShowCollegeSuggestions(true);
                  }}
                  className={`w-full pl-10 py-3 rounded-2xl bg-white border-2 text-[#3D2316] text-sm outline-none transition-all font-medium ${
                    college.trim().length > 0
                      ? isCollegeVerified
                        ? 'pr-10 border-[#527A58]'
                        : 'pr-4 border-[#5C3928] focus:border-[#527A58]'
                      : 'pr-4 border-[#5C3928] focus:border-[#527A58]'
                  }`}
                />
                {isCollegeVerified && (
                  <div className="absolute right-3 top-3.5">
                    <CheckCircle2 className="w-4 h-4 text-[#527A58]" />
                  </div>
                )}

                {showCollegeSuggestions && collegeSuggestions.length > 0 && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#FFFDF7] border-2 border-[#5C3928] rounded-2xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
                    {collegeSuggestions.map((name, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => handleCollegeSelect(name)}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#3D2316] hover:bg-[#527A58] hover:text-white flex items-center gap-2 border-b border-[#5C3928]/20 last:border-0 transition-colors cursor-pointer font-bold"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-[#A96F45] shrink-0" />
                        <span>{name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {college.trim().length > 0 && (
                <div className={`mt-1 text-[11px] font-bold ${isCollegeVerified ? 'text-[#527A58]' : 'text-[#A96F45]'}`}>
                  {isCollegeVerified ? '✓ College verified from Indian university list' : 'Custom college name registered'}
                </div>
              )}
            </div>

            {/* DEPARTMENT */}
            <div>
              <label className="block text-xs font-black text-[#5C3928] uppercase tracking-wider mb-2 font-cartoon">
                Department / Major <span className="text-[#D96B4C]">*</span>
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science / AI / Electronics"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#5C3928] text-[#3D2316] text-sm outline-none focus:border-[#527A58] font-medium"
                />
              </div>
            </div>

            {/* ACADEMIC YEAR */}
            <div>
              <label className="block text-xs font-black text-[#5C3928] uppercase tracking-wider mb-2 font-cartoon">
                Academic Year <span className="text-[#D96B4C]">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#5C3928] text-[#3D2316] text-sm outline-none focus:border-[#527A58] cursor-pointer font-bold"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate / PhD">Postgraduate / PhD</option>
                </select>
              </div>
            </div>
          </div>

          {/* ONLINE LINKS */}
          <div className="pt-4 border-t-2 border-dashed border-[#5C3928]/30 space-y-4">
            <h3 className="text-xs font-black uppercase text-[#5C3928] tracking-wider flex items-center gap-2 font-cartoon">
              <Globe className="w-4 h-4 text-[#D96B4C]" />
              <span>ONLINE PROFILES &amp; PORTFOLIO LINKS (OPTIONAL)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Code className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-3" />
                <input
                  type="url"
                  placeholder="GitHub Profile URL"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-[#5C3928] text-[#3D2316] text-xs outline-none focus:border-[#527A58]"
                />
              </div>
              <div className="relative">
                <Link2 className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-3" />
                <input
                  type="url"
                  placeholder="LinkedIn Profile URL"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-[#5C3928] text-[#3D2316] text-xs outline-none focus:border-[#527A58]"
                />
              </div>
              <div className="relative">
                <Globe className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-3" />
                <input
                  type="url"
                  placeholder="Portfolio / Personal Website URL"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-[#5C3928] text-[#3D2316] text-xs outline-none focus:border-[#527A58]"
                />
              </div>
              <div className="relative">
                <FileText className="w-4 h-4 text-[#A96F45] absolute left-3.5 top-3" />
                <input
                  type="url"
                  placeholder="Resume Drive Link (Google Drive / Dropbox)"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-[#5C3928] text-[#3D2316] text-xs outline-none focus:border-[#527A58]"
                />
              </div>
            </div>
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between items-center pt-6 border-t-2 border-[#5C3928]/30">
            <button
              type="button"
              onClick={onChangePreferences}
              className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider font-cartoon bg-[#FFFDF7] text-[#5C3928] hover:bg-[#FFECC7] border-2 border-[#5C3928] flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#5C3928]"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Back to Role Selection</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#527A58] hover:bg-[#436749] text-white font-black text-xs uppercase tracking-wider font-cartoon border-2 border-[#5C3928] shadow-[4px_4px_0px_#5C3928] flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <span>Continue to Bear Skills</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </form>
      )}

      {/* ===================================================
          STEP 2: BEAR SKILLS & EXPERIENCE
      =================================================== */}
      {step === 'skills_experience' && (
        <form
          onSubmit={handleNextFromSkills}
          className="p-6 sm:p-8 rounded-[36px] bg-[#FFF5DF] border-[3px] border-[#5C3928] shadow-[8px_8px_0px_#5C3928] space-y-6"
        >
          <div className="border-b-2 border-dashed border-[#5C3928]/30 pb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#3D2316] font-cartoon uppercase flex items-center gap-2">
                <Code className="w-6 h-6 text-[#527A58]" />
                Bear Stack Skills &amp; Experience
              </h2>
              <p className="text-xs text-[#5C3928] font-medium mt-0.5">
                Highlight your technical stacks and frameworks relevant to your selected roles.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#D96B4C] text-white text-[10px] font-black uppercase border border-[#5C3928] font-cartoon">
              {selectedSkills.length} SKILLS CHOSEN
            </span>
          </div>

          {/* SUGGESTED SKILLS CHIPS */}
          <div>
            <label className="block text-xs font-black text-[#5C3928] uppercase tracking-wider mb-3 font-cartoon">
              Select Relevant Skills <span className="text-[#D96B4C]">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedSkills.map((skill, idx) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 border-[#5C3928] transition-all cursor-pointer ${
                      active
                        ? 'bg-[#527A58] text-white shadow-[3px_3px_0px_#5C3928] scale-105'
                        : 'bg-white text-[#5C3928] hover:bg-[#FFECC7]'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>

            {/* CUSTOM SKILL INPUT */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Add custom skill (e.g. PyTorch, Figma, Docker, ROS, Next.js)"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSkill();
                  }
                }}
                className="px-4 py-2.5 rounded-2xl bg-white border-2 border-[#5C3928] text-[#3D2316] text-xs outline-none focus:border-[#527A58] flex-1 font-medium"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-5 py-2.5 rounded-2xl bg-[#D96B4C] text-white text-xs font-black uppercase font-cartoon tracking-wider border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928] hover:bg-[#c25a3d] cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* EXPERIENCE DESCRIPTION */}
          <div>
            <label className="block text-xs font-black text-[#5C3928] uppercase tracking-wider mb-2 font-cartoon">
              Previous Projects, Builds &amp; Contributions <span className="text-[#D96B4C]">*</span>
            </label>
            <textarea
              required
              rows={5}
              placeholder="Describe your previous coding projects, team experiences, code repositories, design portfolios, or research builds..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white border-2 border-[#5C3928] text-[#3D2316] text-sm outline-none focus:border-[#527A58] leading-relaxed font-medium"
            />
          </div>

          {/* NAVIGATION */}
          <div className="flex justify-between items-center pt-6 border-t-2 border-[#5C3928]/30">
            <button
              type="button"
              onClick={() => setStep('details')}
              className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider font-cartoon bg-[#FFFDF7] text-[#5C3928] hover:bg-[#FFECC7] border-2 border-[#5C3928] flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#5C3928]"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Back to Identity</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#527A58] hover:bg-[#436749] text-white font-black text-xs uppercase tracking-wider font-cartoon border-2 border-[#5C3928] shadow-[4px_4px_0px_#5C3928] flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <span>Proceed to Review</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </form>
      )}

      {/* ===================================================
          STEP 3: REVIEW DOSSIER
      =================================================== */}
      {step === 'review' && (
        <div className="p-6 sm:p-8 rounded-[36px] bg-[#FFF5DF] border-[3px] border-[#5C3928] shadow-[8px_8px_0px_#5C3928] space-y-8 animate-fadeIn">
          <div className="border-b-2 border-dashed border-[#5C3928]/30 pb-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#527A58] text-white text-xs font-black uppercase font-cartoon border border-[#5C3928] mb-2 shadow-[2px_2px_0px_#5C3928]">
              <FileCheck className="w-3.5 h-3.5" />
              FINAL VERIFICATION
            </span>
            <h2 className="text-3xl font-black text-[#3D2316] font-cartoon uppercase">
              REVIEW YOUR APPLICATION DOSSIER
            </h2>
            <p className="text-[#5C3928] text-xs mt-1 font-medium">
              Verify your information before submitting into the NeuraMorphix 2026 queue!
            </p>
          </div>

          {/* ROLE PREFERENCES RECAP */}
          <div className="p-5 rounded-2xl bg-white border-2 border-[#5C3928] space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-[#5C3928] font-cartoon flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D96B4C]" />
              <span>SELECTED DOMAINS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#EBF5EE] border-2 border-[#527A58]">
                <div className="text-[10px] text-[#527A58] font-black uppercase font-cartoon">🥇 1st Preference Role</div>
                <div className="text-base font-black text-[#3D2316] font-cartoon">{firstChoice}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFFDF7] border-2 border-[#D96B4C]">
                <div className="text-[10px] text-[#D96B4C] font-black uppercase font-cartoon">🥈 2nd Preference Role</div>
                <div className="text-base font-black text-[#3D2316] font-cartoon">{secondChoice || 'None selected (Optional)'}</div>
              </div>
            </div>
          </div>

          {/* PERSONAL INFORMATION RECAP */}
          <div className="p-5 rounded-2xl bg-white border-2 border-[#5C3928] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#5C3928] font-cartoon flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>CANDIDATE INFORMATION</span>
              </span>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs text-[#D96B4C] hover:underline font-black font-cartoon cursor-pointer"
              >
                Edit Details
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#3D2316]">
              <div><span className="text-[#A96F45] block font-bold font-cartoon">Name:</span> <span className="font-bold">{fullName}</span></div>
              <div><span className="text-[#A96F45] block font-bold font-cartoon">Email:</span> <span className="font-bold">{email}</span></div>
              <div><span className="text-[#A96F45] block font-bold font-cartoon">Phone:</span> <span className="font-bold">{phone}</span></div>
              <div><span className="text-[#A96F45] block font-bold font-cartoon">College:</span> <span className="font-bold">{college}</span></div>
              <div><span className="text-[#A96F45] block font-bold font-cartoon">Department:</span> <span className="font-bold">{department}</span></div>
              <div><span className="text-[#A96F45] block font-bold font-cartoon">Academic Year:</span> <span className="font-bold">{year}</span></div>
            </div>
          </div>

          {/* SKILLS RECAP */}
          <div className="p-5 rounded-2xl bg-white border-2 border-[#5C3928] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#5C3928] font-cartoon flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>BEAR STACK SKILLS &amp; EXPERIENCE</span>
              </span>
              <button
                type="button"
                onClick={() => setStep('skills_experience')}
                className="text-xs text-[#D96B4C] hover:underline font-black font-cartoon cursor-pointer"
              >
                Edit Skills
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedSkills.map((sk, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-[#FFF5DF] text-[#5C3928] text-xs font-bold border border-[#5C3928]">
                  {sk}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#5C3928] bg-[#FFFDF7] p-3 rounded-xl border border-[#5C3928]/30 leading-relaxed font-medium">
              {experience}
            </p>
          </div>

          {/* CONFIRMATION CHECKBOX */}
          <div className="p-4 rounded-2xl bg-white border-2 border-[#5C3928] flex items-start gap-3">
            <input
              type="checkbox"
              id="confirm-check"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#527A58] focus:ring-[#527A58] cursor-pointer"
            />
            <label htmlFor="confirm-check" className="text-xs text-[#5C3928] leading-relaxed cursor-pointer font-bold">
              I confirm that the information provided is accurate and I understand that my role preferences are subject to the NeuraMorphix selection process.
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-between items-center pt-6 border-t-2 border-[#5C3928]/30">
            <button
              type="button"
              onClick={() => setStep('skills_experience')}
              className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider font-cartoon bg-[#FFFDF7] text-[#5C3928] hover:bg-[#FFECC7] border-2 border-[#5C3928] flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#5C3928]"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={!confirmed || isSubmitting}
              onClick={handleSubmitApplication}
              className={`px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-wider font-cartoon border-2 border-[#5C3928] flex items-center gap-2 transition-all ${
                confirmed && !isSubmitting
                  ? 'bg-[#527A58] hover:bg-[#436749] text-white shadow-[5px_5px_0px_#5C3928] cursor-pointer hover:scale-105'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              {isSubmitting ? (
                'Transmitting Application...'
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>SUBMIT APPLICATION</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          STEP 4: SUBMITTED CONFIRMATION SCREEN
      =================================================== */}
      {step === 'submitted' && submittedApplicant && (
        <div className="p-8 sm:p-10 rounded-[36px] bg-[#FFF5DF] border-[3px] border-[#527A58] shadow-[8px_8px_0px_#5C3928] text-center space-y-6 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#527A58] text-white text-xs font-black uppercase font-cartoon border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
            <CheckCircle className="w-4 h-4" />
            <span>APPLICATION REGISTERED SUCCESSFULLY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#3D2316] font-cartoon uppercase">
            WELCOME TO NEURAMORPHIX 2026!
          </h2>

          <p className="text-[#5C3928] text-sm max-w-md mx-auto font-medium">
            Grizzly, Panda, and Ice Bear have logged your dossier into the recruitment database.
          </p>

          <div className="max-w-md mx-auto p-5 rounded-2xl bg-white border-2 border-[#5C3928] space-y-2 shadow-[4px_4px_0px_#5C3928]">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#5C3928] font-cartoon">
              YOUR OFFICIAL APPLICATION NUMBER:
            </div>
            <div className="text-2xl font-black text-[#D96B4C] font-mono tracking-widest">
              {submittedApplicant.application_id}
            </div>
            <div className="text-xs text-[#5C3928]">
              Registered Name: <strong className="text-[#3D2316]">{submittedApplicant.full_name}</strong>
            </div>
            <div className="pt-2 text-xs text-[#A96F45] font-bold flex items-center justify-center gap-1.5">
              <Camera className="w-4 h-4 text-[#D96B4C]" />
              <span>Note: Remember your application ID or take a screenshot</span>
            </div>
          </div>

          {/* Email Status Indicator */}
          <div className="flex justify-center pt-2">
            {emailStatus === 'sent' && (
              <span className="px-5 py-2 rounded-2xl bg-[#EBF5EE] text-[#527A58] border-2 border-[#527A58] text-xs font-black uppercase font-cartoon flex items-center gap-2 shadow-sm">
                <CheckCircle className="w-4 h-4" />
                Confirmation Email Sent to {submittedApplicant.email}
              </span>
            )}
            {emailStatus === 'failed' && (
              <span className="px-5 py-2 rounded-2xl bg-[#FFF8F0] text-[#D96B4C] border-2 border-[#D96B4C] text-xs font-black uppercase font-cartoon flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Application Saved — Email Notification Queued
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {onTrackStatusDirectly && (
              <button
                type="button"
                onClick={() => onTrackStatusDirectly(submittedApplicant.application_id)}
                className="px-8 py-3.5 rounded-2xl bg-[#527A58] hover:bg-[#436749] text-white font-black text-xs uppercase tracking-wider font-cartoon border-2 border-[#5C3928] shadow-[4px_4px_0px_#5C3928] cursor-pointer flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Track Application Status →</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setStep('details');
                setSubmittedApplicant(null);
                setConfirmed(false);
                setEmailStatus('idle');
                setFullName('');
                setEmail('');
                setPhone('');
                setCollege('');
                setCollegeQuery('');
                setDepartment('');
                setYear('3rd Year');
                setResumeUrl('');
                setGithubUrl('');
                setLinkedinUrl('');
                setPortfolioUrl('');
                setSelectedSkills([]);
                setCustomSkillInput('');
                setExperience('');
                setErrorMsg(null);
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#FFFDF7] hover:bg-white text-[#5C3928] font-black text-xs uppercase tracking-wider font-cartoon border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] transition-all cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};