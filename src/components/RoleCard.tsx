import React from 'react';
import type { Role } from '../types/recruitment';
import { TeamIcon } from './TeamIcons';
import { Check, Star, Award, ArrowRight } from 'lucide-react';

interface RoleCardProps {
  role: Role;
  firstChoice: string | null;
  secondChoice: string | null;
  onSelectFirstChoice: (roleName: string) => void;
  onSelectSecondChoice: (roleName: string) => void;
  onProceedToForm?: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  firstChoice,
  secondChoice,
  onSelectFirstChoice,
  onSelectSecondChoice,
  onProceedToForm,
}) => {
  const isFirst = firstChoice === role.role_name;
  const isSecond = secondChoice === role.role_name;

  return (
    <div
      className={`relative group rounded-[28px] p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between border-[3px] ${
        isFirst
          ? 'bg-[#EBF5EE] border-[#527A58] shadow-[7px_7px_0px_#527A58] -translate-y-1'
          : isSecond
          ? 'bg-[#FFF8F0] border-[#D96B4C] shadow-[7px_7px_0px_#D96B4C] -translate-y-1'
          : 'bg-[#FFFDF7] border-[#5C3928] shadow-[5px_5px_0px_#5C3928] hover:-translate-y-1.5 hover:shadow-[7px_7px_0px_#5C3928]'
      }`}
    >
      {/* Top Preference Badges */}
      <div className="absolute -top-3.5 right-5 flex gap-2 z-10">
        {isFirst && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#527A58] text-white border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928] font-cartoon animate-bounce">
            <Award className="w-3.5 h-3.5" />
            🥇 1st Choice
          </span>
        )}
        {isSecond && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#D96B4C] text-white border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928] font-cartoon">
            <Star className="w-3.5 h-3.5 fill-white" />
            🥈 2nd Choice
          </span>
        )}
      </div>

      <div>
        {/* Header Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3.5 rounded-2xl border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] transition-transform group-hover:rotate-3 ${
              isFirst
                ? 'bg-[#527A58] text-white'
                : isSecond
                ? 'bg-[#D96B4C] text-white'
                : 'bg-[#FFF5DF] text-[#5C3928]'
            }`}
          >
            <TeamIcon name={role.icon_name} className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#3D2316] font-cartoon group-hover:text-[#527A58] transition-colors leading-snug">
              {role.role_name}
            </h3>
            <span className="text-xs font-black uppercase text-[#A96F45] tracking-wider font-cartoon">
              NeuraMorphix Squad
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#5C3928] mb-5 leading-relaxed font-medium">
          {role.description}
        </p>

        {/* Relevant Skills Chips */}
        <div className="mb-6">
          <h4 className="text-[10px] font-black text-[#A96F45] uppercase tracking-wider mb-2 font-cartoon">
            Relevant Stacks &amp; Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {role.skills.map((skill, idx) => (
              <span
                key={idx}
                className={`text-xs px-2.5 py-1 rounded-xl border font-bold ${
                  isFirst
                    ? 'bg-white border-[#527A58] text-[#527A58]'
                    : isSecond
                    ? 'bg-white border-[#D96B4C] text-[#D96B4C]'
                    : 'bg-[#FFF5DF] border-[#5C3928]/40 text-[#5C3928]'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Choice Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-4 border-t-2 border-dashed border-[#5C3928]/20">
        <button
          type="button"
          onClick={() => onSelectFirstChoice(role.role_name)}
          className={`px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-cartoon flex items-center justify-center gap-1.5 border-2 border-[#5C3928] transition-all cursor-pointer ${
            isFirst
              ? 'bg-[#527A58] text-white shadow-[3px_3px_0px_#5C3928] scale-102'
              : 'bg-[#FFFDF7] text-[#5C3928] hover:bg-[#527A58] hover:text-white shadow-[2px_2px_0px_#5C3928]'
          }`}
        >
          {isFirst ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Selected 1st
            </>
          ) : (
            'Select as 1st'
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectSecondChoice(role.role_name)}
          className={`px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-cartoon flex items-center justify-center gap-1.5 border-2 border-[#5C3928] transition-all cursor-pointer ${
            isSecond
              ? 'bg-[#D96B4C] text-white shadow-[3px_3px_0px_#5C3928] scale-102'
              : 'bg-[#FFFDF7] text-[#5C3928] hover:bg-[#D96B4C] hover:text-white shadow-[2px_2px_0px_#5C3928]'
          }`}
        >
          {isSecond ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Selected 2nd
            </>
          ) : (
            'Select as 2nd'
          )}
        </button>
      </div>

      {isFirst && onProceedToForm && (
        <button
          type="button"
          onClick={onProceedToForm}
          className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-[#527A58] hover:bg-[#436749] text-white text-xs font-black uppercase font-cartoon flex items-center justify-center gap-2 border-2 border-[#5C3928] shadow-[3px_3px_0px_#5C3928] hover:scale-[1.02] transition-all cursor-pointer animate-fadeIn"
        >
          <span>Proceed to 2. Personal Details</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      )}
    </div>
  );
};
