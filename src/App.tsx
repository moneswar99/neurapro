import { useState, useEffect } from 'react';
import { DatabaseService } from './services/db';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RoleSelectionSection } from './components/RoleSelectionSection';
import { ApplicationForm } from './components/ApplicationForm';
import { StatusTracker } from './components/StatusTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { SelectionRoadmap } from './components/SelectionRoadmap';
import { FAQSection } from './components/FAQSection';
import { WeBareBearsMascot } from './components/WeBareBearsMascot';
import { NeuraMorphixLogo } from './components/NeuraMorphixLogo';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Search,
  Award,
  Calendar,
  Lock,
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'apply' | 'track' | 'admin'>('home');

  // Automatically scroll to top whenever navigation tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentTab]);

  // Selected Preferences state
  const [firstChoice, setFirstChoice] = useState<string | null>(null);
  const [secondChoice, setSecondChoice] = useState<string | null>(null);
  const [trackedAppId, setTrackedAppId] = useState<string | null>(null);

  const roles = DatabaseService.getRoles();
  const windowStatus = DatabaseService.isRecruitmentOpen();

  const handleSelectFirstChoice = (roleName: string) => {
    if (secondChoice === roleName) {
      setSecondChoice(firstChoice);
    }
    setFirstChoice(roleName);
  };

  const handleSelectSecondChoice = (roleName: string) => {
    if (firstChoice === roleName) {
      setFirstChoice(secondChoice);
    }
    setSecondChoice(roleName);
  };

  const handleClearPreferences = () => {
    setFirstChoice(null);
    setSecondChoice(null);
  };

  const handleSelectTab = (tab: 'home' | 'apply' | 'track' | 'admin') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleProceedToForm = () => {
    setCurrentTab('apply');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleTrackStatusDirectly = (appId: string) => {
    setTrackedAppId(appId);
    setCurrentTab('track');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#3D2316] font-sans selection:bg-[#527A58] selection:text-white relative">
      {/* Navigation Header */}
      <Header currentTab={currentTab} onSelectTab={handleSelectTab} />

      {/* INTERACTIVE STEP NAVIGATION BAR — desktop only (mobile uses header tab bar) */}
      <div className="hidden md:block bg-[#FFF5DF]/95 border-b-2 border-[#5C3928] py-3 px-4 shadow-[0_4px_16px_rgba(92,57,40,0.06)] sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-6 text-xs font-black uppercase font-cartoon">
            <button
              type="button"
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-[#5C3928] transition-all cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-[#527A58] text-white shadow-[3px_3px_0px_#5C3928] scale-105'
                  : 'bg-[#FFFDF7] text-[#5C3928] hover:bg-[#FFF5DF]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#5C3928] text-[#FFFDF7] flex items-center justify-center text-[10px] font-bold">1</span>
              <span>1. Select Roles</span>
            </button>

            <span className="text-[#A96F45] font-black font-mono">→</span>

            <button
              type="button"
              onClick={() => {
                if (firstChoice) {
                  setCurrentTab('apply');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                } else {
                  const el = document.getElementById('roles-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-[#5C3928] transition-all cursor-pointer ${
                currentTab === 'apply'
                  ? 'bg-[#527A58] text-white shadow-[3px_3px_0px_#5C3928] scale-105'
                  : currentTab === 'home' && firstChoice
                  ? 'bg-[#527A58] text-white shadow-[3px_3px_0px_#5C3928] animate-step-blink'
                  : 'bg-[#FFFDF7] text-[#5C3928] hover:bg-[#FFF5DF]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentTab === 'home' && firstChoice ? 'bg-white text-[#527A58]' : 'bg-[#5C3928] text-[#FFFDF7]'}`}>2</span>
              <span>2. Personal Details</span>
            </button>

            <span className="text-[#A96F45] font-black font-mono">→</span>

            <button
              type="button"
              onClick={() => {
                setCurrentTab('track');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-[#5C3928] transition-all cursor-pointer ${
                currentTab === 'track'
                  ? 'bg-[#527A58] text-white shadow-[3px_3px_0px_#5C3928] scale-105'
                  : 'bg-[#FFFDF7] text-[#5C3928] hover:bg-[#FFF5DF]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#5C3928] text-[#FFFDF7] flex items-center justify-center text-[10px] font-bold">3</span>
              <span>3. Track Status</span>
            </button>
          </div>

          {/* Back / Forward Step Buttons */}
          <div className="flex items-center gap-2">
            {currentTab === 'apply' && (
              <button
                type="button"
                onClick={() => {
                  setCurrentTab('home');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                }}
                className="px-4 py-2 rounded-xl bg-[#FFFDF7] hover:bg-[#FFF5DF] text-[#5C3928] text-xs font-black uppercase font-cartoon border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                <span>Back to Role Selection</span>
              </button>
            )}
            {currentTab === 'home' && firstChoice && (
              <button
                type="button"
                onClick={() => {
                  setCurrentTab('apply');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                }}
                className="px-5 py-2 rounded-xl bg-[#527A58] hover:bg-[#436749] text-white text-xs font-black uppercase font-cartoon flex items-center gap-1.5 border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] transition-all cursor-pointer hover:scale-105 animate-step-blink"
              >
                <span>2. Personal Details</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}
            {currentTab === 'track' && (
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="px-4 py-2 rounded-xl bg-[#FFFDF7] hover:bg-[#FFF5DF] text-[#5C3928] text-xs font-black uppercase font-cartoon border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                <span>Back to Home</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RECRUITMENT CLOSED BANNER IF APPLICABLE */}
      {!windowStatus.isOpen && (
        <div className="bg-[#FFF8F0] border-b-2 border-[#D96B4C] py-3 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[#5C3928] text-xs font-black font-cartoon">
            <Lock className="w-4 h-4 text-[#D96B4C]" />
            <span>{windowStatus.message} Existing applicants can still track status. Admins can manually reopen.</span>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1">
        {/* HOME & TEAM EXPLORATION VIEW */}
        {currentTab === 'home' && (
          <div>
            {/* HERO SECTION — WE BARE BEARS ANIMATED CARTOON ENVIRONMENT */}
            <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-[#5C3928]/20 bg-gradient-to-b from-[#FFF5DF]/60 via-[#FFFDF7] to-[#FFFDF7] overflow-hidden">
              {/* Soft decorative clouds & ambient circles */}
              <div className="absolute top-8 left-10 w-36 h-14 bg-white/80 rounded-full blur-xs -z-10 pointer-events-none animate-bear-float"></div>
              <div className="absolute top-20 right-16 w-48 h-16 bg-white/70 rounded-full blur-xs -z-10 pointer-events-none animate-bear-float"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#527A58]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
              <div className="absolute -top-10 -right-10 w-80 h-80 bg-[#B9DDE2]/25 rounded-full blur-3xl -z-10 pointer-events-none"></div>

              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
                {/* Left Hero Content */}
                <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
                  {/* Comic Pill Badge */}
                  <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#FFF5DF] text-[#5C3928] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] font-cartoon">
                    <NeuraMorphixLogo size={24} />
                    <span className="font-black text-xs sm:text-sm uppercase tracking-wider">
                      NeuraMorphix Recruitment 2026
                    </span>
                  </div>

                  {/* High-Impact Cartoon Title */}
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#3D2316] font-cartoon leading-[108%] uppercase">
                    Shape the Future of <br />
                    <span className="text-[#527A58]">AI &amp; Intelligent</span> <br />
                    <span className="text-[#D96B4C]">Technologies</span>
                  </h1>

                  {/* Subtitle Description */}
                  <p className="text-[#5C3928] text-base sm:text-lg font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Join NeuraMorphix team pushing boundaries in Artificial Intelligence, Web/App Development, IoT, UI/UX, Hardware, Research, and Operations.
                  </p>

                  {/* Preserved Buttons with Tactile Cartoon Styling */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                    {windowStatus.isOpen ? (
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('roles-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#527A58] hover:bg-[#436749] text-white font-black text-sm uppercase tracking-wider font-cartoon flex items-center justify-center gap-2 border-[3px] border-[#5C3928] shadow-[5px_5px_0px_#5C3928] hover:scale-105 transition-all cursor-pointer"
                      >
                        <span>Select Role Preferences &amp; Apply</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCurrentTab('track')}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FFF5DF] text-[#5C3928] font-black text-sm uppercase tracking-wider font-cartoon flex items-center justify-center gap-2 border-2 border-[#5C3928] shadow-[4px_4px_0px_#5C3928]"
                      >
                        <Search className="w-4 h-4" />
                        <span>Track Existing Application Status</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setCurrentTab('track')}
                      className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#FFFDF7] hover:bg-[#FFF5DF] text-[#5C3928] font-black text-sm uppercase tracking-wider font-cartoon flex items-center justify-center gap-2 border-2 border-[#5C3928] shadow-[4px_4px_0px_#5C3928] transition-all cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-[#527A58]" />
                      <span>Check Application Status</span>
                    </button>
                  </div>

                  {/* Recruitment Info Highlights Pill Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 text-left">
                    <div className="p-4 rounded-3xl bg-[#FFF5DF] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
                      <Calendar className="w-5 h-5 text-[#527A58] mb-1" />
                      <h3 className="text-xs font-black text-[#3D2316] font-cartoon uppercase">Recruitment Date</h3>
                      <p className="text-[11px] text-[#5C3928] font-medium mt-0.5">05 Sep – 18 Sep 2026</p>
                    </div>

                    <div className="p-4 rounded-3xl bg-[#FFF5DF] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
                      <Award className="w-5 h-5 text-[#D96B4C] mb-1" />
                      <h3 className="text-xs font-black text-[#3D2316] font-cartoon uppercase">Dual Role Choice</h3>
                      <p className="text-[11px] text-[#5C3928] font-medium mt-0.5">1st &amp; 2nd Preference across 10 squads.</p>
                    </div>

                    <div className="p-4 rounded-3xl bg-[#FFF5DF] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928]">
                      <ShieldCheck className="w-5 h-5 text-[#527A58] mb-1" />
                      <h3 className="text-xs font-black text-[#3D2316] font-cartoon uppercase">Automated Emails</h3>
                      <p className="text-[11px] text-[#5C3928] font-medium mt-0.5">Automated status engine via Gmail.</p>
                    </div>
                  </div>
                </div>

                {/* Right: WE BARE BEARS HERO MASCOT ARTWORK */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                  <div className="p-6 sm:p-8 rounded-[40px] bg-gradient-to-b from-[#FFFDF7] to-[#FFF5DF] border-[3px] border-[#5C3928] shadow-[0_12px_32px_rgba(92,57,40,0.12),8px_8px_0px_#5C3928] relative">
                    <WeBareBearsMascot
                      pose="bear_stack"
                      size="hero"
                      showSpeechBubble={true}
                      speakerName="Bear Stack"
                      customQuote="Welcome to NeuraMorphix! Ready to build amazing tech together?"
                      speechPosition="top"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* LIVE WE BARE BEARS TICKER */}
            <div className="w-full overflow-hidden bg-[#527A58] text-white py-3.5 border-b-[3px] border-[#5C3928] font-cartoon font-black text-xs sm:text-sm tracking-wider uppercase select-none">
              <div className="flex animate-marquee whitespace-nowrap gap-8">
                <span className="flex items-center gap-2">GRIZZLY &bull; PANDA &bull; ICE BEAR</span>
                <span className="text-[#FFF5DF]/60">•</span>
                <span className="flex items-center gap-2 text-[#FFF5DF]">NEURAMORPHIX RECRUITMENT 2026 ACTIVE</span>
                <span className="text-[#FFF5DF]/60">•</span>
                <span className="flex items-center gap-2 text-[#B9DDE2]">DUAL PREFERENCE SQUAD SELECTION</span>
                <span className="text-[#FFF5DF]/60">•</span>
                <span className="flex items-center gap-2 text-white">05 SEP – 18 SEP 2026</span>
                <span className="text-[#FFF5DF]/60">•</span>
                <span className="flex items-center gap-2 text-[#FFF5DF]">AI/ML &bull; FULL STACK &bull; MOBILE &bull; IOT &bull; UI/UX</span>
                <span className="text-[#FFF5DF]/60">•</span>
                <span className="flex items-center gap-2">GRIZZLY &bull; PANDA &bull; ICE BEAR</span>
                <span className="text-[#FFF5DF]/60">•</span>
                <span className="flex items-center gap-2 text-[#FFF5DF]">NEURAMORPHIX RECRUITMENT 2026 ACTIVE</span>
                <span className="text-[#FFF5DF]/60">•</span>
              </div>
            </div>

            {/* ROLE SELECTION SECTION */}
            <RoleSelectionSection
              roles={roles}
              firstChoice={firstChoice}
              secondChoice={secondChoice}
              onSelectFirstChoice={handleSelectFirstChoice}
              onSelectSecondChoice={handleSelectSecondChoice}
              onClearPreferences={handleClearPreferences}
              onProceedToForm={handleProceedToForm}
            />

            {/* 6-PHASE SELECTION ROADMAP */}
            <SelectionRoadmap />

            {/* FAQ SECTION */}
            <FAQSection />

            {/* FINAL FULL-WIDTH WE BARE BEARS CTA BANNER */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 border-t-[3px] border-[#5C3928] bg-gradient-to-r from-[#527A58] via-[#29483A] to-[#527A58] text-white">
              <div className="max-w-5xl mx-auto rounded-[36px] bg-[#FFF5DF] border-[3px] border-[#5C3928] p-8 sm:p-12 shadow-[8px_8px_0px_#5C3928] flex flex-col md:flex-row items-center justify-between gap-8 text-[#3D2316]">
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#527A58] text-white text-xs font-black uppercase font-cartoon border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928]">
                    <NeuraMorphixLogo size={18} />
                    <span>Ready to Explore NeuraMorphix?</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black font-cartoon uppercase tracking-tight">
                    Join the NeuraMorphix Community!
                  </h3>
                  <p className="text-sm text-[#5C3928] font-medium max-w-lg">
                    Select your preferred squads, fill out your candidate dossier, and embark on this wonderful tech journey with Grizzly, Panda, and Ice Bear.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('roles-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-8 py-4 rounded-2xl bg-[#527A58] hover:bg-[#436749] text-white font-black text-sm uppercase tracking-wider font-cartoon border-[3px] border-[#5C3928] shadow-[4px_4px_0px_#5C3928] hover:scale-105 transition-all cursor-pointer"
                    >
                      CHOOSE SQUADS NOW →
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTab('track')}
                      className="px-6 py-4 rounded-2xl bg-[#FFFDF7] hover:bg-white text-[#5C3928] font-black text-sm uppercase tracking-wider font-cartoon border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] transition-all cursor-pointer"
                    >
                      TRACK YOUR STATUS
                    </button>
                  </div>
                </div>

                <div className="shrink-0 flex justify-center">
                  <WeBareBearsMascot pose="trio_celebration" size="sm" showSpeechBubble={false} />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* APPLY APPLICATION FORM VIEW */}
        {currentTab === 'apply' && (
          <div>
            {!firstChoice ? (
              <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
                <div className="p-8 rounded-[36px] bg-[#FFF5DF] border-[3px] border-[#5C3928] shadow-[8px_8px_0px_#5C3928] space-y-4">
                  <span className="px-4 py-1.5 rounded-full bg-[#D96B4C] text-white text-xs font-black uppercase font-cartoon border-2 border-[#5C3928]">
                    1st Choice Role Required
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#3D2316] font-cartoon uppercase">
                    Please Select Your Compulsory 1st Role Choice
                  </h2>
                  <p className="text-sm text-[#5C3928] font-medium">
                    Before filling out your personal details, you must select your 🥇 1st Choice team preference (2nd Choice is optional).
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('home')}
                    className="px-6 py-3 rounded-2xl bg-[#527A58] hover:bg-[#436749] text-white font-black text-xs uppercase tracking-wider font-cartoon border-2 border-[#5C3928] shadow-[4px_4px_0px_#5C3928] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[3]" />
                    Go to Interactive Role Selector
                  </button>
                </div>
              </div>
            ) : (
              <ApplicationForm
                firstChoice={firstChoice}
                secondChoice={secondChoice}
                roles={roles}
                onChangePreferences={() => setCurrentTab('home')}
                onApplicationSubmitted={(applicant) => {
                  setTrackedAppId(applicant.application_id);
                }}
                onTrackStatusDirectly={handleTrackStatusDirectly}
              />
            )}
          </div>
        )}

        {/* APPLICATION STATUS TRACKER VIEW */}
        {currentTab === 'track' && <StatusTracker initialAppId={trackedAppId} />}

        {/* ADMIN RECRUITMENT PORTAL VIEW */}
        {currentTab === 'admin' && <AdminDashboard onSelectTab={setCurrentTab} />}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
