import React, { useState } from 'react';

const mockAiExtract = async (text) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, type: 'Definition', title: 'Cognitive Overload', content: 'A situation where too much information is presented at once, making it hard to process or remember.' },
                { id: 2, type: 'Key Point', title: 'Accessibility Impact', content: 'Structured text helps users with ADHD and Dyslexia read and comprehend up to 40% faster.' },
                { id: 3, type: 'Rule', title: 'Working Memory', content: 'Human working memory can typically hold roughly 4 to 7 items at any given time.' }
            ]);
        }, 1500);
    });
};

const Flashcard = ({ card }) => {
    const [flipped, setFlipped] = useState(false);

    // Use appropriate tag colors based on type
    const typeColor = card.type === 'Definition' ? 'var(--color-primary)'
        : card.type === 'Key Point' ? 'var(--color-success)'
            : 'var(--color-secondary)';

    return (
        <div
            style={{
                perspective: '1000px',
                height: '280px',
                width: '100%',
                cursor: 'pointer'
            }}
            onClick={() => setFlipped(!flipped)}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}>
                {/* Front */}
                <div className="glass-panel" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    border: '2px solid rgba(99, 102, 241, 0.1)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '12px', background: `${typeColor}1A`, color: typeColor }}>
                        {card.type}
                    </div>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-main)', padding: '0 1rem' }}>{card.title}</h3>
                    <div className="text-muted mt-6 text-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>👆</span> Click to reveal
                    </div>
                </div>

                {/* Back */}
                <div className="glass-panel" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: 'var(--color-surface)',
                    border: `2px solid ${typeColor}`,
                    boxShadow: `0 10px 25px -5px ${typeColor}33`
                }}>
                    <p className="cognitive-text" style={{ fontSize: '1.2rem', padding: '0 1rem' }}>{card.content}</p>
                </div>
            </div>
        </div>
    );
};

const MemoryAssistant = () => {
    const [text, setText] = useState("");
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    const generateCards = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setCards([]);
        const result = await mockAiExtract(text);
        setCards(result);
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h2 className="text-3xl mb-2 text-gradient">Memory Assistant</h2>
                <p className="text-muted text-lg">Extract key definitions and important points into interactive flashcards.</p>
            </header>

            <div className="glass-panel mb-8" style={{ maxWidth: '800px' }}>
                <label className="font-heading mb-2 text-lg" style={{ fontWeight: 600, display: 'block' }}>Study Material</label>
                <textarea
                    className="input-control mb-4"
                    rows="6"
                    placeholder="Paste your notes, articles, or lessons here... We will extract the most important facts for you to remember."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ resize: 'vertical' }}
                />
                <button className="btn btn-primary" onClick={generateCards} disabled={loading || !text.trim()} style={{ fontSize: '1.05rem', padding: '0.75rem 1.5rem' }}>
                    {loading ? '🧠 Extracting Knowledge...' : '✨ Generate Memory Cards'}
                </button>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center p-8 mt-8">
                    <div className="spinner mb-4"></div>
                    <p className="animate-pulse" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Finding key information...</p>
                </div>
            )}

            {cards.length > 0 && !loading && (
                <div className="animate-fade-in">
                    <h3 className="mb-6 text-2xl">Your Memory Cards</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {cards.map((card, idx) => (
                            <div key={card.id} className="animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                                <Flashcard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryAssistant;
