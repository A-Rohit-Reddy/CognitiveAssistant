import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'simplifier', label: 'Smart Simplifier', icon: '✨' },
        { id: 'focus', label: 'Focus Mode', icon: '📖' },
        { id: 'memory', label: 'Memory Assistant', icon: '🧠' },
        { id: 'tasks', label: 'Task Breakdown', icon: '✅' },
        { id: 'companion', label: 'Reading Companion', icon: '🤖' },
    ];

    return (
        <aside className="sidebar animate-fade-in">
            <div className="sidebar-logo">
                <span style={{ fontSize: '2rem' }}>🌐</span>
                <span>Sense-Align</span>
            </div>
            <nav className="nav-menu">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>
            <div className="mt-8 text-sm text-muted text-center">
                Cognitive Assistant
            </div>
        </aside>
    );
};

export default Sidebar;
