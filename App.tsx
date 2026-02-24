
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import UpdateCard from './components/UpdateCard';
import { Regulator, RegUpdate, TemplateAnalysis, AppView } from './types';
import { INITIAL_UPDATES } from './constants';
import { fetchLatestUpdatesFree as fetchLatestUpdates, analyzeTemplateFree as analyzeTemplate } from './services/freeService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('feed');
  const [selectedRegulators, setSelectedRegulators] = useState<Regulator[]>([Regulator.FSRA, Regulator.CIRO, Regulator.CSA]);
  const [updates, setUpdates] = useState<RegUpdate[]>(INITIAL_UPDATES);
  const [loading, setLoading] = useState(false);
  const [templateText, setTemplateText] = useState('');
  const [analysis, setAnalysis] = useState<TemplateAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleToggleRegulator = (reg: Regulator) => {
    setSelectedRegulators(prev =>
      prev.includes(reg) ? prev.filter(r => r !== reg) : [...prev, reg]
    );
  };

  const handleRefresh = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Use Gemini's search tool to find updates for FREE (no paid regulatory API)
      const newUpdates = await fetchLatestUpdates(selectedRegulators);
      if (newUpdates && newUpdates.length > 0) {
        setUpdates(newUpdates);
      } else {
        console.warn("No updates found in search response");
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!templateText) return;
    setAnalyzing(true);
    const updateSummary = updates.map(u => `${u.regulator}: ${u.title}`).join(' | ');
    const result = await analyzeTemplate(templateText, updateSummary);
    setAnalysis(result);
    setAnalyzing(false);
  };

  const statusColors = {
    'Compliant': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    'At Risk': 'text-red-600 bg-red-50 border-red-100',
    'Needs Review': 'text-amber-600 bg-amber-50 border-amber-100'
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedRegulators={selectedRegulators}
        onToggleRegulator={handleToggleRegulator}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {currentView === 'feed' ? (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Regulatory Feed</h2>
                <p className="text-slate-500 text-sm">Real-time updates from Canadian financial regulators</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                Fetch Latest
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {updates.map(update => (
                <UpdateCard key={update.id} update={update} />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Template Auditor</h2>
              <p className="text-slate-500 text-sm">Analyze your documents against recent regulatory changes</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Paste Template Content</label>
              <textarea
                className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 font-mono text-sm mb-6 transition-all"
                placeholder="Paste the text from your policy, contract, or customer communication here..."
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
              />

              <button
                onClick={handleAnalyze}
                disabled={analyzing || !templateText}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {analyzing ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )}
                Run Compliance Audit
              </button>
            </div>

            {analysis && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-6 rounded-2xl border ${statusColors[analysis.status as keyof typeof statusColors]}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl font-bold uppercase tracking-tight">{analysis.status}</span>
                  </div>
                  <p className="font-medium text-slate-800 mb-6">{analysis.summary}</p>

                  {analysis.suggestedChanges.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Required Actions</h4>
                      {analysis.suggestedChanges.map((change, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white/50 p-3 rounded-lg border border-black/5 text-sm">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                          <span className="text-slate-800">{change}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;