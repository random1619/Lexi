import React, { useState, useEffect, useCallback } from 'react';
import type { WordSet } from '../../types';
import { X, CheckCircle2, XCircle, Trophy, RotateCcw, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizModeProps {
    wordSet: WordSet;
    onExit: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ wordSet, onExit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const currentWord = wordSet.words[currentIndex];
    const progress = ((currentIndex + 1) / wordSet.words.length) * 100;

    // Intelligent distractor selection algorithm
    const generateOptions = useCallback(() => {
        const correct = currentWord.definition;
        const correctLength = correct.length;
        const correctWordCount = correct.split(' ').length;

        // Score each potential distractor
        const scoredDistractors = wordSet.words
            .filter((_, i) => i !== currentIndex)
            .map(w => {
                const def = w.definition;
                const lengthDiff = Math.abs(def.length - correctLength);
                const wordCountDiff = Math.abs(def.split(' ').length - correctWordCount);

                // Scoring factors (lower is better)
                let score = 0;

                // 1. Length similarity (prefer similar length)
                score += lengthDiff * 0.5;

                // 2. Word count similarity
                score += wordCountDiff * 10;

                // 3. Penalize very short or very long definitions
                if (def.length < 20 || def.length > 200) score += 50;

                // 4. Prefer definitions with similar structure
                const correctHasSemicolon = correct.includes(';');
                const defHasSemicolon = def.includes(';');
                if (correctHasSemicolon === defHasSemicolon) score -= 15;

                // 5. Prefer definitions with similar punctuation patterns
                const correctCommas = (correct.match(/,/g) || []).length;
                const defCommas = (def.match(/,/g) || []).length;
                score += Math.abs(correctCommas - defCommas) * 5;

                return { definition: def, score };
            })
            .sort((a, b) => a.score - b.score) // Sort by score (best first)
            .slice(0, 6) // Take top 6 candidates
            .sort(() => 0.5 - Math.random()) // Randomize among top candidates
            .slice(0, 3) // Select 3
            .map(item => item.definition);

        setOptions([correct, ...scoredDistractors].sort(() => 0.5 - Math.random()));
        setSelectedOption(null);
    }, [currentIndex, currentWord, wordSet.words]);


    useEffect(() => {
        if (currentIndex < wordSet.words.length) generateOptions();
    }, [currentIndex, generateOptions, wordSet.words.length]);

    const handleOptionClick = (option: string) => {
        if (selectedOption !== null) return;
        setSelectedOption(option);
        if (option === currentWord.definition) setScore(s => s + 1);
        setTimeout(() => {
            if (currentIndex < wordSet.words.length - 1) setCurrentIndex(prev => prev + 1);
            else setShowResults(true);
        }, 1200);
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowResults(false);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showResults) {
                if (e.key === 'r' || e.key === 'R') handleRestart();
                else if (e.key === 'Escape') onExit();
                return;
            }
            if (selectedOption === null && options.length > 0) {
                const key = e.key.toLowerCase();
                let idx = -1;
                if (key >= '1' && key <= '4') idx = parseInt(key) - 1;
                else if (key >= 'a' && key <= 'd') idx = key.charCodeAt(0) - 'a'.charCodeAt(0);
                if (idx >= 0 && idx < options.length) handleOptionClick(options[idx]);
            }
            if (e.key === 'Escape') onExit();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [options, selectedOption, showResults, onExit]);

    // Results Screen
    if (showResults) {
        const percentage = Math.round((score / wordSet.words.length) * 100);
        const isGreat = percentage >= 70;

        return (
            <div className="page page-centered">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Trophy */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    >
                        <Trophy
                            size={56}
                            strokeWidth={1.5}
                            style={{
                                color: percentage === 100 ? 'var(--warning)' : 'var(--accent)',
                                marginBottom: 'var(--space-6)'
                            }}
                        />
                    </motion.div>

                    {/* Title */}
                    <h1 className="mb-2">
                        {percentage === 100 ? 'Perfect!' : isGreat ? 'Great Job!' : 'Keep Practicing'}
                    </h1>
                    <p className="mb-6">
                        You scored {score} out of {wordSet.words.length}
                    </p>

                    {/* Score Percentage */}
                    <div
                        className="card"
                        style={{
                            display: 'inline-block',
                            padding: 'var(--space-6) var(--space-10)',
                            marginBottom: 'var(--space-8)'
                        }}
                    >
                        <div style={{
                            fontSize: 'var(--text-4xl)',
                            fontWeight: 800,
                            color: isGreat ? 'var(--success)' : 'var(--error)'
                        }}>
                            {percentage}%
                        </div>
                        <div className="label mt-2">Accuracy</div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-3">
                        <button className="btn btn-secondary" onClick={onExit}>
                            <Home size={18} />
                            Home
                        </button>
                        <button className="btn btn-primary" onClick={handleRestart}>
                            <RotateCcw size={18} />
                            Try Again
                        </button>
                    </div>

                    {/* Hint */}
                    <p className="text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
                        Press R to retry • Esc to exit
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <header className="flex justify-between items-center mb-6 animate-in">
                    <div>
                        <span className="label">Quiz</span>
                        <h2 className="mt-1">{wordSet.name}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="badge badge-success">Score: {score}</span>
                        <button className="btn btn-ghost" onClick={onExit} aria-label="Exit">
                            <X size={20} />
                        </button>
                    </div>
                </header>

                {/* Progress */}
                <div className="mb-8 animate-in delay-1">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            Question {currentIndex + 1} of {wordSet.words.length}
                        </span>
                    </div>
                    <div className="progress">
                        <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        style={{ flex: 1 }}
                    >
                        {/* Question Card */}
                        <div className="card text-center mb-6" style={{ padding: 'var(--space-8)' }}>
                            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                                What is the definition of...
                            </p>
                            <h1 style={{ color: 'var(--accent)' }}>{currentWord.term}</h1>
                        </div>

                        {/* Options */}
                        <div className="flex flex-col gap-3">
                            {options.map((option, idx) => {
                                const isCorrect = option === currentWord.definition;
                                const isSelected = option === selectedOption;
                                const isRevealed = selectedOption !== null;

                                let className = 'option';
                                if (isRevealed && isCorrect) className += ' correct';
                                else if (isRevealed && isSelected) className += ' wrong';
                                else if (isRevealed) className += ' dimmed';

                                return (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => handleOptionClick(option)}
                                        disabled={isRevealed}
                                        className={className}
                                    >
                                        <span className="option-letter">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="option-text">{option}</span>
                                        {isRevealed && isCorrect && (
                                            <CheckCircle2 size={20} className="option-icon" style={{ color: 'var(--success)' }} />
                                        )}
                                        {isRevealed && isSelected && !isCorrect && (
                                            <XCircle size={20} className="option-icon" style={{ color: 'var(--error)' }} />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Hint */}
                        <p className="text-xs text-center mt-6" style={{ color: 'var(--text-muted)' }}>
                            Press A-D or 1-4 to select • Esc to exit
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
