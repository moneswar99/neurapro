import React, { useState } from 'react';
import type { Role } from '../types/recruitment';
import { RoleCard } from './RoleCard';
import { WeBareBearsMascot } from './WeBareBearsMascot';
import { BEAR_QUOTES } from '../data/bearQuotes';
import { Sparkles, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Filter } from 'lucide-react';

interface RoleSelectionSectionProps {
  roles: Role[];
  firstChoice: string | null;
  secondChoice: string | null;
  onSelectFirstChoice: (roleName: string) => void;
  onSelectSecondChoice: (roleName: string) => void;
  onClearPreferences: () => void;
  onProceedToForm: () => void;
}

export const RoleSelectionSection: React.FC<RoleSelectionSectionProps> = ({
  roles,
  firstChoice,
  secondChoice,
  onSelectFirstChoice,
  onSelectSecondChoice,
  onClearPreferences,
  onProceedToForm,
}) => {
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleSelectFirst = (roleName: string) => {
    setWarningMsg(null);
    if (secondChoice === roleName) {
      setWarningMsg(`Swapped choices! "${roleName}" is now your 1st Preference.`);
    }
    onSelectFirstChoice(roleName);
  };

  const handleSelectSecond = (roleName: string) => {
    setWarningMsg(null);
    if (firstChoice === roleName) {
      setWarningMsg(`Swapped choices! "${roleName}" is now your 2nd Preference.`);
    }
    onSelectSecondChoice(roleName);
  };

  // Determine active bear quote based on 1st choice
  const activeQuoteData = firstChoice && BEAR_QUOTES[firstChoice]
    ? BEAR_QUOTES[firstChoice]
    : secondChoice && BEAR_QUOTES[secondChoice]
    ? BEAR_QUOTES[secondChoice]
    : BEAR_QUOTES.default;

  // Filter roles by category
  const filteredRoles = roles.filter((role) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Technical') {
      return ['AI & Machine Learning', 'Full Stack Web Development', 'Mobile App Development', 'IoT & Embedded Systems', 'Cloud & DevOps', 'Cybersecurity', 'Data Engineering & Analytics', 'Robotics & Automation'].includes(role.role_name);
    }
    if (selectedCategory === 'Creative') {
      return ['UI/UX & Product Design', 'Technical Writing & Documentation'].includes(role.role_name);
    }
    if (selectedCategory === 'Operations') {
      return ['Cloud & DevOps', 'Technical Writing & Documentation'].includes(role.role_name);
    }
    return true;
  });

  return (
    <section id="roles-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFF5DF] text-[#5C3928] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] font-cartoon">
          <Sparkles className="w-4 h-4 text-[#D96B4C] fill-[#D96B4C]" />
          <span className="font-black text-xs uppercase tracking-wider">
            INTERACTIVE SQUAD SELECTION
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#3D2316] font-cartoon uppercase">
          Choose Your <span className="text-[#527A58]">Squad Preferences</span>
        </h2>

        <p className="text-[#5C3928] text-base leading-relaxed font-medium">
          Selecting your <strong>1st Choice Role is compulsory</strong>. A <strong>2nd Choice Role is optional</strong>. Explore our 10 specialized squads below!
        </p>

        {/* Counter Indicator Widget */}
        <div className="pt-2 inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-[#FFF5DF] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
          <span className="text-xs font-black text-[#5C3928] font-cartoon uppercase">Squad Status:</span>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-black font-cartoon uppercase transition-all ${
                firstChoice
                  ? 'bg-[#527A58] text-white border border-[#5C3928] shadow-[1.5px_1.5px_0px_#5C3928]'
                  : 'bg-[#D96B4C] text-white border border-[#5C3928] shadow-[1.5px_1.5px_0px_#5C3928]'
              }`}
            >
              {firstChoice ? '🥇 1st Choice Selected' : '🥇 1st Choice Required (Compulsory)'}
            </span>
            {secondChoice && (
              <span className="px-3 py-1 rounded-xl text-xs font-black font-cartoon uppercase bg-[#F59E0B] text-[#3D2316] border border-[#5C3928] shadow-[1.5px_1.5px_0px_#5C3928]">
                🥈 2nd Choice Added (Optional)
              </span>
            )}
          </div>
        </div>

        {warningMsg && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF8F0] border-2 border-[#D96B4C] text-[#5C3928] text-xs font-bold animate-fadeIn shadow-[2px_2px_0px_#D96B4C]">
            <AlertCircle className="w-4 h-4 text-[#D96B4C] shrink-0" />
            {warningMsg}
          </div>
        )}
      </div>

      {/* Interactive Mascot Companion & Selected Preferences Summary Banner */}
      <div className="mb-10 p-6 sm:p-8 rounded-[32px] bg-[#FFF5DF] border-[3px] border-[#5C3928] shadow-[7px_7px_0px_#5C3928] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#527A58] font-cartoon">
              <CheckCircle2 className="w-4 h-4" />
              <span>YOUR CHOSEN SQUADS</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] flex-1">
                <span className="text-2xl">🥇</span>
                <div className="text-left min-w-0">
                  <div className="text-[10px] text-[#527A58] uppercase font-black font-cartoon">1st Choice (Compulsory) *</div>
                  <div className="text-sm font-black text-[#3D2316] font-cartoon truncate">
                    {firstChoice || <span className="text-[#D96B4C] italic font-normal">Select compulsory 1st role below...</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] flex-1">
                <span className="text-2xl">🥈</span>
                <div className="text-left min-w-0">
                  <div className="text-[10px] text-[#D96B4C] uppercase font-black font-cartoon">2nd Choice (Optional)</div>
                  <div className="text-sm font-black text-[#3D2316] font-cartoon truncate">
                    {secondChoice || <span className="text-[#A96F45] italic font-normal">Optional 2nd preference...</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              {(firstChoice || secondChoice) && (
                <button
                  type="button"
                  onClick={onClearPreferences}
                  className="px-4 py-2.5 rounded-xl text-xs font-black uppercase font-cartoon bg-[#FFFDF7] hover:bg-[#FFF5DF] text-[#5C3928] border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Clear Selection
                </button>
              )}

              <button
                type="button"
                disabled={!firstChoice}
                onClick={onProceedToForm}
                className={`px-7 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase font-cartoon flex items-center gap-2 border-[3px] border-[#5C3928] transition-all ${
                  firstChoice
                    ? 'bg-[#527A58] hover:bg-[#436749] text-white shadow-[4px_4px_0px_#5C3928] cursor-pointer hover:scale-105'
                    : 'bg-[#FFFDF7] text-[#A96F45] opacity-60 cursor-not-allowed'
                }`}
              >
                <span>Fill Candidate Dossier</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Interactive We Bare Bears Mascot Stage */}
          <div className="shrink-0 flex items-center justify-center">
            <WeBareBearsMascot
              pose={
                firstChoice
                  ? activeQuoteData.speaker === 'Grizzly'
                    ? 'grizzly'
                    : activeQuoteData.speaker === 'Panda'
                    ? 'panda'
                    : activeQuoteData.speaker === 'Ice Bear'
                    ? 'ice_bear'
                    : 'bear_stack'
                  : 'bear_stack'
              }
              size="sm"
              showSpeechBubble={true}
              speakerName={activeQuoteData.speaker}
              customQuote={activeQuoteData.quote}
              speechPosition="top"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-[#5C3928] uppercase font-cartoon">
          <Filter className="w-3.5 h-3.5" />
          <span>Squad Filters:</span>
        </div>
        {['All', 'Technical', 'Creative', 'Operations'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase font-cartoon border-2 border-[#5C3928] transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#527A58] text-white shadow-[2px_2px_0px_#5C3928] scale-105'
                : 'bg-[#FFFDF7] text-[#5C3928] hover:bg-[#FFF5DF]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of 10 Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <RoleCard
            key={role.role_id}
            role={role}
            firstChoice={firstChoice}
            secondChoice={secondChoice}
            onSelectFirstChoice={handleSelectFirst}
            onSelectSecondChoice={handleSelectSecond}
            onProceedToForm={onProceedToForm}
          />
        ))}
      </div>

      {/* ===== BOTTOM CTA — shown after selecting 1st choice ===== */}
      {firstChoice && (
        <div className="mt-14 animate-fadeIn">
          {/* Summary recap card */}
          <div className="max-w-2xl mx-auto p-8 rounded-[36px] bg-[#FFF5DF] border-[3px] border-[#5C3928] shadow-[8px_8px_0px_#5C3928] text-center space-y-6">
            <div className="flex justify-center">
              <span className="px-4 py-1.5 rounded-full bg-[#527A58] text-white text-xs font-black uppercase border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928] flex items-center gap-1.5 font-cartoon">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Squad Preferences Locked In!
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#3D2316] font-cartoon uppercase">
              Ready to Join the Bear Stack?
            </h3>

            {/* Chosen roles recap */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928]">
                <span className="text-xl">🥇</span>
                <div className="text-left">
                  <div className="text-[10px] text-[#527A58] font-black uppercase font-cartoon">1st Choice</div>
                  <div className="text-[#3D2316] font-black text-xs font-cartoon">{firstChoice}</div>
                </div>
              </div>
              {secondChoice ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928]">
                  <span className="text-xl">🥈</span>
                  <div className="text-left">
                    <div className="text-[10px] text-[#D96B4C] font-black uppercase font-cartoon">2nd Choice</div>
                    <div className="text-[#3D2316] font-black text-xs font-cartoon">{secondChoice}</div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border-2 border-dashed border-[#5C3928]/40 text-[#A96F45] text-xs font-bold">
                  No 2nd choice (optional)
                </div>
              )}
            </div>

            <p className="text-[#5C3928] text-xs max-w-md mx-auto font-medium">
              Click below to fill in your personal information, skills, and past builds to complete your NeuraMorphix 2026 application.
            </p>

            {/* Primary CTA button */}
            <button
              type="button"
              onClick={onProceedToForm}
              className="w-full sm:w-auto mx-auto px-10 py-4 rounded-2xl bg-[#527A58] hover:bg-[#436749] text-white font-black text-sm uppercase tracking-wider font-cartoon flex items-center justify-center gap-2 border-[3px] border-[#5C3928] shadow-[5px_5px_0px_#5C3928] hover:scale-105 transition-all cursor-pointer"
            >
              <span>2. Personal Details</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <div>
              <button
                type="button"
                onClick={onClearPreferences}
                className="text-xs text-[#A96F45] hover:text-[#5C3928] underline transition-colors cursor-pointer font-bold"
              >
                Reset selection and start over
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MOBILE STICKY BOTTOM BAR — appears after 1st choice selected ===== */}
      {firstChoice && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#FFF5DF] border-t-[3px] border-[#5C3928] px-4 py-3 shadow-[0_-4px_24px_rgba(92,57,40,0.15)]">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-[#527A58] font-black uppercase font-cartoon">Selected:</div>
              <div className="text-xs font-black text-[#3D2316] truncate font-cartoon">{firstChoice}</div>
              {secondChoice && (
                <div className="text-[10px] text-[#D96B4C] font-bold truncate font-cartoon">+ {secondChoice}</div>
              )}
            </div>
            <button
              type="button"
              onClick={onProceedToForm}
              className="shrink-0 px-5 py-3 rounded-2xl bg-[#527A58] text-white font-black text-xs uppercase tracking-wider font-cartoon flex items-center gap-1.5 border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] cursor-pointer transition-all active:scale-95"
            >
              <span>Apply</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom padding to avoid mobile sticky bar covering content */}
      {firstChoice && <div className="md:hidden h-20" />}
    </section>
  );
};
