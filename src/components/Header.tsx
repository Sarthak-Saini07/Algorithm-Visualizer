import React from 'react';
import { Sun, Moon, Github, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '../state/store';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  React.useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <header className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/50 text-primary glow-primary flex items-center justify-center transition-all duration-300 hover:scale-105">
            <span className="font-bold text-lg font-mono tracking-tighter">&lt;A/&gt;</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Algorithm Visualizer</h1>
            <p className="text-xs text-muted-foreground font-mono">Learn algorithms step by step_</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <a href="#docs">
              <BookOpen className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};
