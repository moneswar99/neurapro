import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Who can participate in NeuraMorphix recruitment?',
      answer: 'Anyone passionate about building intelligence systems! Whether you are a developer, designer, AI researcher, hardware engineer, or product strategist — you are welcome here. Candidates apply individually and choose 1st & 2nd preference roles.',
    },
    {
      question: 'How does the selection process work in NeuraMorphix?',
      answer: 'First, submit your application with role preferences. Next, participate in Open Trial tasks (Photo ID Generator, Voice RAG, etc.). Top performers move through Alpha, Beta, and Charlie interview stages before final cohort residency placement.',
    },
    {
      question: 'Is there a registration or application fee?',
      answer: 'No! Participation and application in NeuraMorphix recruitment is completely free. Selected cohort members receive hardware workstations, cloud credits, and monthly stipends.',
    },
    {
      question: 'Can I apply to multiple teams simultaneously?',
      answer: 'Yes! Our Dual Preference System allows you to pick a Primary (1st Choice) and Secondary (2nd Choice) role across AI, Web, Mobile, IoT, UI/UX, Hardware, and Research teams.',
    },
    {
      question: 'What should I submit for the trial challenges?',
      answer: 'Submit your public GitHub repository link along with an unedited screen recording demonstrating your code running end to end. High signal, working code is prioritized above all.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t-2 border-[#5C3928]/20">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5DF] border-2 border-[#5C3928] text-[#5C3928] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#5C3928] font-cartoon">
          <HelpCircle className="w-3.5 h-3.5 text-[#527A58]" />
          <span>HELP &amp; FAQS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-[#3D2316] tracking-tight font-cartoon uppercase">
          Frequently Asked <span className="text-[#527A58]">Questions</span>
        </h2>
        <p className="text-[#5C3928] text-sm max-w-lg mx-auto font-medium">
          Everything you need to know about applying, selection stages, and cohort residency.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={faq.question}
            className="rounded-[24px] bg-[#FFF5DF] border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] overflow-hidden transition-all"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-[#3D2316] text-sm sm:text-base font-cartoon hover:text-[#527A58] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🐾</span>
                <span>{faq.question}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#527A58] shrink-0 transition-transform ${
                  openIdx === idx ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openIdx === idx && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-[#5C3928] leading-relaxed border-t-2 border-dashed border-[#5C3928]/20 pt-3 animate-fadeIn font-medium">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
