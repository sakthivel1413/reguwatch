
import { Regulator, RegUpdate } from './types';

export const REGULATOR_INFO = {
  [Regulator.FSRA]: {
    name: "Financial Services Regulatory Authority (Ontario)",
    url: "https://www.fsrao.ca/",
    color: "bg-blue-700"
  },
  [Regulator.CIRO]: {
    name: "Canadian Investment Regulatory Organization",
    url: "https://www.ciro.ca/",
    color: "bg-emerald-700"
  },
  [Regulator.OSFI]: {
    name: "Office of the Superintendent of Financial Institutions",
    url: "https://www.osfi-bsif.gc.ca/",
    color: "bg-red-700"
  },
  [Regulator.CCIR]: {
    name: "Canadian Council of Insurance Regulators",
    url: "https://www.ccir-ccra.org/",
    color: "bg-purple-700"
  },
  [Regulator.FINTRAC]: {
    name: "FINTRAC Canada",
    url: "https://fintrac-canafe.canada.ca/",
    color: "bg-amber-700"
  },
  [Regulator.CSA]: {
    name: "Canadian Securities Administrators",
    url: "https://www.securities-administrators.ca/",
    color: "bg-cyan-700"
  }
};

// Fix: Explicitly type INITIAL_UPDATES as RegUpdate[] to ensure literal types for impactLevel are correctly enforced
export const INITIAL_UPDATES: RegUpdate[] = [
  {
    id: '1',
    regulator: Regulator.FSRA,
    date: '2024-05-15',
    title: 'New Guidance on Unfair Claims Settlement Practices',
    summary: 'Updates to the Treat Customers Fairly (TCF) framework specifically for property and casualty insurers.',
    url: 'https://www.fsrao.ca/newsroom',
    impactLevel: 'High'
  },
  {
    id: '2',
    regulator: Regulator.CIRO,
    date: '2024-05-10',
    title: 'Proposed Amendments to Proficiency Requirements',
    summary: 'Revised standards for continuing education and initial registration of investment advisors.',
    url: 'https://www.ciro.ca/news',
    impactLevel: 'Medium'
  }
];
