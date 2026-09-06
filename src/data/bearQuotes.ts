export interface BearQuote {
  speaker: 'Grizzly' | 'Panda' | 'Ice Bear' | 'Bear Stack';
  quote: string;
  tag: string;
}

export const BEAR_QUOTES: Record<string, BearQuote> = {
  default: {
    speaker: 'Bear Stack',
    quote: 'Welcome to NeuraMorphix! Choose your 1st & 2nd squad preferences. We build together!',
    tag: 'TEAMWORK',
  },
  'AI & Machine Learning': {
    speaker: 'Grizzly',
    quote: 'Whoa, neural networks! Let us train giant transformer models and eat waffles while they converge!',
    tag: 'DEEP LEARNING',
  },
  'Full Stack Web Development': {
    speaker: 'Panda',
    quote: 'React, TypeScript, and clean responsive CSS! Make sure the animations are super smooth for mobile!',
    tag: 'CLEAN WEB',
  },
  'Mobile App Development': {
    speaker: 'Panda',
    quote: 'Ooh, a mobile app! Can we make sure push notifications have cute bear sticker icons?',
    tag: 'IOS & ANDROID',
  },
  'IoT & Embedded Systems': {
    speaker: 'Ice Bear',
    quote: 'Ice Bear builds microcontrollers. Low power, zero latency, maximum precision.',
    tag: 'HARDWARE MESH',
  },
  'Cloud & DevOps': {
    speaker: 'Ice Bear',
    quote: 'Ice Bear manages Kubernetes clusters. Nine nines uptime guaranteed.',
    tag: 'INFRASTRUCTURE',
  },
  Cybersecurity: {
    speaker: 'Ice Bear',
    quote: 'Ice Bear detected zero-day vulnerabilities. Firewall impenetrable.',
    tag: 'ZERO TRUST',
  },
  'UI/UX & Product Design': {
    speaker: 'Panda',
    quote: 'Figma wireframes, cute micro-interactions, and beautiful color palettes! My aesthetic soul is happy!',
    tag: 'CREATIVE DESIGN',
  },
  'Data Engineering & Analytics': {
    speaker: 'Grizzly',
    quote: 'Big data pipelines! We stream petabytes like salmon rushing up the mountain river!',
    tag: 'ETL PIPELINE',
  },
  'Robotics & Automation': {
    speaker: 'Ice Bear',
    quote: 'Ice Bear programs autonomous robots. Ninja agility calibrated.',
    tag: 'ROBOTICS',
  },
  'Technical Writing & Documentation': {
    speaker: 'Grizzly',
    quote: 'Great docs make great communities! Tell our technical story so everyone can build with us!',
    tag: 'COMMUNITY',
  },
};

export const APPLICATION_STEP_TIPS = {
  details: {
    speaker: 'Grizzly',
    quote: 'Step 1: Introduce yourself! Tell us your name, college, and contact info so we can stay in touch!',
  },
  skills: {
    speaker: 'Panda',
    quote: 'Step 2: Show off your skills! Pick your tech stacks, frameworks, and past builds!',
  },
  review: {
    speaker: 'Ice Bear',
    quote: 'Step 3: Ice Bear conducts final verification. Inspect your dossier carefully before submission.',
  },
  submitted: {
    speaker: 'Bear Stack',
    quote: 'You did it! Your dossier is officially in the queue! Check your email for confirmation!',
  },
};
