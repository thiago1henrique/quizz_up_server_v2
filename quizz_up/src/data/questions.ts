// src/data/questions.ts

export interface Question {
  question: string;
  options: { key: string; label: string }[];
  correct: string;
}

export const questions: Question[] = [
  {
    question:
      "An interface design application that runs in the browser with team-based collaborative design projects",
    options: [
      { key: 'A', label: 'FIGMA' },
      { key: 'B', label: 'ADOBE XD' },
      { key: 'C', label: 'INVISION' },
      { key: 'D', label: 'SKETCH' },
    ],
    correct: 'A',
  },
  {
    question: "Which language runs in a web browser?",
    options: [
      { key: 'A', label: 'Java' },
      { key: 'B', label: 'C' },
      { key: 'C', label: 'Python' },
      { key: 'D', label: 'JavaScript' },
    ],
    correct: 'D',
  },
  {
    question: "What does CSS stand for?",
    options: [
      { key: 'A', label: 'Central Style Sheets' },
      { key: 'B', label: 'Cascading Style Sheets' },
      { key: 'C', label: 'Cascading Simple Sheets' },
      { key: 'D', label: 'Cars SUVs Sailboats' },
    ],
    correct: 'B',
  },
   {
    question: "What does CSS stand for?",
    options: [
      { key: 'A', label: 'Central Style Sheets' },
      { key: 'B', label: 'Cascading Style Sheets' },
      { key: 'C', label: 'Cascading Simple Sheets' },
      { key: 'D', label: 'Cars SUVs Sailboats' },
    ],
    correct: 'B',
  },
  {
    question: "What does CSS stand for?",
    options: [
      { key: 'A', label: 'Central Style Sheets' },
      { key: 'B', label: 'Cascading Style Sheets' },
      { key: 'C', label: 'Cascading Simple Sheets' },
      { key: 'D', label: 'Cars SUVs Sailboats' },
    ],
    correct: 'B',
  },
];
