import React from 'react';

/**
 * Sidebar Theme Button Props Interface
 */
interface SidebarThemeButtonProps {
  theme: string;
  themeValue: string;
  label: string;
  iconColor?: string;
  onClick: () => void;
}

/**
 * Sidebar Theme Button Component
 * Individual theme option button in theme switcher
 * Shows active state and hover effects
 */
const SidebarThemeButton: React.FC<SidebarThemeButtonProps> = ({
  theme,
  themeValue,
  label,
  iconColor,
  onClick
}) => {
  const isActive = theme === themeValue;

  return (
    <button
      type="button"
      title={`${label} theme`}
      aria-label={`${label} theme`}
      onClick={onClick}
      className="flex items-center space-x-1.5 px-2 py-1.5 rounded-md text-xs transition-all duration-200"
      style={isActive
        ? { backgroundColor: 'var(--table-header-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }
        : { backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--card-bg)';
        }
      }}
    >
      <span
        className="w-3 h-3 rounded-full"
        style={isActive
          ? { backgroundColor: iconColor || 'var(--bg-base)', boxShadow: '0 0 0 2px var(--accent-ring)' }
          : { backgroundColor: iconColor || 'var(--bg-base)', border: '1px solid var(--border-color)' }}
      />
      <span
        className="text-xs font-medium"
        style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </button>
  );
};

export default SidebarThemeButton;

