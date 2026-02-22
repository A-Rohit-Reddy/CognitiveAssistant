import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SmartSimplifier from './components/SmartSimplifier';
import FocusMode from './components/FocusMode';
import MemoryAssistant from './components/MemoryAssistant';
import TaskDecomposer from './components/TaskDecomposer';
import ReadingCompanion from './components/ReadingCompanion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'simplifier' && <SmartSimplifier />}
        {activeTab === 'focus' && <FocusMode />}
        {activeTab === 'memory' && <MemoryAssistant />}
        {activeTab === 'tasks' && <TaskDecomposer />}
        {activeTab === 'companion' && <ReadingCompanion />}
      </main>
    </div>
  );
}

export default App;
