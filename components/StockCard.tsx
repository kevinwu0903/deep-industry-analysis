import React, { useState, useEffect } from 'react';
import { StockInfo } from '../types';

interface StockCardProps {
  stock: StockInfo;
  highlight?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({ stock, highlight = false }) => {
  const [livePrice, setLivePrice] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine Yahoo Finance URL for the link
  const getYahooUrl = (symbol: string) => {
    // Yahoo TW handles both .TW, .TWO and US stocks (NVDA) gracefully
    return `https://tw.stock.yahoo.com/quote/${symbol}`;
  };

  const url = getYahooUrl(stock.symbol);

  // Effect to fetch real-time price
  useEffect(() => {
    const fetchLivePrice = async () => {
      if (!stock.symbol) return;
      
      setIsLoading(true);
      try {
        // Yahoo Finance API endpoint
        const yahooApiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${stock.symbol}?range=1d&interval=1d&lang=en`;
        // Use a public CORS proxy to bypass browser restrictions for this demo
        // Note: In a production app, this should be done via a backend server.
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooApiUrl)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const meta = data?.chart?.result?.[0]?.meta;
        
        if (meta && meta.regularMarketPrice) {
          setLivePrice(meta.regularMarketPrice.toString());
          // Calculate change if previous close is available
          if (meta.previousClose) {
            setPriceChange(meta.regularMarketPrice - meta.previousClose);
          }
        }
      } catch (error) {
        console.warn(`Could not fetch live price for ${stock.symbol}`, error);
        // Fallback silently to the static price provided by AI
      } finally {
        setIsLoading(false);
      }
    };

    fetchLivePrice();
  }, [stock.symbol]);

  // Determine color based on price change (Taiwan style: Red = Up, Green = Down)
  // But to keep consistent with the dark theme, we use:
  // Red (Rose) for Up, Green (Emerald) for Down/Stable, or standard Slate
  const getPriceColor = () => {
    if (priceChange === null) return 'text-emerald-400';
    if (priceChange > 0) return 'text-rose-400'; // Up
    if (priceChange < 0) return 'text-emerald-400'; // Down
    return 'text-slate-200';
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group block p-4 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 relative overflow-hidden ${
        highlight 
          ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/50 shadow-indigo-500/20' 
          : 'bg-slate-800/50 border-slate-700 hover:border-indigo-400 hover:bg-slate-800'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors flex items-center gap-2">
            {stock.name}
          </h3>
          <span className="inline-block bg-slate-900 text-xs font-mono text-slate-400 px-2 py-0.5 rounded mt-1 border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
            {stock.symbol}
          </span>
        </div>
        
        {/* Price Display Section */}
        <div className="text-right min-h-[44px]">
          {isLoading ? (
            <div className="flex flex-col items-end">
              <div className="h-5 w-16 bg-slate-700/50 rounded animate-pulse mb-1"></div>
              <span className="text-[10px] text-slate-500">更新中...</span>
            </div>
          ) : (
            <>
              <div className={`text-lg font-bold font-mono ${getPriceColor()} flex items-center justify-end gap-1`}>
                 {livePrice ? livePrice : stock.price}
                 {livePrice && (
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                   </span>
                 )}
              </div>
              <p className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                {livePrice ? 'Yahoo 即時' : 'AI 參考價'}
                {priceChange !== null && (
                   <span className={priceChange > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                     {priceChange > 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}
                   </span>
                )}
              </p>
            </>
          )}
        </div>
      </div>
      
      <p className="text-sm text-slate-300 leading-relaxed opacity-90 border-t border-slate-700/50 pt-3 mt-2">
        {stock.reason}
      </p>
      
      <div className="mt-3 flex items-center text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>前往 Yahoo 奇摩股市查看詳情</span>
        <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
};

export default StockCard;