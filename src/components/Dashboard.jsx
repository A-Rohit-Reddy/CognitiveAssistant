import React from 'react';

const Dashboard = ({ setActiveTab }) => {
    const cards = [
        { id: 'simplifier', title: 'Smart Simplifier', desc: 'Convert complex text to simple bullet points.', icon: '✨', color: 'var(--color-primary)' },
        { id: 'focus', title: 'Focus Mode', desc: 'Read one sentence at a time to reduce overwhelm.', icon: '📖', color: 'var(--color-secondary)' },
        { id: 'memory', title: 'Memory Assistant', desc: 'Extract key info to quick memory cards.', icon: '🧠', color: 'var(--color-success)' },
        { id: 'tasks', title: 'Task Breakdown', desc: 'AI splits your goals into small steps.', icon: '✅', color: 'var(--color-warning)' },
        { id: 'companion', title: 'Reading Companion', desc: 'Instant explanations while reading documents.', icon: '🤖', color: 'var(--color-danger)' },
    ];

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl mb-2">Welcome to your <span className="text-gradient">Cognitive Assistant</span></h1>
                <p className="text-muted text-lg">Reducing mental overload with AI-powered personalized formatting.</p>
            </header>

            <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className="glass-panel animate-fade-in"
                        style={{ cursor: 'pointer', animationDelay: `${index * 100}ms` }}
                        onClick={() => setActiveTab(card.id)}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{card.icon}</div>
                        <h3 style={{ marginBottom: '0.5rem', color: card.color }}>{card.title}</h3>
                        <p className="text-muted">{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
