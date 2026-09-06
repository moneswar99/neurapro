import React, { useState, useEffect } from 'react';
import type { Applicant, ApplicationStatus } from '../types/recruitment';
import { DatabaseService } from '../services/db';
import { WeBareBearsMascot } from './WeBareBearsMascot';
import {
  Search,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileQuestion,
  UserCheck,
  UserX,
  Award,
  Sparkles,
  Compass,
} from 'lucide-react';

interface StatusTrackerProps {
  initialAppId?: string | null;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({ initialAppId }) => {
  const [appIdInput, setAppIdInput] = useState(initialAppId || '');
  const [searchedApplicant, setSearchedApplicant] = useState<Applicant | null>(() => {
    return initialAppId ? DatabaseService.getApplicantById(initialAppId) || null : null;
  });
  const [notFound, setNotFound] = useState(false);

  // Response field for Information Requested status
  const [infoReplyInput, setInfoReplyInput] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replySuccessMsg, setReplySuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialAppId) {
      const found = DatabaseService.getApplicantById(initialAppId);
      if (found) {
        setAppIdInput(initialAppId);
        setSearchedApplicant(found);
        setNotFound(false);
      }
    }
  }, [initialAppId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    setReplySuccessMsg(null);

    const found = DatabaseService.getApplicantById(appIdInput.trim());
    if (found) {
      setSearchedApplicant(found);
    } else {
      setSearchedApplicant(null);
      setNotFound(true);
    }
  };

  const handleInfoReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedApplicant || !infoReplyInput.trim()) return;

    setIsSubmittingReply(true);

    const updated = DatabaseService.updateApplicant(searchedApplicant.id, {
      requested_info_response: infoReplyInput.trim(),
      status: 'Information Received',
    });

    if (updated) {
      setSearchedApplicant(updated);
      setReplySuccessMsg('Thank you! Your requested information has been submitted to the recruitment team.');
      setInfoReplyInput('');
    }

    setIsSubmittingReply(false);
  };

  // Timeline Stepper Order
  const TIMELINE_STEPS: { status: ApplicationStatus; label: string }[] = [
    { status: 'Application Received', label: 'Received' },
    { status: 'Under Review', label: 'Under Review' },
    { status: 'Shortlisted', label: 'Shortlisted' },
    { status: 'Interview', label: 'Interview' },
    { status: 'Accepted', label: 'Accepted' },
  ];

  const getStepIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'Application Received':
        return 0;
      case 'Under Review':
        return 1;
      case 'Shortlisted':
        return 2;
      case 'Interview':
        return 3;
      case 'Information Requested':
      case 'Information Received':
        return 1;
      case 'Accepted':
        return 4;
      case 'Declined':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = searchedApplicant ? getStepIndex(searchedApplicant.status) : 0;

  // Mascot dynamic pose & commentary
  const getMascotConfig = () => {
    if (notFound) {
      return {
        variant: 'panda' as const,
        speech: "Oops! We couldn't find that ID in our stack. Check your email confirmation or paste carefully!",
      };
    }
    if (!searchedApplicant) {
      return {
        variant: 'ice_bear' as const,
        speech: 'Ice Bear has your application indexed. Enter your ID above to inspect status.',
      };
    }
    switch (searchedApplicant.status) {
      case 'Accepted':
        return {
          variant: 'trio_celebration' as const,
          speech: `HUGE CONGRATULATIONS! You made the cut for ${searchedApplicant.final_assigned_team || searchedApplicant.first_preference}! Welcome to the stack!`,
        };
      case 'Interview':
        return {
          variant: 'panda' as const,
          speech: "You've got an interview invite! Check the details below and prepare your questions!",
        };
      case 'Shortlisted':
        return {
          variant: 'grizzly' as const,
          speech: 'Awesome work! You passed initial screening and reached the Shortlist round!',
        };
      case 'Under Review':
      case 'Application Received':
      case 'Information Received':
        return {
          variant: 'ice_bear' as const,
          speech: 'Ice Bear and the team are reviewing your portfolio. Stay tuned for updates.',
        };
      case 'Information Requested':
        return {
          variant: 'panda' as const,
          speech: 'The recruiters have a question for you! Fill in your response below to keep moving.',
        };
      case 'Declined':
        return {
          variant: 'ice_bear' as const,
          speech: 'Ice Bear respects the courage to create. Keep building and re-apply in our next cycle.',
        };
      default:
        return {
          variant: 'bear_stack' as const,
          speech: 'We Bare Bears are standing by with your recruitment progress.',
        };
    }
  };

  const mascotConfig = getMascotConfig();

  // Sample ID helper for quick test
  const sampleApplicant = DatabaseService.getApplicants()[0];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5DF] border-2 border-[#5C3928] text-[#5C3928] text-xs font-cartoon uppercase tracking-wider mb-4 shadow-[2px_2px_0px_#5C3928]">
          <Clock className="w-3.5 h-3.5 text-[#D96B4C]" />
          Real-Time Application Radar
        </div>
        <h2 className="text-3xl sm:text-4xl font-cartoon text-[#5C3928] tracking-tight">
          Track Your <span className="text-[#D96B4C]">Recruitment Journey</span>
        </h2>
        <p className="text-[#A96F45] text-sm mt-2 font-medium">
          Enter your Application ID to view your live evaluation status, interview updates, or respond to recruitment queries.
        </p>
      </div>

      {/* Mascot Speech Callout */}
      <div className="flex justify-center mb-8">
        <WeBareBearsMascot
          variant={mascotConfig.variant}
          size={mascotConfig.variant === 'trio_celebration' ? 'lg' : 'md'}
          speechBubble={mascotConfig.speech}
        />
      </div>

      {/* Search Card */}
      <div className="bear-card p-6 sm:p-8 bg-[#FFF5DF] border-2 border-[#5C3928] rounded-[28px] shadow-[4px_4px_0px_#5C3928] mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-cartoon text-[#5C3928] uppercase mb-2">
              Application ID <span className="text-[#D96B4C]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NM-2026-91823"
              value={appIdInput}
              onChange={(e) => setAppIdInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#5C3928] text-[#5C3928] placeholder-[#A96F45]/50 text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-[#527A58]/20 transition-all"
            />
          </div>

          <button
            type="submit"
            className="bear-btn-primary w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-cartoon tracking-wide bg-[#527A58] hover:bg-[#436548] text-white flex items-center justify-center gap-2 border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            CHECK STATUS
          </button>
        </form>

        {/* Quick Sample ID Hint */}
        {sampleApplicant && (
          <div className="mt-4 pt-4 border-t border-[#E5D7B7] flex flex-wrap items-center justify-between gap-2 text-xs text-[#A96F45]">
            <span>💡 Testing with existing demo candidate?</span>
            <button
              type="button"
              onClick={() => {
                setAppIdInput(sampleApplicant.application_id);
                setSearchedApplicant(sampleApplicant);
                setNotFound(false);
              }}
              className="text-[#527A58] hover:text-[#436548] font-bold font-mono underline decoration-dashed"
            >
              Try {sampleApplicant.application_id} ({sampleApplicant.full_name})
            </button>
          </div>
        )}
      </div>

      {notFound && (
        <div className="p-6 rounded-[24px] bg-[#FFF0ED] border-2 border-[#D96B4C] text-center space-y-2 shadow-[4px_4px_0px_#D96B4C] animate-fadeIn mb-8">
          <AlertCircle className="w-8 h-8 text-[#D96B4C] mx-auto mb-2" />
          <h3 className="text-lg font-cartoon text-[#5C3928]">Application Not Found</h3>
          <p className="text-sm text-[#A96F45] max-w-md mx-auto">
            No recruitment record matches Application ID <span className="font-mono font-bold text-[#5C3928]">{appIdInput}</span>. Please verify your Application ID from your email confirmation.
          </p>
        </div>
      )}

      {/* APPLICANT DETAILS & TIMELINE */}
      {searchedApplicant && (
        <div className="bear-card p-6 sm:p-8 bg-[#FFFDF7] border-2 border-[#5C3928] rounded-[28px] shadow-[6px_6px_0px_#5C3928] space-y-8 animate-fadeIn">
          {/* Top Bar with ID and Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#E5D7B7]">
            <div>
              <div className="text-xs text-[#A96F45] uppercase font-cartoon tracking-wide">Application ID</div>
              <h3 className="text-2xl font-cartoon font-bold text-[#5C3928]">{searchedApplicant.application_id}</h3>
              <p className="text-xs text-[#A96F45] mt-1 font-medium">
                Applicant: <strong className="text-[#5C3928]">{searchedApplicant.full_name}</strong> ({searchedApplicant.college})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-2 rounded-2xl text-xs font-cartoon tracking-wide flex items-center gap-2 border-2 shadow-[2px_2px_0px_#5C3928] ${
                  searchedApplicant.status === 'Accepted'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]'
                    : searchedApplicant.status === 'Declined'
                    ? 'bg-[#FFEBEE] text-[#C62828] border-[#C62828]'
                    : searchedApplicant.status === 'Interview'
                    ? 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]'
                    : searchedApplicant.status === 'Information Requested'
                    ? 'bg-[#F3E8FF] text-[#7E22CE] border-[#7E22CE]'
                    : 'bg-[#FFF5DF] text-[#5C3928] border-[#5C3928]'
                }`}
              >
                {searchedApplicant.status === 'Accepted' && <UserCheck className="w-4 h-4" />}
                {searchedApplicant.status === 'Declined' && <UserX className="w-4 h-4" />}
                {searchedApplicant.status === 'Information Requested' && <FileQuestion className="w-4 h-4" />}
                Status: {searchedApplicant.status}
              </span>
            </div>
          </div>

          {/* VISUAL PROGRESS TIMELINE */}
          <div>
            <h4 className="text-xs font-cartoon uppercase tracking-wider text-[#A96F45] mb-6 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#D96B4C]" />
              Visual Application Journey
            </h4>
            {searchedApplicant.status === 'Declined' ? (
              <div className="p-5 rounded-[20px] bg-[#FFEBEE] border-2 border-[#C62828] text-[#C62828] text-sm flex items-center gap-3 shadow-[3px_3px_0px_#C62828]">
                <UserX className="w-6 h-6 text-[#C62828] shrink-0" />
                <div>
                  <div className="font-cartoon text-base">Application Status: Declined</div>
                  <div className="text-xs text-[#8B0000] mt-0.5">
                    Thank you for applying for the NeuraMorphix 2026 cycle. Unfortunately, your application was not selected for this recruitment period.
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative py-4">
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#E5D7B7] -translate-y-1/2 rounded-full -z-0"></div>
                <div
                  className="absolute top-1/2 left-0 h-2 bg-[#527A58] -translate-y-1/2 rounded-full transition-all duration-500 -z-0"
                  style={{
                    width: `${(Math.max(0, currentStepIdx) / (TIMELINE_STEPS.length - 1)) * 100}%`,
                  }}
                ></div>

                <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
                  {TIMELINE_STEPS.map((stepItem, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-cartoon text-xs border-2 border-[#5C3928] transition-all shadow-[2px_2px_0px_#5C3928] ${
                            isCompleted
                              ? 'bg-[#527A58] text-white'
                              : isCurrent
                              ? 'bg-[#F59E0B] text-[#5C3928] ring-4 ring-[#F59E0B]/30'
                              : 'bg-white text-[#A96F45]'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] font-bold mt-2.5 ${
                            isCurrent
                              ? 'text-[#D96B4C] font-cartoon text-xs'
                              : isCompleted
                              ? 'text-[#5C3928]'
                              : 'text-[#A96F45]/70'
                          }`}
                        >
                          {stepItem.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ACCEPTED FINAL ASSIGNED TEAM BANNER */}
          {searchedApplicant.status === 'Accepted' && (
            <div className="p-6 rounded-[24px] bg-[#E8F5E9] border-2 border-[#2E7D32] shadow-[4px_4px_0px_#2E7D32] flex flex-col sm:flex-row items-center gap-4">
              <div className="p-4 rounded-2xl bg-white border-2 border-[#2E7D32] text-[#2E7D32] shadow-[2px_2px_0px_#2E7D32] shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xs font-cartoon text-[#2E7D32] uppercase tracking-wider">Accepted into Squad</div>
                <div className="text-2xl font-cartoon text-[#1B5E20]">
                  {searchedApplicant.final_assigned_team || searchedApplicant.first_preference}
                </div>
                <p className="text-xs text-[#2E7D32]/90 mt-1 font-medium">
                  🎉 Congratulations! Welcome aboard! Formal onboarding instructions have been dispatched to your email.
                </p>
              </div>
            </div>
          )}

          {/* INFORMATION REQUESTED ACTION BOX */}
          {(searchedApplicant.status === 'Information Requested' || searchedApplicant.requested_info_question) && (
            <div className="p-6 rounded-[24px] bg-[#F3E8FF] border-2 border-[#7E22CE] shadow-[4px_4px_0px_#7E22CE] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#7E22CE] text-[#7E22CE] shadow-[2px_2px_0px_#7E22CE]">
                  <FileQuestion className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-cartoon text-[#581C87]">Additional Information Requested by Recruiter</h4>
                  <p className="text-xs text-[#6B21A8] mt-0.5 font-medium">
                    {searchedApplicant.requested_info_question}
                  </p>
                </div>
              </div>

              {searchedApplicant.requested_info_response ? (
                <div className="p-4 rounded-2xl bg-white border-2 border-[#7E22CE] text-xs">
                  <span className="text-[#6B21A8] block font-cartoon mb-1">Your Submitted Response:</span>
                  <p className="text-[#5C3928] whitespace-pre-wrap">{searchedApplicant.requested_info_response}</p>
                  <span className="inline-block mt-2 text-[10px] text-[#2E7D32] font-cartoon uppercase">
                    ✓ Status: Information Received
                  </span>
                </div>
              ) : (
                <form onSubmit={handleInfoReplySubmit} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    placeholder="Type your response here (e.g. GitHub link, portfolio details, or clarifications)..."
                    value={infoReplyInput}
                    onChange={(e) => setInfoReplyInput(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-white border-2 border-[#5C3928] text-[#5C3928] placeholder-[#A96F45]/50 text-xs focus:outline-none focus:ring-4 focus:ring-[#7E22CE]/20"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReply || !infoReplyInput.trim()}
                    className="bear-btn-primary px-6 py-2.5 rounded-2xl bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-xs font-cartoon flex items-center gap-2 border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Requested Information
                  </button>
                </form>
              )}

              {replySuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-bold font-cartoon">
                  {replySuccessMsg}
                </div>
              )}
            </div>
          )}

          {/* INTERVIEW DETAILS BOX */}
          {searchedApplicant.interview_details && (
            <div className="p-5 rounded-[24px] bg-[#FEF3C7] border-2 border-[#D97706] text-xs space-y-1 shadow-[4px_4px_0px_#D97706]">
              <div className="font-cartoon text-sm flex items-center gap-2 text-[#B45309]">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                Interview Schedule & Instructions
              </div>
              <p className="text-[#78350F] whitespace-pre-wrap leading-relaxed font-medium">
                {searchedApplicant.interview_details}
              </p>
            </div>
          )}

          {/* Application Summary Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t-2 border-[#E5D7B7]">
            <div className="p-4 rounded-2xl bg-white border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928]">
              <span className="text-[#A96F45] block font-cartoon mb-1">🥇 1st Role Preference</span>
              <span className="text-sm font-cartoon text-[#5C3928]">{searchedApplicant.first_preference}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928]">
              <span className="text-[#A96F45] block font-cartoon mb-1">🥈 2nd Role Preference</span>
              <span className="text-sm font-cartoon text-[#D96B4C]">{searchedApplicant.second_preference}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
