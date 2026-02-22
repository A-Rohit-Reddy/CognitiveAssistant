import React, { useState } from 'react';

const mockAiSimplify = async (text) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                summary: "This text can be simplified to make it more cognitively accessible.",
                bulletPoints: [
                    "Complex vocabulary is replaced with common words.",
                    "Long paragraphs are broken down into short sentences.",
                    "Visual structure is added to prevent mental overload."
                ],
                simplifiedText: "People with cognitive challenges often find dense text overwhelming. By using simple language, short sentences, and bullet points, we can make reading a lot easier. This helps users remember facts and stay focused."
            });
        }, 1800);
    });
};

const SmartSimplifier = () => {
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSimplify = async () => {
        if (!inputText.trim()) return;
        setLoading(true);
        setResult(null);
        const res = await mockAiSimplify(inputText);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h2 className="text-3xl mb-2 text-gradient">Smart Text Simplifier</h2>
                <p className="text-muted text-lg">Paste complex text below to convert it into easy-to-read, structured information.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Input Region */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label className="font-heading mb-2 text-lg" style={{ fontWeight: 600 }}>Complex Text Input</label>
                    <textarea
                        className="input-control mb-4"
                        rows="12"
                        placeholder="Paste your difficult text here... (e.g., legal documents, medical reports, dense academic papers)"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        style={{ resize: 'vertical', fontFamily: 'var(--font-body)', minHeight: '200px' }}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleSimplify}
                        disabled={loading || !inputText.trim()}
                        style={{ alignSelf: 'flex-start', opacity: (loading || !inputText.trim()) ? 0.7 : 1 }}
                    >
                        {loading ? '✨ AI is simplifying...' : '✨ Simplify Now'}
                    </button>
                </div>

                {/* Output Region */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label className="font-heading mb-4 text-lg" style={{ fontWeight: 600 }}>Simplified Output</label>

                    {!result && !loading && (
                        <div className="flex flex-col items-center justify-center text-muted" style={{ flexGrow: 1, minHeight: '250px', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}>📄</span>
                            <p>Your simplified text will appear here.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center" style={{ flexGrow: 1, minHeight: '250px' }}>
                            <div className="spinner mb-4"></div>
                            <p className="animate-pulse" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Analyzing cognitive complexity...</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="animate-fade-in" style={{ flexGrow: 1 }}>
                            <div className="mb-6 card" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                                <h4 className="mb-2" style={{ color: 'var(--color-primary)' }}>💡 Quick Summary</h4>
                                <p className="cognitive-text" style={{ fontSize: '1.2rem', fontWeight: 500 }}>{result.summary}</p>
                            </div>

                            <div className="mb-6 card" style={{ background: 'rgba(236, 72, 153, 0.05)', borderColor: 'rgba(236, 72, 153, 0.2)' }}>
                                <h4 className="mb-2" style={{ color: 'var(--color-secondary)' }}>📌 Key Takeaways</h4>
                                <ul style={{ paddingLeft: '1.5rem', listStyleType: 'square' }} className="cognitive-text">
                                    {result.bulletPoints.map((bp, idx) => (
                                        <li key={idx} className="mb-2">{bp}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="card" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                <h4 className="mb-2" style={{ color: 'var(--color-success)' }}>📖 Easy Reading Version</h4>
                                <p className="cognitive-text">{result.simplifiedText}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartSimplifier;
