import React, { useState, useCallback } from 'react';
import { AnalysisFormData } from '../types';

interface InputFormProps {
  onSubmit: (data: AnalysisFormData) => void;
  isAnalyzing: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isAnalyzing }) => {
  const [industry, setIndustry] = useState('');
  const [tech, setTech] = useState('');
  const [market, setMarket] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !tech || !market) return;
    onSubmit({ industry, tech, market, attachment });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-slate-700 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
          建立分析任務
        </h2>
        <p className="text-slate-400 text-sm">
          輸入目標領域與技術，AI 將為您進行深度供應鏈獵殺與護城河分析。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              目標產業 / 技術領域
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="例如：AI 伺服器 EMS"
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              目標市場區域
            </label>
            <input
              type="text"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              placeholder="例如：台灣、全球、北美"
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              關鍵技術標準 / 產品
            </label>
            <input
              type="text"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="例如：輝達 GB200、全固態電解質"
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              附件資料 (選填)
              <span className="text-xs text-slate-500 ml-2">支援圖片或 PDF，供 AI 參考</span>
            </label>
            <div className="relative group">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-900/30 file:text-indigo-400
                  hover:file:bg-indigo-900/50
                  cursor-pointer
                  bg-slate-900/50 rounded-lg border border-slate-600 focus:border-indigo-500
                "
              />
              {attachment && (
                <div className="absolute right-3 top-2.5 text-emerald-400 text-xs flex items-center bg-slate-900/90 px-2 py-0.5 rounded">
                  ✓ 已選取: {attachment.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5
            ${isAnalyzing 
              ? 'bg-slate-700 cursor-not-allowed opacity-75' 
              : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-500/25'
            }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              深度分析中 (可能需要 1-2 分鐘)...
            </span>
          ) : (
            '開始 AI 深度產業分析 🚀'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
