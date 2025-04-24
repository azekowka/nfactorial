import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
const GeistSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const GeistMono = Inter({ subsets: ["latin"], variable: "--font-mono" });
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "World Map Tracker",
    template: "%s | World Map Tracker",
  },
  description: "Interactive world map visualization. Engineered by Abdulaziz Gabitov, n! applicant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        "antialiased"
      )}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-background font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}