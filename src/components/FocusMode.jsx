import React, { useState } from 'react';

const FocusMode = () => {
    const [text, setText] = useState("");
    const [sentences, setSentences] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReading, setIsReading] = useState(false);

    const startReading = () => {
        if (!text.trim()) return;
        // Basic sentence splitting using regex
        const split = text.match(/[^.!?]+[.!?]+/g) || [text];
        setSentences(split.map(s => s.trim()).filter(s => s.length > 0));
        setCurrentIndex(0);
        setIsReading(true);
    };

    const nextSentence = () => {
        if (currentIndex < sentences.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const prevSentence = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    // Allow keyboard navigation
    const handleKeyDown = (e) => {
        if (isReading) {
            if (e.key === 'ArrowRight') nextSentence();
            if (e.key === 'ArrowLeft') prevSentence();
            if (e.key === 'Escape') setIsReading(false);
        }
    };

    React.useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isReading, currentIndex, sentences.length]);

    if (isReading) {
        return (
            <div className="animate-fade-in" style={{ height: 'calc(100vh - 5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <button className="btn btn-secondary" onClick={() => setIsReading(false)} style={{ position: 'absolute', top: '0', right: '0' }}>
                    ✕ Exit Focus Mode
                </button>

                <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
                    <div className="text-muted mb-4" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 600 }}>
                        Sentence {currentIndex + 1} of {sentences.length}
                    </div>

                    <div className="glass-panel mb-8" style={{ padding: '4rem 2rem', minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(99, 102, 241, 0.3)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <p className="cognitive-text animate-fade-in" key={currentIndex} style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1.6, color: 'var(--color-text-main)' }}>
                            {sentences[currentIndex]}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button className="btn btn-secondary" onClick={prevSentence} disabled={currentIndex === 0} style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>
                            ← Previous
                        </button>
                        <button className="btn btn-primary" onClick={nextSentence} disabled={currentIndex === sentences.length - 1} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                            Next →
                        </button>
                    </div>
                    <div className="text-muted mt-4 text-sm">You can also use arrow keys to navigate.</div>

                    <div className="mt-8 flex justify-center gap-2 flex-wrap" style={{ maxWidth: '400px', margin: '2rem auto 0' }}>
                        {sentences.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: idx === currentIndex ? 'var(--color-primary)' : 'var(--color-border)',
                                    transition: 'background var(--transition-fast), transform var(--transition-fast)',
                                    cursor: 'pointer',
                                    transform: idx === currentIndex ? 'scale(1.5)' : 'scale(1)'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h2 className="text-3xl mb-2 text-gradient">Focus Mode</h2>
                <p className="text-muted text-lg">Read without distractions. We'll structure the text to show you one sentence at a time.</p>
            </header>

            <div className="glass-panel" style={{ maxWidth: '800px' }}>
                <label className="font-heading mb-2 text-lg" style={{ fontWeight: 600, display: 'block' }}>Text to Read</label>
                <textarea
                    className="input-control mb-6"
                    rows="14"
                    placeholder="Paste the text you want to read here... (Focus Mode will automatically split it into readable chunks)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ resize: 'vertical' }}
                />
                <button className="btn btn-primary" onClick={startReading} disabled={!text.trim()} style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
                    📖 Start Reading Focus Mode
                </button>
            </div>
        </div>
    );
};

export default FocusMode;
