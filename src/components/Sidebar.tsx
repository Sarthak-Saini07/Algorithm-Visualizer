import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, BrainCircuit, Library, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Workspace', path: '/app' },
  { icon: Library, label: 'Algorithms', path: '/app/algorithms' },
  { icon: BrainCircuit, label: 'AI Copilot', path: '/app/ai' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  return (
    <aside
      className={cn(
        "h-screen fixed left-0 top-0 z-40 border-r border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
        <div className={cn("flex items-center gap-2 overflow-hidden transition-all duration-300", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
          <Activity className="w-5 h-5 text-primary shrink-0" />
          <span className="font-bold tracking-tight whitespace-nowrap">Algo<span className="text-primary">Viz</span></span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", "group-hover:text-primary")} />
            <span className={cn(
              "font-medium text-sm whitespace-nowrap transition-all duration-300",
              collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"
            )}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
            collapsed ? "px-0 justify-center" : "px-3 gap-3"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Exit Workspace</span>}
        </Button>
      </div>
    </aside>
  );
};
