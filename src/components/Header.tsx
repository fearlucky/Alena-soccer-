import React from 'react';
import { Menu, Settings, Smartphone, Monitor } from 'lucide-react';

interface HeaderProps {
  title: string;
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
  viewMode: 'mobile' | 'responsive';
  onToggleViewMode: () => void;
  badgeCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onOpenSidebar,
  onOpenSettings,
  viewMode,
  onToggleViewMode,
  badgeCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d47a1] text-white shadow-md select-none transition-colors">
      <div className="flex items-center justify-between h-14 px-3 sm:px-4">
        {/* Left: Hamburger Menu */}
        <button
          onClick={onOpenSidebar}
          aria-label="Buka Menu"
          className="p-2 -ml-1 text-white hover:bg-white/10 active:bg-white/20 rounded-full transition-colors flex items-center justify-center relative"
        >
          <Menu className="w-6 h-6" />
          {badgeCount && badgeCount > 0 ? (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-[#0d47a1]" />
          ) : null}
        </button>

        {/* Center: Title matching Griyo Pos exact typography */}
        <h1 className="text-lg sm:text-xl font-medium tracking-normal text-white truncate px-2 flex-1">
          {title}
        </h1>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* View Mode Switcher (Smartphone preview vs full desktop layout) */}
          <button
            onClick={onToggleViewMode}
            title={viewMode === 'mobile' ? 'Beralih ke Layar Penuh' : 'Beralih ke Mode HP (Mobile Frame)'}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20 rounded-full transition-colors"
          >
            {viewMode === 'mobile' ? (
              <Monitor className="w-5 h-5" />
            ) : (
              <Smartphone className="w-5 h-5" />
            )}
          </button>

          {/* Settings Gear */}
          <button
            onClick={onOpenSettings}
            aria-label="Pengaturan"
            className="p-2 text-white hover:bg-white/10 active:bg-white/20 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
