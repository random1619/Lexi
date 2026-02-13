import React, { useState, useEffect } from 'react';
import type { WordSet } from '../../types';
import { ArrowLeft, ArrowRight, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardModeProps {
    wordSet: WordSet;
    onExit: () => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({ wordSet, onExit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentWord = wordSet.words[currentIndex];
    const progress = ((currentIndex + 1) / wordSet.words.length) * 100;

    const handleNext = () => {
        if (currentIndex < wordSet.words.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 100);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 100);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrev();
            else if (e.key === 'ArrowRight') handleNext();
            else if (e.key === ' ') { e.preventDefault(); setIsFlipped(prev => !prev); }
            else if (e.key === 'Escape') onExit();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, onExit]);

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <header className="flex justify-between items-center mb-6 animate-in">
                    <div>
                        <span className="label">Studying</span>
                        <h2 className="mt-1">{wordSet.name}</h2>
                    </div>
                    <button className="btn btn-ghost" onClick={onExit} aria-label="Exit">
                        <X size={20} />
                    </button>
                </header>

                {/* Progress Section */}
                <div className="mb-8 animate-in delay-1">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            Card {currentIndex + 1} of {wordSet.words.length}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                            {Math.round(progress)}%
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

                {/* Flashcard */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="perspective w-full" style={{ maxWidth: '480px', aspectRatio: '3/2' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.2 }}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <motion.div
                                    className="preserve-3d"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    onClick={() => setIsFlipped(!isFlipped)}
                                >
                                    {/* Front - Term */}
                                    <div
                                        className="card backface-hidden flex-center text-center"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            flexDirection: 'column',
                                            gap: 'var(--space-4)'
                                        }}
                                    >
                                        <span className="label">Term</span>
                                        <h1 style={{ color: 'var(--accent)', fontSize: 'var(--text-4xl)' }}>
                                            {currentWord.term}
                                        </h1>
                                        <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
                                            Click to reveal definition
                                        </p>
                                    </div>

                                    {/* Back - Definition */}
                                    <div
                                        className="card backface-hidden rotate-y-180 flex-center text-center"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            flexDirection: 'column',
                                            gap: 'var(--space-3)',
                                            background: 'var(--bg-hover)'
                                        }}
                                    >
                                        <span className="label">Definition</span>
                                        <h3 style={{ color: 'var(--accent)', marginBottom: 'var(--space-2)' }}>
                                            {currentWord.term}
                                        </h3>
                                        <p style={{
                                            fontSize: 'var(--text-lg)',
                                            lineHeight: 'var(--leading-relaxed)',
                                            color: 'var(--text-primary)',
                                            maxWidth: '400px'
                                        }}>
                                            {currentWord.definition}
                                        </p>
                                        {currentWord.example && (
                                            <p
                                                className="text-sm"
                                                style={{
                                                    color: 'var(--text-tertiary)',
                                                    fontStyle: 'italic',
                                                    marginTop: 'var(--space-4)'
                                                }}
                                            >
                                                "{currentWord.example}"
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-3 mt-8 animate-in delay-2">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                    >
                        <ArrowLeft size={18} />
                        Previous
                    </button>

                    <button
                        className="btn btn-ghost"
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{ padding: 'var(--space-3)' }}
                    >
                        <RotateCcw size={18} />
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleNext}
                        disabled={currentIndex === wordSet.words.length - 1}
                    >
                        Next
                        <ArrowRight size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
};
