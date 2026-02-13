import { useState } from 'react';
import { Dashboard } from './features/dashboard/Dashboard';
import { FlashcardMode } from './features/flashcards/FlashcardMode';
import { QuizMode } from './features/quiz/QuizMode';
import type { WordSet, AppMode } from './types';
import './index.css';

function App() {
  const [mode, setMode] = useState<AppMode>('DASHBOARD');
  const [selectedSet, setSelectedSet] = useState<WordSet | null>(null);

  const handleSelectSet = (set: WordSet, requestedMode: 'FLASHCARDS' | 'QUIZ') => {
    setSelectedSet(set);
    setMode(requestedMode);
  };

  const handleExit = () => {
    setMode('DASHBOARD');
    setSelectedSet(null);
  };

  return (
    <div className="min-h-screen">
      {mode === 'DASHBOARD' && (
        <Dashboard onSelectSet={handleSelectSet} />
      )}

      {mode === 'FLASHCARDS' && selectedSet && (
        <FlashcardMode wordSet={selectedSet} onExit={handleExit} />
      )}

      {mode === 'QUIZ' && selectedSet && (
        <QuizMode wordSet={selectedSet} onExit={handleExit} />
      )}
    </div>
  );
}

export default App;
