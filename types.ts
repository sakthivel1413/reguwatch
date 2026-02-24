
export enum Regulator {
  FSRA = 'FSRA',
  CIRO = 'CIRO',
  OSFI = 'OSFI',
  CCIR = 'CCIR',
  FINTRAC = 'FINTRAC',
  CSA = 'CSA'
}

export type AppView = 'feed' | 'templates';

export interface RegUpdate {
  id: string;
  regulator: Regulator;
  date: string;
  title: string;
  summary: string;
  url: string;
  impactLevel: 'High' | 'Medium' | 'Low';
}

export interface TemplateAnalysis {
  status: 'Compliant' | 'At Risk' | 'Needs Review';
  summary: string;
  suggestedChanges: string[];
}
