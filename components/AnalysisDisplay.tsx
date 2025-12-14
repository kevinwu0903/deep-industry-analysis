import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';
import StockCard from './StockCard';
import MatrixChart from './MatrixChart';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-700 pb-6">
        <h2 className="text-3xl font-bold text-slate-100">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            AI 深度分析報告
          </span>
        </h2>
        <button 
          onClick={onReset}
          className="px-6 py-2 rounded-lg border border-slate-600 hover:bg-slate-800 text-slate-300 transition-colors text-sm font-medium"
        >
          ← 新的分析
        </button>
      </div>

      {/* 2. Key Players (Stock Cards) */}
      {result.identifiedStocks.length > 0 && (
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            核心玩家 & 潛力股
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.identifiedStocks.map((stock, idx) => (
              <StockCard 
                key={idx} 
                stock={stock} 
                highlight={idx === result.identifiedStocks.length - 1} // Highlight the last one as potential "top pick"
              />
            ))}
          </div>
          <div className="mt-3 text-right">
             <span className="text-xs text-slate-500">* 資料來源：AI 綜合分析與網路檢索，點擊卡片可前往 Yahoo 股市查看即時行情。</span>
          </div>
        </div>
      )}

      {/* 3. Matrix Analysis Chart */}
      {result.matrixData && result.matrixData.companies.length > 0 && (
        <div className="bg-slate-800/40 backdrop-blur rounded-2xl p-6 border border-slate-700 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            深度矩陣分析 (Matrix Analysis)
          </h3>
          <MatrixChart data={result.matrixData} />
        </div>
      )}

      {/* 4. Markdown Content */}
      <div className="bg-slate-800/40 backdrop-blur rounded-2xl p-8 md:p-10 border border-slate-700 shadow-xl">
        <article className="prose prose-invert prose-lg max-w-none">
          {/* Customizing Markdown Render */}
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-indigo-300 mt-8 mb-4 border-b border-indigo-500/30 pb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-emerald-300 mt-6 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-medium text-blue-200 mt-4 mb-2" {...props} />,
              strong: ({node, ...props}) => <strong className="text-amber-300 font-bold" {...props} />,
              ul: ({node, ...props}) => <ul className="space-y-2 my-4 list-disc list-outside ml-6" {...props} />,
              li: ({node, ...props}) => <li className="text-slate-300" {...props} />,
              p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed my-3" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-indigo-900/20 italic text-slate-400" {...props} />,
              table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full divide-y divide-slate-700 border border-slate-700 rounded-lg" {...props} /></div>,
              th: ({node, ...props}) => <th className="px-4 py-3 bg-slate-900 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700" {...props} />,
              td: ({node, ...props}) => <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300 border-b border-slate-700/50" {...props} />,
            }}
          >
            {result.markdownContent}
          </ReactMarkdown>
        </article>
      </div>

    </div>
  );
};

export default AnalysisDisplay;
