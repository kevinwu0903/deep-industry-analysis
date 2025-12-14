import React from 'react';
import { MatrixData } from '../types';

interface MatrixChartProps {
  data: MatrixData;
}

const COLORS = [
  '#818cf8', // Indigo-400
  '#34d399', // Emerald-400
  '#f472b6', // Pink-400
  '#fbbf24', // Amber-400
  '#22d3ee', // Cyan-400
  '#a78bfa', // Purple-400
];

const MatrixChart: React.FC<MatrixChartProps> = ({ data }) => {
  const { dimensions, companies } = data;
  
  // Chart configuration
  const size = 350;
  const center = size / 2;
  const radius = 120; // Radius of the radar
  const numDims = dimensions.length;
  const angleStep = (Math.PI * 2) / numDims;

  // Helper to calculate coordinates
  const getCoordinates = (value: number, index: number, maxVal: number = 10) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top (-90deg)
    const r = (value / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate grid polygons (background levels 2, 4, 6, 8, 10)
  const renderGrid = () => {
    return [2, 4, 6, 8, 10].map((level) => {
      const points = dimensions.map((_, i) => {
        const { x, y } = getCoordinates(level, i);
        return `${x},${y}`;
      }).join(' ');

      return (
        <polygon
          key={`grid-${level}`}
          points={points}
          fill="none"
          stroke="#334155" // Slate-700
          strokeWidth="1"
          strokeDasharray={level === 10 ? "" : "4 4"}
        />
      );
    });
  };

  // Generate axes lines
  const renderAxes = () => {
    return dimensions.map((label, i) => {
      const { x, y } = getCoordinates(10, i);
      return (
        <line
          key={`axis-${i}`}
          x1={center}
          y1={center}
          x2={x}
          y2={y}
          stroke="#334155"
          strokeWidth="1"
        />
      );
    });
  };

  // Generate labels
  const renderLabels = () => {
    return dimensions.map((label, i) => {
      const { x, y } = getCoordinates(12, i); // Push labels out a bit (scale 12)
      // Adjust text anchor based on position
      const isTop = i === 0;
      const isBottom = Math.abs(x - center) < 5 && y > center;
      const isLeft = x < center;
      
      let textAnchor = "middle";
      if (!isTop && !isBottom) textAnchor = isLeft ? "end" : "start";
      
      // Split long labels if needed (simple logic)
      const displayLabel = label.length > 8 ? label.substring(0, 8) + '..' : label;

      return (
        <text
          key={`label-${i}`}
          x={x}
          y={y + 5} // small vertical adjustment
          textAnchor={textAnchor}
          fill="#94a3b8" // Slate-400
          fontSize="11"
          fontWeight="500"
          className="uppercase tracking-wider"
        >
          {displayLabel}
        </text>
      );
    });
  };

  // Render company data polygons
  const renderDataPolygons = () => {
    return companies.map((company, idx) => {
      const color = COLORS[idx % COLORS.length];
      const points = company.scores.map((score, i) => {
        const { x, y } = getCoordinates(score, i);
        return `${x},${y}`;
      }).join(' ');

      return (
        <g key={`poly-${company.name}`} className="group">
          <polygon
            points={points}
            fill={color}
            fillOpacity="0.2"
            stroke={color}
            strokeWidth="2"
            className="transition-all duration-300 group-hover:fill-opacity-40 group-hover:stroke-width-3"
          />
          {/* Dots at vertices */}
          {company.scores.map((score, i) => {
            const { x, y } = getCoordinates(score, i);
            return (
              <circle
                key={`dot-${company.name}-${i}`}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            );
          })}
        </g>
      );
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-slate-900/40 p-6 rounded-2xl border border-slate-700/50">
      
      {/* The Chart */}
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {renderGrid()}
          {renderAxes()}
          {renderDataPolygons()}
          {renderLabels()}
        </svg>
      </div>

      {/* The Legend / Table */}
      <div className="flex-1 w-full md:w-auto">
        <h4 className="text-white font-semibold mb-4 border-b border-slate-700 pb-2">
          競爭力矩陣分析 (1-10分)
        </h4>
        <div className="space-y-3">
          {companies.map((company, idx) => {
             const color = COLORS[idx % COLORS.length];
             const avg = (company.scores.reduce((a, b) => a + b, 0) / company.scores.length).toFixed(1);
             return (
              <div key={idx} className="flex items-center justify-between text-sm group cursor-default">
                <div className="flex items-center gap-3">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  ></span>
                  <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                    {company.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex gap-1">
                    {company.scores.map((s, i) => (
                      <div key={i} className="w-6 text-center text-xs text-slate-500" title={dimensions[i]}>
                        {s}
                      </div>
                    ))}
                  </div>
                  <span className="text-emerald-400 font-mono font-bold bg-emerald-900/30 px-2 rounded">
                    Avg: {avg}
                  </span>
                </div>
              </div>
             );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex justify-between text-xs text-slate-500 px-2 sm:pl-32">
             {dimensions.map((d, i) => (
               <span key={i} className="w-6 text-center truncate" title={d}>{i+1}</span>
             ))}
          </div>
          <div className="text-[10px] text-slate-600 mt-2 text-center">
             * 圖表數字對應上方維度 1-{dimensions.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixChart;
