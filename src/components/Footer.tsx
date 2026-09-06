import React from 'react';
import { NeuraMorphixLogo } from './NeuraMorphixLogo';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFF5DF] border-t-[3px] border-[#5C3928] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <NeuraMorphixLogo size={32} />
            <span className="text-lg font-black tracking-wider text-[#3D2316] font-cartoon uppercase">NEURAMORPHIX</span>
          </div>
          <p className="text-xs text-[#5C3928] leading-relaxed font-medium">
            Building the next generation of artificial intelligence, intelligent systems, hardware integration, and full-stack software products with Grizzly, Panda, and Ice Bear!
          </p>
        </div>

        <div>
          <h4 className="text-xs font-black text-[#3D2316] uppercase tracking-wider mb-3 font-cartoon">Recruitment Period</h4>
          <ul className="space-y-2 text-xs text-[#5C3928] font-medium">
            <li>Opening Date: <strong className="text-[#527A58] font-bold">05 September 2026</strong></li>
            <li>Closing Deadline: <strong className="text-[#D96B4C] font-bold">18 September 2026</strong></li>
            <li>Cycle: <strong className="text-[#3D2316] font-bold">Annual Team Recruitment 2026</strong></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black text-[#3D2316] uppercase tracking-wider mb-3 font-cartoon">Contact &amp; Support</h4>
          <ul className="space-y-2 text-xs text-[#5C3928] font-medium">
            <li>Email: <a href="mailto:recruitment@neuramorphix.org" className="text-[#527A58] hover:underline font-bold">recruitment@neuramorphix.org</a></li>
            <li>Web: <span className="text-[#3D2316] font-bold">neuramorphix.org</span></li>
            <li>Location: <span className="text-[#3D2316]">Innovation Hub &amp; Forest Lab</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black text-[#3D2316] uppercase tracking-wider mb-3 font-cartoon">System Features</h4>
          <div className="flex flex-wrap gap-1.5 text-[11px] text-[#5C3928]">
            <span className="px-2.5 py-1 rounded-xl bg-[#FFFDF7] border-2 border-[#5C3928] font-bold shadow-[1.5px_1.5px_0px_#5C3928]">Role Preference Engine</span>
            <span className="px-2.5 py-1 rounded-xl bg-[#FFFDF7] border-2 border-[#5C3928] font-bold shadow-[1.5px_1.5px_0px_#5C3928]">Auto Email Dispatch</span>
            <span className="px-2.5 py-1 rounded-xl bg-[#FFFDF7] border-2 border-[#5C3928] font-bold shadow-[1.5px_1.5px_0px_#5C3928]">Recruitment Platform</span>
            <span className="px-2.5 py-1 rounded-xl bg-[#FFFDF7] border-2 border-[#5C3928] font-bold shadow-[1.5px_1.5px_0px_#5C3928]">Status Progress Stepper</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t-2 border-dashed border-[#5C3928]/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A96F45] font-cartoon">
        <div className="flex items-center gap-1">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-[#D96B4C] fill-[#D96B4C]" />
          <span>by the We Bare Bears &amp; NeuraMorphix Community</span>
        </div>
        <div className="mt-2 sm:mt-0 font-bold">© 2026 NeuraMorphix. All rights reserved.</div>
      </div>
    </footer>
  );
};
