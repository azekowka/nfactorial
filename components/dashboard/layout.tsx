'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingCart,
  Users2
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { User } from './user';
import Providers from './providers';
import { NavItem } from './nav-item';
import { SearchInput } from './search';
import { VercelLogo } from '../icons';
import { ThemeToggle } from '../theme-toggle';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav expanded={expanded} setExpanded={setExpanded} />
        <div className={cn(
          "flex flex-col sm:gap-4 sm:py-4 transition-all duration-300",
          expanded ? "sm:pl-64" : "sm:pl-14"
        )}>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <DashboardBreadcrumb />
            <SearchInput />
            <ThemeToggle />
            <User />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
        {/* <Analytics /> */}
      </main>
    </Providers>
  );
}

function DesktopNav({ expanded, setExpanded }: { expanded: boolean; setExpanded: (value: boolean) => void }) {
  const navRef = useRef<HTMLElement>(null);
  
  const handleMouseEnter = () => {
    setExpanded(true);
  };
  
  const handleMouseLeave = () => {
    setExpanded(false);
  };

  return (
    <aside 
      ref={navRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-14"
      )}
    >
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 mt-2">
        <Link
          href="/dashboard"
          className={cn(
            "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base",
            expanded && "w-full rounded-lg justify-start px-3"
          )}
        >
          <VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />
          {expanded && <span className="ml-2"></span>}
        </Link>

        <ExpandableNavItem expanded={expanded} href="/dashboard" label="Dashboard">
          <Home className="h-5 w-5" />
        </ExpandableNavItem>

        <ExpandableNavItem expanded={expanded} href="#" label="Orders">
          <ShoppingCart className="h-5 w-5" />
        </ExpandableNavItem>

        <ExpandableNavItem expanded={expanded} href="/dashboard/#" label="Products">
          <Package className="h-5 w-5" />
        </ExpandableNavItem>

        <ExpandableNavItem expanded={expanded} href="/dashboard/ai" label="Customers">
          <Users2 className="h-5 w-5" />
        </ExpandableNavItem>

        <ExpandableNavItem expanded={expanded} href="#" label="Analytics">
          <LineChart className="h-5 w-5" />
        </ExpandableNavItem>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        {expanded ? (
          <Link
            href="#"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        )}
      </nav>
    </aside>
  );
}

function ExpandableNavItem({
  expanded,
  href,
  label,
  children
}: {
  expanded: boolean;
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  if (expanded) {
    return (
      <Link
        href={href}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
      >
        {children}
        <span>{label}</span>
      </Link>
    );
  }
  
  return (
    <NavItem href={href} label={label}>
      {children}
    </NavItem>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Vercel</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users2 className="h-5 w-5" />
            Customers
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Products</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>All Products</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}