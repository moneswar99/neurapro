import React, { useState } from 'react';
import { Calendar, Compass, Layers, Zap, CheckCircle2 } from 'lucide-react';

interface TimelineStep {
  phase: string;
  title: string;
  date: string;
  description: string;
  status: 'Completed' | 'Active' | 'Upcoming';
}

export const SelectionRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'rhythm'>('roadmap');

  const roadmapSteps: TimelineStep[] = [
    {
      phase: '01',
      title: 'Registration Begins',
      date: '05 September 2026',
      description: 'Applications open for all 10 teams. Choose 1st and 2nd preference roles.',
      status: 'Active',
    },
    {
      phase: '02',
      title: 'Open Trials & Builder Tasks',
      date: '08 September 2026',
      description: 'Skill-based challenges open to all applicants: Photo ID Generator, Voice RAG, and Edge Sensors.',
      status: 'Active',
    },
    {
      phase: '03',
      title: 'Alpha Shortlisting',
      date: '12 September 2026',
      description: 'First screening based on Open Trial task submissions, GitHub repositories, and portfolio work.',
      status: 'Upcoming',
    },
    {
      phase: '04',
      title: 'Beta Technical Review',
      date: '15 September 2026',
      description: 'Deep technical architecture review and code quality assessment by domain engineering leads.',
      status: 'Upcoming',
    },
    {
      phase: '05',
      title: 'Charlie Interviews',
      date: '17 September 2026',
      description: '1-on-1 interview and team-fit evaluation with lead recruiters and tech leads.',
      status: 'Upcoming',
    },
    {
      phase: '06',
      title: 'Final Cohort Residency',
      date: '18 September 2026',
      description: 'Final team placement confirmation, hardware kit dispatch, and cohort residency onboarding.',
      status: 'Upcoming',
    },
  ];

  const rhythmDays = [
    {
      day: 'Day 01',
      subtitle: 'Genesis Day',
      tagline: 'Where it all begins',
      desc: 'Cohort orientation, stack selection, team formation, and system architecture setup.',
    },
    {
      day: 'Day 02',
      subtitle: 'Day of Triangle',
      tagline: 'Problem. Solution. Market.',
      desc: 'Refining core value propositions, vector model engineering, and API integration.',
    },
    {
      day: 'Day 03',
      subtitle: 'Build Day',
      tagline: 'Heads down. Ship or ship.',
      desc: '24-hour continuous sprint. Zero fluff, high-speed fiber, live debugging, and deployment.',
    },
    {
      day: 'Day 04',
      subtitle: 'Launch Day',
      tagline: 'The world watches',
      desc: 'Project presentations, live demo evaluation, bounties award, and final team allocation.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-2 border-[#5C3928]/20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5DF] border-2 border-[#5C3928] text-[#5C3928] text-xs font-black uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#5C3928] font-cartoon">
            <Compass className="w-3.5 h-3.5 text-[#527A58]" />
            <span>SELECTION &amp; RESIDENCY JOURNEY 🌲</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#3D2316] tracking-tight font-cartoon uppercase">
            The Roadmap <span className="text-[#527A58]">at a Glance</span>
          </h2>
          <p className="text-[#5C3928] text-sm mt-2 max-w-xl font-medium">
            From initial registration and trial tasks to final team residency — every milestone engineered for clarity.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-[#FFFDF7] p-1.5 rounded-2xl border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-cartoon transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-[#527A58] text-white shadow-[2px_2px_0px_#5C3928] scale-105'
                : 'text-[#5C3928] hover:text-[#3D2316] hover:bg-[#FFF5DF]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Selection Roadmap</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rhythm')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-cartoon transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rhythm'
                ? 'bg-[#527A58] text-white shadow-[2px_2px_0px_#5C3928] scale-105'
                : 'text-[#5C3928] hover:text-[#3D2316] hover:bg-[#FFF5DF]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>4-Day Sprint Rhythm</span>
          </button>
        </div>
      </div>

      {activeTab === 'roadmap' ? (
        /* ROADMAP TIMELINE */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {roadmapSteps.map((step) => (
            <div
              key={step.phase}
              className={`p-6 sm:p-7 rounded-[30px] border-[3px] transition-all flex flex-col justify-between ${
                step.status === 'Active'
                  ? 'bg-[#FFFDF7] border-[#527A58] shadow-[6px_6px_0px_#527A58] hover:-translate-y-1'
                  : 'bg-[#FFF5DF] border-[#5C3928] shadow-[4px_4px_0px_#5C3928] hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#5C3928] font-cartoon">
                    Phase {step.phase}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase font-cartoon border-2 border-[#5C3928] ${
                      step.status === 'Active'
                        ? 'bg-[#527A58] text-white shadow-[1.5px_1.5px_0px_#5C3928]'
                        : 'bg-[#FFFDF7] text-[#5C3928]'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                <h3 className="text-lg font-black text-[#3D2316] font-cartoon mb-2">
                  {step.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#A96F45] font-bold mb-3 font-cartoon">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{step.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#5C3928] leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-dashed border-[#5C3928]/20 flex items-center gap-1.5 text-[11px] font-black text-[#527A58] font-cartoon uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Milestone</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 4-DAY SPRINT RHYTHM */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
          {rhythmDays.map((rhythm, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[30px] bg-[#FFF5DF] border-[3px] border-[#5C3928] shadow-[5px_5px_0px_#5C3928] flex flex-col justify-between hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="text-2xl font-black text-[#D96B4C] font-cartoon mb-1">
                  {rhythm.day}
                </div>
                <h3 className="text-lg font-black text-[#3D2316] font-cartoon mb-1">
                  {rhythm.subtitle}
                </h3>
                <div className="text-xs font-bold text-[#A96F45] uppercase tracking-wider mb-3 font-cartoon">
                  &ldquo;{rhythm.tagline}&rdquo;
                </div>
                <p className="text-xs text-[#5C3928] leading-relaxed font-medium">
                  {rhythm.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-dashed border-[#5C3928]/20 text-[11px] font-black text-[#527A58] font-cartoon uppercase">
                24h Sprint Cycle
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
