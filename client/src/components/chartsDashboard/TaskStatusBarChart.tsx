import React from 'react';

type BarDatum = { label: string; value: number; color?: string; className?: string };

interface TaskStatusBarChartProps {
  title?: string;
  data: BarDatum[];
  maxValue?: number;
}

/**
 * TaskStatusBarChart
 * Compact vertical bar chart for task status counts
 */
const TaskStatusBarChart: React.FC<TaskStatusBarChartProps> = ({ title = 'Task Status Overview', data, maxValue }) => {
  const max = maxValue ?? Math.max(1, ...data.map(d => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/40 rounded shadow-sm">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        {/* Bars container with fixed height so percentage heights render correctly */}
        <div className="flex justify-center gap-6">
          {data.map((d, i) => {
            const barHeight = `${(d.value / max) * 100}%`;
            const barClass = d.className || '';
            const inlineStyle = d.className ? {} : { backgroundColor: d.color || '#e5e7eb' };
            return (
              <div key={i} className="flex flex-col items-center h-32 justify-end">
                <div
                  className={`w-8 rounded-t ${barClass}`}
                  style={{ height: barHeight, ...inlineStyle }}
                  aria-label={`${d.label} ${d.value}`}
                />
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded ${d.className || ''}`} style={!d.className ? { backgroundColor: d.color || '#e5e7eb' } : {}} />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {d.label} • {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskStatusBarChart;


