'use client';

import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Moon, Sun, Menu, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Navigation items for header
const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Pomodoro', href: '/pomodoro' },
  { label: 'Tasks', href: '/tasks' },
  { label: 'Stats', href: '/stats' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-center">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and brand name */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Timer className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">NorthHack</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link to={item.href} className="no-underline">
                  <div
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === item.href && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {item.label}
                  </div>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {/* Theme toggle button */}
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="px-2 py-6">
                {/* Mobile logo */}
                <Link to="/" className="flex items-center mb-6" onClick={() => setOpen(false)}>
                  <Timer className="h-6 w-6 text-primary mr-2" />
                  <span className="font-bold text-xl">NorthHack</span>
                </Link>

                {/* Mobile navigation links */}
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'flex items-center p-2 rounded-md transition-colors',
                        location.pathname === item.href
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-foreground/60 hover:text-foreground hover:bg-accent/50'
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
