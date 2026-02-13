import React from 'react';
import { wordSets } from '../../data/words';
import type { WordSet } from '../../types';
import { BookOpen, Zap, ChevronRight } from 'lucide-react';

interface DashboardProps {
    onSelectSet: (set: WordSet, mode: 'FLASHCARDS' | 'QUIZ') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectSet }) => {
    const totalWords = wordSets.reduce((acc, set) => acc + set.words.length, 0);

    return (
        <div className="page">
            <div className="container">
                {/* Header Section */}
                <header className="text-center mb-8 animate-in">
                    <h1 className="mb-2">LexiLearn</h1>
                    <p>Master vocabulary through interactive learning</p>

                    {/* Stats */}
                    <div className="flex justify-center gap-6 mt-6">
                        <div className="text-center">
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--accent)' }}>
                                {wordSets.length}
                            </div>
                            <div className="label">Collections</div>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border)' }} />
                        <div className="text-center">
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--accent)' }}>
                                {totalWords}
                            </div>
                            <div className="label">Words</div>
                        </div>
                    </div>
                </header>

                {/* Word Sets */}
                <section>
                    <div className="flex items-center gap-3 mb-4 animate-in delay-1">
                        <span className="label">Collections</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                    </div>

                    <div className="flex flex-col gap-4">
                        {wordSets.map((set, idx) => (
                            <div
                                key={set.id}
                                className="card animate-in"
                                style={{ animationDelay: `${100 + idx * 50}ms` }}
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div style={{ flex: 1 }}>
                                        <h3 className="mb-1">{set.name}</h3>
                                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                            {set.description}
                                        </p>
                                    </div>
                                    <span className="badge">{set.words.length} words</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => onSelectSet(set, 'FLASHCARDS')}
                                    >
                                        <BookOpen size={16} />
                                        Study
                                        <ChevronRight size={14} style={{ marginLeft: '2px', opacity: 0.7 }} />
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => onSelectSet(set, 'QUIZ')}
                                    >
                                        <Zap size={16} />
                                        Quiz
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Hint */}
                <footer className="text-center mt-8 animate-in" style={{ animationDelay: '400ms' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Use keyboard shortcuts: ← → navigate • Space flip • 1-4 select options
                    </p>
                </footer>
            </div>
        </div>
    );
};
