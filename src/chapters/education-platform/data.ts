/**
 * Sample data for chapter 1. Every school, program, award and student here is
 * made up for this case study; none of it describes a real person or a real
 * admission rule.
 */

export type Verdict = 'meets' | 'gaps' | 'explore';
export type RequirementStatus = 'met' | 'gap' | 'unpublished';

export interface Requirement {
  course: string;
  /** What the program publishes. */
  asks: string;
  /** What the student has, if anything. */
  has?: string;
  status: RequirementStatus;
}

export interface Program {
  id: string;
  name: string;
  institution: string;
  years: number;
  /** ISO date. */
  deadline: string;
  requirements: Requirement[];
}

export const student = {
  name: 'Maya Okafor',
  term: 'Fall 2027',
};

const course = {
  english: { course: 'Grade 12 English', asks: '70% minimum', has: '88%', status: 'met' },
  functions: { course: 'Grade 12 Advanced Functions', asks: '70% minimum', has: '84%', status: 'met' },
  calculus: { course: 'Grade 12 Calculus and Vectors', asks: '70% minimum', has: '81%', status: 'met' },
  physics: { course: 'Grade 12 Physics', asks: '65% minimum', has: '90%', status: 'met' },
  biology: { course: 'Grade 12 Biology', asks: '70% minimum', has: '86%', status: 'met' },
  data: { course: 'Grade 12 Data Management', asks: '65% minimum', has: '92%', status: 'met' },
  chemistry: { course: 'Grade 12 Chemistry', asks: '70% minimum', status: 'gap' },
} satisfies Record<string, Requirement>;

export const programs: Program[] = [
  {
    id: 'environmental-engineering',
    name: 'Environmental Engineering',
    institution: 'Northfield University',
    years: 4,
    deadline: '2027-01-15',
    requirements: [course.english, course.functions, course.calculus, course.chemistry, course.physics],
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    institution: 'Lakeshore University',
    years: 4,
    deadline: '2027-02-01',
    requirements: [course.english, course.functions, course.calculus, course.data],
  },
  {
    id: 'health-sciences',
    name: 'Health Sciences',
    institution: 'Riverbend University',
    years: 4,
    deadline: '2027-01-15',
    requirements: [course.english, course.biology, course.data],
  },
  {
    id: 'psychology',
    name: 'Psychology',
    institution: 'Northfield University',
    years: 4,
    deadline: '2027-03-01',
    requirements: [course.english, course.data],
  },
  {
    id: 'nursing',
    name: 'Nursing',
    institution: 'Eastgate College',
    years: 4,
    deadline: '2027-02-15',
    requirements: [course.english, course.biology, course.chemistry, course.data],
  },
  {
    id: 'urban-planning',
    name: 'Urban Planning',
    institution: 'Harbourview Polytechnic',
    years: 3,
    deadline: '2027-02-01',
    requirements: [
      course.english,
      { course: 'A Grade 12 math course', asks: 'Not published yet', status: 'unpublished' },
    ],
  },
];

/** The verdict is computed from the requirements, never stored, so it cannot disagree with them. */
export function verdictOf(program: Program): Verdict {
  if (program.requirements.some((r) => r.status === 'unpublished')) return 'explore';
  return program.requirements.some((r) => r.status === 'gap') ? 'gaps' : 'meets';
}

export function gapsIn(program: Program) {
  return program.requirements.filter((r) => r.status === 'gap');
}

export function metIn(program: Program) {
  return program.requirements.filter((r) => r.status === 'met');
}

export const programById = (id: string) => programs.find((p) => p.id === id) ?? programs[0];

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  /** Whole Canadian dollars. Every amount on screen names its currency. */
  amountCad: number;
  /** ISO date. */
  deadline: string;
  qualifies: boolean;
  /** When the student does not qualify yet: the one thing to add. */
  toAdd?: string;
}

export const scholarships: Scholarship[] = [
  {
    id: 'community-leaders',
    name: 'Community Leaders Award',
    provider: 'Harbourview Foundation',
    amountCad: 2500,
    deadline: '2026-11-14',
    qualifies: true,
  },
  {
    id: 'first-in-family',
    name: 'First in Family Bursary',
    provider: 'Northfield University',
    amountCad: 4000,
    deadline: '2026-12-01',
    qualifies: true,
  },
  {
    id: 'stem-futures',
    name: 'STEM Futures Scholarship',
    provider: 'Lakeshore Science Trust',
    amountCad: 5000,
    deadline: '2027-01-10',
    qualifies: false,
    toAdd: 'A reference letter from a teacher',
  },
  {
    id: 'rural-students',
    name: 'Rural Students Grant',
    provider: 'Riverbend University',
    amountCad: 1500,
    deadline: '2027-01-31',
    qualifies: true,
  },
  {
    id: 'arts-and-design',
    name: 'Arts and Design Prize',
    provider: 'Eastgate College',
    amountCad: 1000,
    deadline: '2027-02-15',
    qualifies: false,
    toAdd: 'A portfolio of five pieces',
  },
];

const dateFormat = new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const moneyFormat = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });

/** "Jan 15, 2027". */
export const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00Z`));

/** "$2,500 CAD". The currency is always named. */
export const formatCad = (amount: number) => `$${moneyFormat.format(amount)} CAD`;
