'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
     <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between w-full">
            <span>Theme</span>
            <div className="flex items-center gap-2">
                <Button
                    variant={theme === 'light' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setTheme('light')}
                >
                    <Sun className="h-4 w-4" />
                </Button>
                <Button
                    variant={theme === 'dark' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setTheme('dark')}
                >
                    <Moon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    </DropdownMenuItem>
  );
}
