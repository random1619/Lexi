export interface Word {
  id: string;
  term: string;
  definition: string;
  example?: string;
  category?: string;
}

export interface WordSet {
  id: string;
  name: string;
  description: string;
  words: Word[];
}

export type AppMode = 'DASHBOARD' | 'FLASHCARDS' | 'QUIZ';
