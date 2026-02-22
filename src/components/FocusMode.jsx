import React, { useState, useEffect } from 'react';

const callGeminiFocusAPI = async (text, apiKey) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `You are a reading assistant for someone who gets easily overwhelmed by long paragraphs. Take the following text and split it into completely separate, logical, easy-to-read sentences. 
    
IMPORTANT: You MUST respond ONLY with a valid JSON array. Output the raw JSON string without markdown blocks.

The JSON MUST be a simple array of strings:
[
  "The first short, readable sentence.",
  "The second short, readable sentence.",
  "The third short, readable sentence."
]

Original Text:
"""
${text}
"""`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1 } })
    });

    if (!response.ok) throw new Error("API failed to connect.");
    const data = await response.json();
    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) throw new Error("AI returned an empty response.");

    resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
        return JSON.parse(resultText);
    } catch (e) {
        throw new Error("AI did not return valid JSON format. Try again.");
    }
};

const FocusMode = () => {
    const [text, setText] = useState("");
    const [sentences, setSentences] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isReading, setIsReading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [apiKey, setApiKey] = useState("");
    const [isEditingKey, setIsEditingKey] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) setApiKey(storedKey);
        else setIsEditingKey(true);
    }, []);

    const saveApiKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey.trim());
            setIsEditingKey(false);
        }
    };

    const startReading = async () => {
        if (!text.trim()) return;
        if (!apiKey) {
            setIsEditingKey(true);
            setError("Please enter your Gemini API key first.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const splitSentences = await callGeminiFocusAPI(text, apiKey);
            if (!Array.isArray(splitSentences) || splitSentences.length === 0) {
                throw new Error("Invalid format returned by AI.");
            }
            setSentences(splitSentences);
            setCurrentIndex(0);
            setIsReading(true);
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred while preparing Focus Mode.");
        } finally {
            setLoading(false);
        }
    };

    const nextSentence = () => {
        if (currentIndex < sentences.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const prevSentence = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const handleKeyDown = (e) => {
        if (isReading) {
            if (e.key === 'ArrowRight') nextSentence();
            if (e.key === 'ArrowLeft') prevSentence();
            if (e.key === 'Escape') setIsReading(false);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isReading, currentIndex, sentences.length]);

    if (isReading) {
        return (
            <div className="animate-fade-in" style={{ height: 'calc(100vh - 5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => setIsReading(false)}
                    style={{ position: 'absolute', top: '0', right: '0', background: 'rgba(255,255,255,0.05)', color: '#e8e8f0', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                    ✕ Exit Focus Mode
                </button>

                <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
                    <div className="text-muted mb-4" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 600 }}>
                        Sentence {currentIndex + 1} of {sentences.length}
                    </div>

                    <div className="glass-panel mb-8" style={{ padding: '4rem 2rem', minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,25,40,0.5)', borderColor: 'rgba(167,139,250,0.3)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)' }}>
                        <p className="cognitive-text animate-fade-in" key={currentIndex} style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1.6, color: '#e8e8f0' }}>
                            {sentences[currentIndex]}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button className="btn btn-secondary" onClick={prevSentence} disabled={currentIndex === 0} style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', color: '#e8e8f0', borderColor: 'rgba(255,255,255,0.1)' }}>
                            ← Previous
                        </button>
                        <button className="btn btn-primary" onClick={nextSentence} disabled={currentIndex === sentences.length - 1} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                            Next →
                        </button>
                    </div>
                    <div className="text-muted mt-4 text-sm">You can also use arrow keys to navigate. Press ESC to exit.</div>

                    <div className="mt-8 flex justify-center gap-2 flex-wrap" style={{ maxWidth: '400px', margin: '2rem auto 0' }}>
                        {sentences.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                style={{
                                    width: '10px', height: '10px', borderRadius: '50%',
                                    background: idx === currentIndex ? '#a78bfa' : 'rgba(255,255,255,0.2)',
                                    transition: 'background var(--transition-fast), transform var(--transition-fast)',
                                    cursor: 'pointer', transform: idx === currentIndex ? 'scale(1.5)' : 'scale(1)'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl mb-2 text-gradient">Focus Mode</h2>
                    <p className="text-muted text-lg">AI intelligently splits complex text into readable chunks to reduce overwhelm.</p>
                </div>

                <div className="card" style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    {isEditingKey ? (
                        <div className="flex gap-2 items-center">
                            <input
                                type="password" placeholder="Enter API Key..."
                                value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                                className="input-control"
                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '220px', background: '#0a0a12', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                            <button className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} onClick={saveApiKey}>Save</button>
                        </div>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <span className="text-sm" style={{ color: '#10B981' }}>✓ API Key Configured</span>
                            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'transparent', color: '#e8e8f0' }} onClick={() => setIsEditingKey(true)}>Change</button>
                        </div>
                    )}
                </div>
            </header>

            {error && (
                <div className="mb-6 p-4 rounded-md" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#FCA5A5' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div className="glass-panel" style={{ maxWidth: '800px', background: 'rgba(20,25,40,0.5)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <label className="font-heading mb-2 text-lg" style={{ fontWeight: 600, display: 'block', color: '#e8e8f0' }}>Text to Read</label>
                <textarea
                    className="input-control mb-6"
                    rows="14"
                    placeholder="Paste the text you want to read here... (Focus Mode will format it for you)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ resize: 'vertical', background: 'rgba(0,0,0,0.2)', color: '#e8e8f0', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <button className="btn btn-primary" onClick={startReading} disabled={loading || !text.trim() || isEditingKey} style={{ fontSize: '1.1rem', padding: '0.75rem 2rem', opacity: (loading || !text.trim() || isEditingKey) ? 0.5 : 1 }}>
                    {loading ? '⚙️ AI Formatting Text...' : '📖 Start Reading Focus Mode'}
                </button>
            </div>
        </div>
    );
};

export default FocusMode;
