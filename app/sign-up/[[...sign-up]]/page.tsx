'use client';

import { NavbarDemo } from '@/components/navbar'; 
import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="w-full">
        <NavbarDemo />
      </div>
      <div className="flex-1 flex items-center justify-center">
      <SignUp
        appearance={{
          baseTheme: theme === 'dark' ? dark : undefined,
          elements: {
            rootBox: 'mx-auto w-full max-w-[440px]',
            card: 'bg-background shadow-none',
            header: 'text-foreground',
            headerTitle: 'text-2xl font-semibold',
            headerSubtitle: 'text-muted-foreground',
            socialButtonsBlockButton: 'bg-background border border-input hover:bg-accent text-foreground',
            socialButtonsBlockButtonText: 'text-foreground font-medium',
            dividerLine: 'bg-input',
            dividerText: 'text-muted-foreground',
            formFieldLabel: 'text-foreground',
            formFieldInput: 'bg-background border border-input',
            footerActionLink: 'text-primary hover:text-primary/90',
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            footerAction: 'flex items-center justify-center gap-1',
            badge: "hidden"
          },
        }}
        redirectUrl="/"
        afterSignUpUrl="/"
        signInUrl="/sign-in"
      />
    </div>
  </div>
  );
} 