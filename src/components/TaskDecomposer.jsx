import React, { useState } from 'react';

const mockAiDecompose = async (goal) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                goal,
                steps: [
                    { id: 1, text: "Read the project requirements carefully", time: "15 mins", priority: "High", done: false },
                    { id: 2, text: "Gather necessary materials and references", time: "20 mins", priority: "Medium", done: false },
                    { id: 3, text: "Create a rough outline", time: "30 mins", priority: "High", done: false },
                    { id: 4, text: "Complete the first half of the work", time: "1 hour", priority: "High", done: false },
                    { id: 5, text: "Review and refine", time: "45 mins", priority: "Medium", done: false }
                ]
            });
        }, 1800);
    });
};

const TaskDecomposer = () => {
    const [goal, setGoal] = useState("");
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    const generatePlan = async () => {
        if (!goal.trim()) return;
        setLoading(true);
        setPlan(null);
        const result = await mockAiDecompose(goal);
        setPlan(result);
        setLoading(false);
    };

    const toggleStep = (id) => {
        if (!plan) return;
        const newSteps = plan.steps.map(step =>
            step.id === id ? { ...step, done: !step.done } : step
        );
        setPlan({ ...plan, steps: newSteps });
    };

    const completedCount = plan ? plan.steps.filter(s => s.done).length : 0;
    const progress = plan ? (completedCount / plan.steps.length) * 100 : 0;

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h2 className="text-3xl mb-2 text-gradient">Task Breakdown Assistant</h2>
                <p className="text-muted text-lg">Overwhelmed by a large project? Tell us what you need to do, and we'll break it into manageable steps.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Left Column: Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel">
                        <label className="font-heading mb-2 text-lg" style={{ fontWeight: 600, display: 'block' }}>Your Goal</label>
                        <input
                            type="text"
                            className="input-control mb-4"
                            placeholder='e.g., "Finish my history essay" or "Clean the entire house"'
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && generatePlan()}
                            style={{ fontSize: '1.1rem', padding: '1rem' }}
                        />
                        <button className="btn btn-primary" onClick={generatePlan} disabled={loading || !goal.trim()} style={{ fontSize: '1.05rem', padding: '0.75rem 1.5rem', width: '100%' }}>
                            {loading ? '⚙️ Breaking down task...' : '🎯 Create Action Plan'}
                        </button>
                    </div>

                    {loading && (
                        <div className="glass-panel mt-4 flex flex-col items-center justify-center" style={{ minHeight: '200px' }}>
                            <div className="spinner mb-4"></div>
                            <p className="animate-pulse text-muted">Analyzing goal and estimating time...</p>
                        </div>
                    )}

                    {plan && !loading && (
                        <div className="glass-panel animate-fade-in">
                            <h3 className="mb-4">Progress Tracker</h3>
                            <div style={{ background: 'var(--color-border)', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
                                <div style={{
                                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-success))',
                                    height: '100%',
                                    width: `${progress}%`,
                                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}></div>
                            </div>
                            <div className="flex justify-between text-sm font-heading" style={{ fontWeight: 600 }}>
                                <span style={{ color: progress === 100 ? 'var(--color-success)' : 'var(--color-primary)' }}>
                                    {progress === 100 ? '🎉 Goal Complete!' : `${completedCount} of ${plan.steps.length} steps done`}
                                </span>
                                <span className="text-muted">{Math.round(progress)}%</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Results */}
                <div>
                    {!plan && !loading && (
                        <div className="flex flex-col items-center justify-center text-muted glass-panel" style={{ height: '100%', minHeight: '300px', border: '2px dashed var(--color-border)' }}>
                            <span style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📝</span>
                            <p>Your step-by-step action plan will appear here.</p>
                        </div>
                    )}

                    {plan && !loading && (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {plan.steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className="glass-panel"
                                    onClick={() => toggleStep(step.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1.25rem',
                                        cursor: 'pointer',
                                        opacity: step.done ? 0.6 : 1,
                                        transform: step.done ? 'scale(0.98)' : 'scale(1)',
                                        borderLeft: `4px solid ${step.done ? 'var(--color-success)' : step.priority === 'High' ? 'var(--color-danger)' : 'var(--color-warning)'}`,
                                        transition: 'all var(--transition-normal)'
                                    }}
                                >
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        border: `2px solid ${step.done ? 'var(--color-success)' : 'var(--color-text-muted)'}`,
                                        background: step.done ? 'var(--color-success)' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        flexShrink: 0
                                    }}>
                                        {step.done && '✓'}
                                    </div>

                                    <div style={{ flexGrow: 1 }}>
                                        <h4 style={{
                                            fontSize: '1.1rem',
                                            marginBottom: '0.25rem',
                                            textDecoration: step.done ? 'line-through' : 'none',
                                            color: step.done ? 'var(--color-text-muted)' : 'var(--color-text-main)'
                                        }}>
                                            {step.text}
                                        </h4>
                                        <div className="flex gap-4 text-sm text-muted">
                                            <span className="flex items-center gap-1">⏱️ {step.time}</span>
                                            <span className="flex items-center gap-1">
                                                <span style={{ color: step.priority === 'High' ? 'var(--color-danger)' : 'var(--color-warning)' }}>■</span>
                                                {step.priority} Priority
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDecomposer;
