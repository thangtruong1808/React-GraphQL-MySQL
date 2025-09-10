import React from 'react';

/**
 * Simple Chart Component
 * A lightweight chart component for displaying data visualizations
 * Uses CSS and SVG for rendering without external dependencies
 */

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface SimpleChartProps {
  data: ChartData[];
  title: string;
  type?: 'bar' | 'pie' | 'progress';
  maxValue?: number;
  className?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  title,
  type = 'bar',
  maxValue,
  className = ''
}) => {
  // Calculate maximum value for scaling
  const calculatedMaxValue = maxValue || Math.max(...data.map(item => item.value));

  // Calculate total for pie chart
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Render bar chart
  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="w-20 text-sm text-gray-600 truncate mr-3">
            {item.label}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
            <div
              className="h-4 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(item.value / calculatedMaxValue) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          <div className="w-12 text-sm font-medium text-gray-900 text-right ml-3">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );

  // Render pie chart
  const renderPieChart = () => {
    let cumulativePercentage = 0;

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;

            const x1 = 16 + 14 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 16 + 14 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 16 + 14 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 16 + 14 * Math.sin((endAngle * Math.PI) / 180);

            const largeArcFlag = percentage > 50 ? 1 : 0;
            const pathData = [
              `M 16 16`,
              `L ${x1} ${y1}`,
              `A 14 14 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');

            cumulativePercentage += percentage;

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                className="transition-all duration-300 hover:opacity-80"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>
      </div>
    );
  };

  // Render progress chart
  const renderProgressChart = () => (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <span className="text-sm text-gray-600">{item.value}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(item.value, 100)}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  // Render legend
  const renderLegend = () => (
    <div className="mt-4 space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center text-sm">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-gray-600">{item.label}</span>
          <span className="ml-auto font-medium text-gray-900">{item.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {type === 'bar' && renderBarChart()}
      {type === 'pie' && (
        <div>
          {renderPieChart()}
          {renderLegend()}
        </div>
      )}
      {type === 'progress' && renderProgressChart()}
    </div>
  );
};

export default SimpleChart;
