
import React from 'react';
import { Regulator, AppView } from '../types';

interface Props {
  selectedRegulators: Regulator[];
  onToggleRegulator: (reg: Regulator) => void;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<Props> = ({ selectedRegulators, onToggleRegulator, currentView, onViewChange }) => {
  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white min-h-screen p-6 shrink-0 relative flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          ReguWatch
        </h1>
        <p className="text-slate-400 text-[10px] mt-1 font-medium tracking-widest uppercase">Canada Compliance Hub</p>
      </div>

      <div className="space-y-8 flex-1">
        <nav className="space-y-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Dashboard</h2>
          <button 
            onClick={() => onViewChange('feed')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentView === 'feed' ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Live Monitor
          </button>
          <button 
            onClick={() => onViewChange('templates')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentView === 'templates' ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Template Analysis
          </button>
        </nav>

        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Tracked Regulators</h2>
          <div className="space-y-2.5">
            {Object.values(Regulator).map((reg) => (
              <label key={reg} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={selectedRegulators.includes(reg)}
                    onChange={() => onToggleRegulator(reg)}
                  />
                  <div className="w-5 h-5 bg-slate-800 border border-slate-700 rounded peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors"></div>
                  <svg className="w-3.5 h-3.5 text-white absolute left-0.5 top-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`ml-3 text-xs font-medium transition-colors ${selectedRegulators.includes(reg) ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  {reg}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-slate-300 font-medium tracking-tight">Free Monitoring Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
