export type ComponentCategory = 'passive' | 'semiconductor' | 'power' | 'sensor';

export type MultimeterMode = 'OFF' | 'OHM' | 'DIODE' | 'CAP' | 'VOLT_DC';

export type ComponentCondition = 'good' | 'open' | 'short' | 'degraded';

export interface MeasurementScenario {
  recommendedMode: MultimeterMode;
  recommendedModeLabel: string;
  polaritySensitive: boolean;
  steps: string[];
  goodReading: string;
  openFaultReading: string;
  shortFaultReading: string;
  degradedReading: string;
  safetyNote: string;
  simValues: {
    goodForward: Record<MultimeterMode, string>;
    goodReverse: Record<MultimeterMode, string>;
    open: Record<MultimeterMode, string>;
    short: Record<MultimeterMode, string>;
    degraded: Record<MultimeterMode, string>;
    beepOnGood?: boolean;
    beepOnShort?: boolean;
  };
}

export interface ElectronicComponent {
  id: string;
  nameAr: string;
  nameEn: string;
  symbolLetter: string;
  unitAr: string;
  unitSymbol: string;
  category: ComponentCategory;
  categoryLabelAr: string;
  imageUrl: string;
  shortRoleAr: string;
  fullRoleAr: string;
  howItWorksAr: string;
  formula?: {
    equation: string;
    meaningAr: string;
  };
  pinoutNotesAr: string[];
  commonTypesAr: string[];
  realWorldUsesAr: string[];
  visualFaultSignsAr: string[];
  measurement: MeasurementScenario;
}

export type QuizLevel = 'beginner' | 'intermediate' | 'expert';

export interface QuizQuestion {
  id: string;
  level: QuizLevel;
  points: number;
  topicAr: string;
  questionAr: string;
  componentId: string;
  options: string[];
  correctIndex: number;
  explanationAr: string;
}

export interface QuizRank {
  id: string;
  titleAr: string;
  minPoints: number;
  descriptionAr: string;
}

