/**
 * Tipos del Centro de Ayuda (Admin + Portal).
 * Edita el contenido en `help-data.ts` de cada superficie.
 */

export type HelpStep = {
  id: string;
  title: string;
  description: string;
};

export type HelpFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type HelpContent = {
  /** Título del drawer */
  title: string;
  subtitle: string;
  stepsHeading: string;
  steps: HelpStep[];
  faqHeading: string;
  faqs: HelpFaqItem[];
  footerNote?: string;
};
