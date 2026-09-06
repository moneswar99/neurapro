import React from 'react';

export type BearPose = 'bear_stack' | 'trio_celebration' | 'grizzly' | 'panda' | 'ice_bear';

interface WeBareBearsMascotProps {
  pose?: BearPose;
  variant?: BearPose;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showSpeechBubble?: boolean;
  speechBubble?: string;
  customQuote?: string;
  speakerName?: string;
  speechPosition?: 'top' | 'bottom';
  className?: string;
}

export const WeBareBearsMascot: React.FC<WeBareBearsMascotProps> = ({
  pose,
  variant,
  size = 'md',
  showSpeechBubble,
  speechBubble,
  customQuote,
  speakerName,
  speechPosition = 'top',
  className = '',
}) => {
  const activePose: BearPose = variant || pose || 'bear_stack';
  const effectiveQuote = speechBubble || customQuote;
  const hasBubble = showSpeechBubble !== undefined ? showSpeechBubble : Boolean(effectiveQuote);

  const effectiveSpeaker =
    speakerName ||
    (activePose === 'ice_bear'
      ? 'Ice Bear'
      : activePose === 'panda'
      ? 'Panda'
      : activePose === 'grizzly'
      ? 'Grizzly'
      : activePose === 'trio_celebration'
      ? 'We Bare Bears'
      : 'Bear Stack');

  const getDims = () => {
    switch (size) {
      case 'xs':
        return { width: 75, height: 85 };
      case 'sm':
        return { width: 140, height: 160 };
      case 'md':
        return { width: 220, height: 260 };
      case 'lg':
        return { width: 290, height: 340 };
      case 'hero':
        return { width: 340, height: 400 };
      default:
        return { width: 220, height: 260 };
    }
  };

  const { width, height } = getDims();

  const getSpeakerColor = () => {
    switch (effectiveSpeaker) {
      case 'Grizzly':
        return 'bg-[#A96F45] text-white';
      case 'Panda':
        return 'bg-[#2B2D42] text-white';
      case 'Ice Bear':
        return 'bg-[#B9DDE2] text-[#29483A]';
      default:
        return 'bg-[#527A58] text-white';
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Dynamic Speech Bubble — Top */}
      {hasBubble && effectiveQuote && speechPosition === 'top' && (
        <div className="mb-3 max-w-xs sm:max-w-sm px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border-[3px] border-[#5C3928] shadow-[4px_4px_0px_#5C3928] text-center relative z-20 animate-bear-float">
          {effectiveSpeaker && (
            <span className={`inline-block px-2 py-0.5 mb-1 rounded-md text-[10px] font-black uppercase tracking-wider ${getSpeakerColor()}`}>
              {effectiveSpeaker}
            </span>
          )}
          <p className="text-xs sm:text-sm font-black text-[#3D2316] font-cartoon leading-snug">
            &ldquo;{effectiveQuote}&rdquo;
          </p>
          {/* Arrow pointing down */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#5C3928]" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#FFFDF7]" />
        </div>
      )}

      {/* Main SVG Mascot */}
      <div className="relative animate-bear-float flex items-center justify-center">
        {activePose === 'bear_stack' && (
          <svg
            width={width}
            height={height}
            viewBox="0 0 320 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-md"
          >
            {/* Soft Shadow Ground */}
            <ellipse cx="160" cy="365" rx="120" ry="14" fill="#5C3928" fillOpacity="0.15" />

            {/* Mossy Green Grassy Base */}
            <path
              d="M30 365 C80 345, 240 345, 290 365 C260 375, 60 375, 30 365 Z"
              fill="#527A58"
              stroke="#5C3928"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Small Daisy on Grass */}
            <circle cx="65" cy="358" r="4" fill="#F59E0B" stroke="#5C3928" strokeWidth="2" />
            <circle cx="255" cy="358" r="4" fill="#FFFDF7" stroke="#5C3928" strokeWidth="2" />

            {/* ===================================================
                1. ICE BEAR (BOTTOM BASE)
            =================================================== */}
            <g id="ice-bear-base">
              {/* Polar Body */}
              <rect
                x="65"
                y="245"
                width="190"
                height="110"
                rx="45"
                fill="#FFFFFF"
                stroke="#5C3928"
                strokeWidth="5"
              />
              {/* Back Soft Shading */}
              <path
                d="M75 320 C100 350, 220 350, 245 320"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Ears */}
              <circle cx="85" cy="245" r="14" fill="#FFFFFF" stroke="#5C3928" strokeWidth="5" />
              <circle cx="85" cy="245" r="7" fill="#E2E8F0" />
              <circle cx="235" cy="245" r="14" fill="#FFFFFF" stroke="#5C3928" strokeWidth="5" />
              <circle cx="235" cy="245" r="7" fill="#E2E8F0" />

              {/* Polar Paws */}
              <ellipse cx="95" cy="350" rx="18" ry="12" fill="#FFFFFF" stroke="#5C3928" strokeWidth="5" />
              <ellipse cx="225" cy="350" rx="18" ry="12" fill="#FFFFFF" stroke="#5C3928" strokeWidth="5" />
              {/* Claws */}
              <path d="M88 358 L88 354 M95 359 L95 354 M102 358 L102 354" stroke="#5C3928" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M218 358 L218 354 M225 359 L225 354 M232 358 L232 354" stroke="#5C3928" strokeWidth="2.5" strokeLinecap="round" />

              {/* Face Details — Stoic & Calm */}
              <ellipse cx="140" cy="275" rx="4" ry="5.5" fill="#2B2D42" className="animate-bear-blink" />
              <ellipse cx="180" cy="275" rx="4" ry="5.5" fill="#2B2D42" className="animate-bear-blink" />

              {/* Snout & Nose */}
              <ellipse cx="160" cy="286" rx="14" ry="10" fill="#F8FAFC" stroke="#5C3928" strokeWidth="3" />
              <ellipse cx="160" cy="283" rx="7" ry="5" fill="#2B2D42" />
              {/* Calm Stoic Mouth Line */}
              <path d="M156 290 L164 290" stroke="#5C3928" strokeWidth="3" strokeLinecap="round" />

              {/* Soft Ice Blue Tech Earphone / Badge */}
              <circle cx="70" cy="275" r="9" fill="#B9DDE2" stroke="#5C3928" strokeWidth="3" />
              <circle cx="70" cy="275" r="4" fill="#38BDF8" />
            </g>

            {/* ===================================================
                2. PANDA (MIDDLE TIER)
            =================================================== */}
            <g id="panda-middle">
              {/* Body (White Torso with Black Shoulder Band) */}
              <rect
                x="80"
                y="140"
                width="160"
                height="105"
                rx="42"
                fill="#FFFFFF"
                stroke="#5C3928"
                strokeWidth="5"
              />

              {/* Black Coat / Fur Band Across Shoulders */}
              <path
                d="M80 185 C110 205, 210 205, 240 185 L240 215 C210 230, 110 230, 80 215 Z"
                fill="#2B2D42"
                stroke="#5C3928"
                strokeWidth="4"
              />

              {/* Panda Ears (Black) */}
              <circle cx="98" cy="140" r="14" fill="#2B2D42" stroke="#5C3928" strokeWidth="5" />
              <circle cx="98" cy="140" r="7" fill="#4B5563" />
              <circle cx="222" cy="140" r="14" fill="#2B2D42" stroke="#5C3928" strokeWidth="5" />
              <circle cx="222" cy="140" r="7" fill="#4B5563" />

              {/* Paws on Sides */}
              <ellipse cx="88" cy="220" rx="14" ry="10" fill="#2B2D42" stroke="#5C3928" strokeWidth="4" />
              <ellipse cx="232" cy="220" rx="14" ry="10" fill="#2B2D42" stroke="#5C3928" strokeWidth="4" />

              {/* Iconic Angled Panda Eye Patches */}
              <ellipse cx="138" cy="165" rx="13" ry="11" transform="rotate(-15 138 165)" fill="#2B2D42" stroke="#5C3928" strokeWidth="3" />
              <ellipse cx="182" cy="165" rx="13" ry="11" transform="rotate(15 182 165)" fill="#2B2D42" stroke="#5C3928" strokeWidth="3" />
              {/* Cute White Glint Eyes */}
              <circle cx="139" cy="164" r="4" fill="#FFFFFF" className="animate-bear-blink" />
              <circle cx="140.5" cy="162.5" r="1.5" fill="#2B2D42" />
              <circle cx="181" cy="164" r="4" fill="#FFFFFF" className="animate-bear-blink" />
              <circle cx="179.5" cy="162.5" r="1.5" fill="#2B2D42" />

              {/* Snout & Nose */}
              <ellipse cx="160" cy="177" rx="13" ry="9" fill="#FFFFFF" stroke="#5C3928" strokeWidth="3" />
              <ellipse cx="160" cy="174" rx="6" ry="4.5" fill="#2B2D42" />
              {/* Gentle Panda Smile */}
              <path d="M155 180 Q160 185 165 180" stroke="#5C3928" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Blush Patches */}
              <ellipse cx="120" cy="176" rx="6" ry="3.5" fill="#FCA5A5" fillOpacity="0.7" />
              <ellipse cx="200" cy="176" rx="6" ry="3.5" fill="#FCA5A5" fillOpacity="0.7" />
            </g>

            {/* ===================================================
                3. GRIZZLY (TOP APEX)
            =================================================== */}
            <g id="grizzly-top">
              {/* Warm Brown Grizzly Body */}
              <rect
                x="95"
                y="35"
                width="130"
                height="105"
                rx="40"
                fill="#A96F45"
                stroke="#5C3928"
                strokeWidth="5"
              />

              {/* Cheerful Ears */}
              <circle cx="112" cy="35" r="14" fill="#A96F45" stroke="#5C3928" strokeWidth="5" />
              <circle cx="112" cy="35" r="7" fill="#D96B4C" />
              <circle cx="208" cy="35" r="14" fill="#A96F45" stroke="#5C3928" strokeWidth="5" />
              <circle cx="208" cy="35" r="7" fill="#D96B4C" />

              {/* Paws Resting on Panda */}
              <ellipse cx="108" cy="120" rx="14" ry="10" fill="#A96F45" stroke="#5C3928" strokeWidth="4" />
              <ellipse cx="212" cy="120" rx="14" ry="10" fill="#A96F45" stroke="#5C3928" strokeWidth="4" />

              {/* Eyes */}
              <ellipse cx="143" cy="65" rx="4" ry="5.5" fill="#2B2D42" className="animate-bear-blink" />
              <circle cx="144" cy="63.5" r="1.5" fill="#FFFFFF" />
              <ellipse cx="177" cy="65" rx="4" ry="5.5" fill="#2B2D42" className="animate-bear-blink" />
              <circle cx="178" cy="63.5" r="1.5" fill="#FFFFFF" />

              {/* Snout & Nose */}
              <ellipse cx="160" cy="76" rx="17" ry="13" fill="#D79E75" stroke="#5C3928" strokeWidth="3.5" />
              <ellipse cx="160" cy="72" rx="7.5" ry="5.5" fill="#5C3928" />
              {/* Big Joyful Grizzly Open Smile */}
              <path
                d="M150 80 Q160 94 170 80 Z"
                fill="#881337"
                stroke="#5C3928"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path d="M156 86 Q160 84 164 86" stroke="#FCA5A5" strokeWidth="2.5" strokeLinecap="round" />

              {/* Tiny Cute Sprout / Leaf on Grizzly's Head */}
              <path
                d="M160 25 Q165 14 175 18 Q167 27 160 25 Z"
                fill="#527A58"
                stroke="#5C3928"
                strokeWidth="2.5"
              />
            </g>
          </svg>
        )}

        {/* TRIO CELEBRATION POSE */}
        {activePose === 'trio_celebration' && (
          <svg
            width={width}
            height={height}
            viewBox="0 0 340 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-md"
          >
            {/* Ground Shadow */}
            <ellipse cx="170" cy="205" rx="140" ry="12" fill="#5C3928" fillOpacity="0.15" />

            {/* Grizzly (Left) */}
            <g id="grizzly-standing">
              <rect x="30" y="80" width="80" height="115" rx="35" fill="#A96F45" stroke="#5C3928" strokeWidth="4.5" />
              <circle cx="45" cy="80" r="11" fill="#A96F45" stroke="#5C3928" strokeWidth="4.5" />
              <circle cx="95" cy="80" r="11" fill="#A96F45" stroke="#5C3928" strokeWidth="4.5" />
              {/* Left waving arm */}
              <path d="M30 110 Q15 90 20 75" stroke="#A96F45" strokeWidth="18" strokeLinecap="round" />
              <path d="M30 110 Q15 90 20 75" stroke="#5C3928" strokeWidth="4.5" fill="none" />
              {/* Eyes & Smile */}
              <circle cx="60" cy="105" r="3.5" fill="#2B2D42" />
              <circle cx="80" cy="105" r="3.5" fill="#2B2D42" />
              <ellipse cx="70" cy="114" rx="11" ry="8" fill="#D79E75" stroke="#5C3928" strokeWidth="2.5" />
              <ellipse cx="70" cy="111" rx="5" ry="3.5" fill="#5C3928" />
              <path d="M64 117 Q70 125 76 117 Z" fill="#881337" stroke="#5C3928" strokeWidth="2" />
            </g>

            {/* Panda (Center) */}
            <g id="panda-standing">
              <rect x="130" y="70" width="80" height="125" rx="35" fill="#FFFFFF" stroke="#5C3928" strokeWidth="4.5" />
              <path d="M130 105 C150 120, 190 120, 210 105 L210 145 C190 160, 150 160, 130 145 Z" fill="#2B2D42" stroke="#5C3928" strokeWidth="4" />
              <circle cx="145" cy="70" r="11" fill="#2B2D42" stroke="#5C3928" strokeWidth="4.5" />
              <circle cx="195" cy="70" r="11" fill="#2B2D42" stroke="#5C3928" strokeWidth="4.5" />
              {/* Panda Eye Patches */}
              <ellipse cx="155" cy="90" rx="9" ry="7" transform="rotate(-15 155 90)" fill="#2B2D42" stroke="#5C3928" strokeWidth="2" />
              <ellipse cx="185" cy="90" rx="9" ry="7" transform="rotate(15 185 90)" fill="#2B2D42" stroke="#5C3928" strokeWidth="2" />
              <circle cx="156" cy="89" r="2.5" fill="#FFFFFF" />
              <circle cx="184" cy="89" r="2.5" fill="#FFFFFF" />
              <ellipse cx="170" cy="98" rx="8" ry="6" fill="#FFFFFF" stroke="#5C3928" strokeWidth="2" />
              <ellipse cx="170" cy="96" rx="4" ry="3" fill="#2B2D42" />
              <path d="M166 100 Q170 104 174 100" stroke="#5C3928" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Ice Bear (Right) */}
            <g id="ice-bear-standing">
              <rect x="230" y="80" width="80" height="115" rx="35" fill="#FFFFFF" stroke="#5C3928" strokeWidth="4.5" />
              <circle cx="245" cy="80" r="11" fill="#FFFFFF" stroke="#5C3928" strokeWidth="4.5" />
              <circle cx="295" cy="80" r="11" fill="#FFFFFF" stroke="#5C3928" strokeWidth="4.5" />
              {/* Right waving arm */}
              <path d="M310 110 Q325 90 320 75" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" />
              <path d="M310 110 Q325 90 320 75" stroke="#5C3928" strokeWidth="4.5" fill="none" />
              {/* Eyes & Stoic Expression */}
              <circle cx="260" cy="105" r="3.5" fill="#2B2D42" />
              <circle cx="280" cy="105" r="3.5" fill="#2B2D42" />
              <ellipse cx="270" cy="114" rx="10" ry="7" fill="#F8FAFC" stroke="#5C3928" strokeWidth="2.5" />
              <ellipse cx="270" cy="111" rx="5" ry="3.5" fill="#2B2D42" />
              <path d="M266 117 L274 117" stroke="#5C3928" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Floating Celebration Confetti / Sparkles */}
            <path d="M60 40 L65 50 L55 50 Z" fill="#F59E0B" stroke="#5C3928" strokeWidth="1.5" />
            <circle cx="170" cy="35" r="5" fill="#D96B4C" stroke="#5C3928" strokeWidth="2" />
            <path d="M280 45 L285 55 L275 55 Z" fill="#527A58" stroke="#5C3928" strokeWidth="1.5" />
          </svg>
        )}

        {/* INDIVIDUAL GRIZZLY AVATAR */}
        {activePose === 'grizzly' && (
          <svg width={width} height={height} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="80" cy="148" rx="55" ry="8" fill="#5C3928" fillOpacity="0.15" />
            <circle cx="48" cy="50" r="15" fill="#A96F45" stroke="#5C3928" strokeWidth="4.5" />
            <circle cx="48" cy="50" r="7" fill="#D96B4C" />
            <circle cx="112" cy="50" r="15" fill="#A96F45" stroke="#5C3928" strokeWidth="4.5" />
            <circle cx="112" cy="50" r="7" fill="#D96B4C" />
            <rect x="35" y="45" width="90" height="95" rx="42" fill="#A96F45" stroke="#5C3928" strokeWidth="4.5" />
            <circle cx="65" cy="75" r="4" fill="#2B2D42" className="animate-bear-blink" />
            <circle cx="95" cy="75" r="4" fill="#2B2D42" className="animate-bear-blink" />
            <ellipse cx="80" cy="88" rx="17" ry="12" fill="#D79E75" stroke="#5C3928" strokeWidth="3" />
            <ellipse cx="80" cy="84" rx="7" ry="5" fill="#5C3928" />
            <path d="M72 91 Q80 102 88 91 Z" fill="#881337" stroke="#5C3928" strokeWidth="2.5" />
          </svg>
        )}

        {/* INDIVIDUAL PANDA AVATAR */}
        {activePose === 'panda' && (
          <svg width={width} height={height} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="80" cy="148" rx="55" ry="8" fill="#5C3928" fillOpacity="0.15" />
            <circle cx="48" cy="50" r="15" fill="#2B2D42" stroke="#5C3928" strokeWidth="4.5" />
            <circle cx="112" cy="50" r="15" fill="#2B2D42" stroke="#5C3928" strokeWidth="4.5" />
            <rect x="35" y="45" width="90" height="95" rx="42" fill="#FFFFFF" stroke="#5C3928" strokeWidth="4.5" />
            <path d="M35 85 C55 100, 105 100, 125 85 L125 115 C105 130, 55 130, 35 115 Z" fill="#2B2D42" stroke="#5C3928" strokeWidth="3" />
            <ellipse cx="62" cy="75" rx="12" ry="9" transform="rotate(-15 62 75)" fill="#2B2D42" stroke="#5C3928" strokeWidth="2.5" />
            <ellipse cx="98" cy="75" rx="12" ry="9" transform="rotate(15 98 75)" fill="#2B2D42" stroke="#5C3928" strokeWidth="2.5" />
            <circle cx="63" cy="74" r="3.5" fill="#FFFFFF" className="animate-bear-blink" />
            <circle cx="97" cy="74" r="3.5" fill="#FFFFFF" className="animate-bear-blink" />
            <ellipse cx="80" cy="85" rx="11" ry="8" fill="#FFFFFF" stroke="#5C3928" strokeWidth="2.5" />
            <ellipse cx="80" cy="83" rx="5" ry="3.5" fill="#2B2D42" />
            <path d="M75 87 Q80 91 85 87" stroke="#5C3928" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="50" cy="86" rx="6" ry="3.5" fill="#FCA5A5" fillOpacity="0.7" />
            <ellipse cx="110" cy="86" rx="6" ry="3.5" fill="#FCA5A5" fillOpacity="0.7" />
          </svg>
        )}

        {/* INDIVIDUAL ICE BEAR AVATAR */}
        {activePose === 'ice_bear' && (
          <svg width={width} height={height} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="80" cy="148" rx="55" ry="8" fill="#5C3928" fillOpacity="0.15" />
            <circle cx="48" cy="50" r="15" fill="#FFFFFF" stroke="#5C3928" strokeWidth="4.5" />
            <circle cx="48" cy="50" r="7" fill="#E2E8F0" />
            <circle cx="112" cy="50" r="15" fill="#FFFFFF" stroke="#5C3928" strokeWidth="4.5" />
            <circle cx="112" cy="50" r="7" fill="#E2E8F0" />
            <rect x="35" y="45" width="90" height="95" rx="42" fill="#FFFFFF" stroke="#5C3928" strokeWidth="4.5" />
            <circle cx="65" cy="75" r="4" fill="#2B2D42" className="animate-bear-blink" />
            <circle cx="95" cy="75" r="4" fill="#2B2D42" className="animate-bear-blink" />
            <ellipse cx="80" cy="88" rx="15" ry="10" fill="#F8FAFC" stroke="#5C3928" strokeWidth="3" />
            <ellipse cx="80" cy="84" rx="7" ry="5" fill="#2B2D42" />
            <path d="M75 91 L85 91" stroke="#5C3928" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Dynamic Speech Bubble — Bottom */}
      {hasBubble && effectiveQuote && speechPosition === 'bottom' && (
        <div className="mt-3 max-w-xs sm:max-w-sm px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border-[3px] border-[#5C3928] shadow-[4px_4px_0px_#5C3928] text-center relative z-20 animate-bear-float">
          {/* Arrow pointing up */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-[#5C3928]" />
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#FFFDF7]" />
          {effectiveSpeaker && (
            <span className={`inline-block px-2 py-0.5 mb-1 rounded-md text-[10px] font-black uppercase tracking-wider ${getSpeakerColor()}`}>
              {effectiveSpeaker}
            </span>
          )}
          <p className="text-xs sm:text-sm font-black text-[#3D2316] font-cartoon leading-snug">
            &ldquo;{effectiveQuote}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
};
