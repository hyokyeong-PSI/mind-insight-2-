
export enum Domain {
  NegativeSensitivity = '심리적 민감성',
  Extraversion = '내향/외향성',
  OpennessToExperience = '인지적 개방성',
  Agreeableness = '대인 수용성',
  Conscientiousness = '규범지향성'
}

export interface Question {
  id: number;
  text: string;
  domain: Domain;
  reverse: boolean;
}

export interface Mission {
  day: number;
  task: string;
  tip: string;
}

export interface WeeklyGoal {
  week: number;
  title: string;
  missions: Mission[];
}

export interface DiagnosisResult {
  scores: Record<Domain, number>;
  interpretation: string;
  strengths: string[];
  weaknesses: string[];
  weeklyPlans: WeeklyGoal[];
  createdAt: number;
}

export type ViewType = 'intro' | 'diagnosis' | 'report';
