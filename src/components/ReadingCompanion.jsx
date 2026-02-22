import React, { useState, useRef } from 'react';

const mockAiExplain = async (text) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`"${text}" typically means... [Simulated AI Explanation]. In this context, it refers to the cognitive load placed on a user.`);
        }, 1000);
    });
};

const mockAiChat = async (question) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`That's a great question! Based on this document, the answer is that structured text helps reduce overwhelm. (Simulated AI Response)`);
        }, 1200);
    });
};

const ReadingCompanion = () => {
    const [documentText, setDocumentText] = useState("Accessibility in digital design is not just about screen readers. Cognitive accessibility is a crucial aspect often overlooked. Users with ADHD, Dyslexia, and Autism Spectrum Conditions require specific design patterns to navigate and understand content effectively.\n\nCognitive overload occurs when too much information is presented at once. To mitigate this, interfaces should employ progressive disclosure, clear typography, and simplified language.\n\nFurthermore, providing alternative formats, such as audio readings or visual diagrams, can significantly enhance comprehension for neurodivergent users.");

    const [selectedText, setSelectedText] = useState("");
    const [explanation, setExplanation] = useState("");
    const [loadingExp, setLoadingExp] = useState(false);

    const [messages, setMessages] = useState([{ role: 'ai', content: 'Hi! I am your AI Reading Companion. Highlight any text on the left to get an instant explanation, or ask me a question about the document.' }]);
    const [chatInput, setChatInput] = useState("");
    const [loadingChat, setLoadingChat] = useState(false);

    const textRef = useRef(null);

    const handleTextSelection = async () => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text && text.length > 3) {
            setSelectedText(text);
            setLoadingExp(true);
            setExplanation("");
            const result = await mockAiExplain(text);
            setExplanation(result);
            setLoadingExp(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatInput("");
        setLoadingChat(true);

        const response = await mockAiChat(userMsg);
        setMessages(prev => [...prev, { role: 'ai', content: response }]);
        setLoadingChat(false);
    };

    return (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 5rem)', display: 'flex', flexDirection: 'column' }}>
            <header className="mb-6 flex-shrink-0">
                <h2 className="text-3xl mb-2 text-gradient">AI Reading Companion</h2>
                <p className="text-muted text-lg">Read documents with a helpful AI by your side to explain complex terms and answer questions.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', flexGrow: 1, minHeight: 0 }}>

                {/* Left: Document View */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-heading text-xl">Document Reader</h3>
                        <span className="text-xs text-muted" style={{ background: 'var(--color-bg)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Highlight text to explain</span>
                    </div>
                    <div
                        ref={textRef}
                        onMouseUp={handleTextSelection}
                        onKeyUp={handleTextSelection}
                        className="cognitive-text"
                        style={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            padding: '1rem',
                            background: 'var(--color-surface)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            whiteSpace: 'pre-wrap',
                            fontSize: '1.2rem',
                            lineHeight: 1.8
                        }}
                    >
                        {documentText}
                    </div>

                    <div className="mt-4 text-sm text-muted">
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => setDocumentText("")}>Clear Document</button>
                        <span className="ml-4">You can paste your own text into the reader box above. Wait, to edit, double-click! (Mock functionality for now).</span>
                    </div>
                </div>

                {/* Right: AI Companion Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}>

                    {/* Explanation Tooltip Area */}
                    <div className="glass-panel text-sm" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-primary)' }}>
                        <h4 className="mb-2 flex items-center gap-2 text-primary">
                            <span>🔍</span> Instant Explanation
                        </h4>
                        {!selectedText && !loadingExp && <p className="text-muted italic">Highlight text in the document...</p>}

                        {loadingExp && (
                            <div className="flex items-center gap-2">
                                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                <span className="text-muted">Explaining...</span>
                            </div>
                        )}

                        {explanation && !loadingExp && (
                            <div className="animate-fade-in">
                                <div className="mb-2" style={{ padding: '0.25rem 0.5rem', background: 'var(--color-bg)', borderRadius: '4px', fontStyle: 'italic', display: 'inline-block' }}>
                                    "{selectedText.length > 40 ? selectedText.substring(0, 40) + '...' : selectedText}"
                                </div>
                                <p>{explanation}</p>
                            </div>
                        )}
                    </div>

                    {/* Chat Interface */}
                    <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem', overflow: 'hidden' }}>
                        <h4 className="mb-4 flex items-center gap-2">
                            <span>💬</span> Document Q&A
                        </h4>

                        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    background: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-bg)',
                                    color: msg.role === 'user' ? 'white' : 'var(--color-text-main)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-lg)',
                                    borderBottomRightRadius: msg.role === 'user' ? 0 : 'var(--radius-lg)',
                                    borderBottomLeftRadius: msg.role === 'ai' ? 0 : 'var(--radius-lg)',
                                    maxWidth: '85%',
                                    fontSize: '0.95rem'
                                }}>
                                    {msg.content}
                                </div>
                            ))}
                            {loadingChat && (
                                <div style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
                                    <span className="animate-pulse">Assistant is typing...</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2" style={{ marginTop: 'auto' }}>
                            <input
                                type="text"
                                className="input-control"
                                placeholder="Ask a question..."
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                style={{ padding: '0.5rem 1rem' }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleSendMessage}
                                disabled={!chatInput.trim() || loadingChat}
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                Send
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReadingCompanion;
