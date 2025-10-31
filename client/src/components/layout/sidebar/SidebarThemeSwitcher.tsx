import React from 'react';
import SidebarThemeButton from './SidebarThemeButton';

/**
 * Sidebar Theme Switcher Props Interface
 */
interface SidebarThemeSwitcherProps {
  theme: string;
  onThemeChange: (newTheme: string) => void;
}

/**
 * Sidebar Theme Switcher Component
 * Theme selector with Light, Dark, and Brand options
 * Displays active theme state and allows theme switching
 */
const SidebarThemeSwitcher: React.FC<SidebarThemeSwitcherProps> = ({ theme, onThemeChange }) => {
  return (
    <div className="mt-3">
      {/* Theme Label */}
      <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
        Theme
      </div>

      {/* Theme Buttons */}
      <div className="flex items-center space-x-2">
        <SidebarThemeButton
          theme={theme}
          themeValue="light"
          label="Light"
          onClick={() => onThemeChange('light')}
        />
        <SidebarThemeButton
          theme={theme}
          themeValue="dark"
          label="Dark"
          onClick={() => onThemeChange('dark')}
        />
        <SidebarThemeButton
          theme={theme}
          themeValue="brand"
          label="Brand"
          iconColor="var(--accent-from)"
          onClick={() => onThemeChange('brand')}
        />
      </div>
    </div>
  );
};

export default SidebarThemeSwitcher;

