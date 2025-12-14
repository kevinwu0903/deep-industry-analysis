import React, { useState } from 'react';
import { AnalysisFormData, AnalysisResult, AppState } from './types';
import { runIndustryAnalysis } from './services/geminiService';
import InputForm from './components/InputForm';
import AnalysisDisplay from './components/AnalysisDisplay';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalysisSubmit = async (data: AnalysisFormData) => {
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    setResult(null);

    try {
      const analysisResult = await runIndustryAnalysis(data);
      setResult(analysisResult);
      setAppState(AppState.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || '分析過程中發生未知錯誤，請稍後再試。');
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-slate-200 selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-100">
                Alpha<span className="text-indigo-400">Trend</span> AI
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono hidden sm:block">
              Powered by Gemini 3 Pro
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {appState === AppState.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center mb-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                掌握產業脈動 <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  獵殺核心飆股
                </span>
              </h1>
              <p className="text-lg text-slate-400">
                結合 Google Search 最新數據與 Gemini 深度推理模型。<br/>
                精準定義分析維度，排除概念股，直擊供應鏈核心。
              </p>
            </div>
            <InputForm onSubmit={handleAnalysisSubmit} isAnalyzing={false} />
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
             <div className="w-24 h-24 relative mb-8">
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin animation-delay-150"></div>
                <div className="absolute inset-4 rounded-full border-b-2 border-cyan-500 animate-spin animation-delay-300"></div>
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">正在進行深度分析...</h2>
             <p className="text-slate-400 max-w-md text-center">
               AI 正在搜尋最新券商報告、定義關鍵維度，並進行供應鏈交叉比對。請稍候，這可能需要一到兩分鐘。
             </p>
             <div className="mt-8 space-y-2 w-full max-w-sm">
                <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                   <div className="h-full bg-indigo-500 animate-progress"></div>
                </div>
             </div>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-2xl max-w-lg text-center">
              <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-2">分析失敗</h3>
              <p className="text-slate-300 mb-6">{errorMsg}</p>
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                重試
              </button>
            </div>
          </div>
        )}

        {appState === AppState.COMPLETED && result && (
          <AnalysisDisplay result={result} onReset={handleReset} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} AlphaTrend AI. 此工具僅供研究參考，不構成投資建議。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
