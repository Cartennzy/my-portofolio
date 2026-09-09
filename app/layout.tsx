import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "./navbar";

export const metadata: Metadata = {
  title: "Najwan Muyassar | Software Developer & System Architect",
  description: "Portfolio of Najwan Muyassar - Full-Stack Developer & System Architect",
  // Baris 'icons' dihapus karena sudah di-handle oleh app/icon.tsx
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark scroll-smooth">
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#030712] dark:text-slate-100 font-sans selection:bg-[#0D52E8] selection:text-white flex flex-col min-h-screen overflow-x-hidden antialiased transition-colors duration-300">
        <Navbar />
        <main className="grow w-full flex flex-col bg-transparent">
          {children}
        </main>
      </body>
    </html>
  );
}