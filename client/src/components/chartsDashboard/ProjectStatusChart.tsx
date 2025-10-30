import React from 'react';

type StatusDatum = { label: string; value: number; color: string };

interface ProjectStatusChartProps {
  title?: string;
  data: StatusDatum[];
}

/**
 * ProjectStatusChart
 * Compact segmented bar representing project status distribution
 */
const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ title = 'Project Status Distribution', data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded shadow-sm">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="w-full h-4 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex w-full h-full">
            {data.map((d, i) => (
              <div
                key={i}
                className="h-full" 
                style={{ width: `${(d.value / total) * 100}%`, backgroundColor: d.color }}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: d.color }} />
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

export default ProjectStatusChart;


