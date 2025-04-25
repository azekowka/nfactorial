'use client';
import { NavbarDemo } from '@/components/navbar'; 
import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function SignInPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="w-full">
        <NavbarDemo />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <SignIn
          appearance={{
            baseTheme: theme === 'dark' ? dark : undefined,
            elements: {
              rootBox: 'w-full max-w-[440px]',
              card: 'bg-background shadow-none overflow-visible',
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
              main: 'overflow-visible',
              footer: "hidden",
            },
          }}
          redirectUrl="/dashboard"
          afterSignInUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
} 