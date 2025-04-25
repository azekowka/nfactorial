"use client";
import * as React from 'react'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { ThemeToggle } from '@/./components/theme-toggle'
import { useState } from "react";
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function NavbarDemo() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full py-4 relative">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <SignedOut>
              <NavbarButton href="/sign-in" variant="secondary">Login</NavbarButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <div className={cn(
              "inline-flex items-center justify-center rounded-md p-2",
              "text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
              "hover:bg-neutral-100 dark:hover:bg-neutral-800",
              "transition-colors focus:outline-none",
              "relative"
            )}>
              <ThemeToggle />
            </div>          
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <SignedOut>
                <NavbarButton 
                  href="/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <div className={cn(
                "flex items-center justify-center rounded-md p-2",
                "text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                "transition-colors focus:outline-none",
                "relative"
              )}>
                <ThemeToggle />
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}