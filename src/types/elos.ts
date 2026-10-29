export type UserRole = 'mediator' | 'student' | 'family';

export type ViewRole = 'mediator' | 'student' | 'family' | 'split';

export type RoutePath = '/login' | '/mediador' | '/aluno' | '/familia' | '/sincronizado';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  badgeText: string;
  defaultRoute: RoutePath;
}

export type RegulationState = 'regulated' | 'sensory_alert' | 'cognitive_lock';

export type StimulusType =
  | 'reading_schedule'
  | 'math_blocks'
  | 'breathing_pause'
  | 'sensory_break'
  | 'transition_next';

export interface VisualStimulus {
  id: StimulusType;
  title: string;
  subtitle: string;
  currentStepLabel: string;
  nextStepLabel: string;
  durationMinutes: number;
  elapsedMinutes: number;
  category: 'cronograma' | 'autorregulacao' | 'transicao';
  themeColor: 'sage' | 'sky' | 'lavender';
  audioCueActive?: boolean;
  audioCueLabel?: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  supportLevel: 'TEA Nível 2 — Suporte Substancial';
  avatarInitials: string;
  sensoryProfile: string[];
  currentSubject: string;
  regulationState: RegulationState;
  focusLockCountToday: number;
  avgRecoveryTimeSeconds: number;
  activeStimulus: VisualStimulus;
  studentSelfReport?: 'calm' | 'need_help' | 'too_noisy' | null;
}

export interface TranslatedInsight {
  id: string;
  studentId: string;
  timestamp: string;
  subject: string;
  technicalRawLog: string;
  translatedSummary: string;
  homeTip: string;
  triggerTag: string;
  supportUsed: string;
  recoverySeconds: number;
  acknowledgedByFamily?: boolean;
}

export interface DailyEngagement {
  dayShort: string;
  dayFull: string;
  engagementPercent: number;
  regulatedHours: number;
  cognitiveLocks: number;
  highlight: string;
}

