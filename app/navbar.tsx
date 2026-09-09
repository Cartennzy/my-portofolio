"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Upgraded True SaaS Ripple Effect with Animation Matrix
  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;

    const circle = document.createElement("span");
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.style.position = "absolute";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
    circle.style.transform = "scale(0)";
    circle.style.animation = "saas-ripple 0.6s linear";
    circle.style.pointerEvents = "none";
    circle.style.zIndex = "20";
    
    if (!document.getElementById("ripple-keyframes")) {
      const style = document.createElement("style");
      style.id = "ripple-keyframes";
      style.innerHTML = `
        @keyframes saas-ripple {
          to { transform: scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const existingRipple = target.getElementsByClassName("saas-ripple-span")[0];
    if (existingRipple) {
      existingRipple.remove();
    }

    circle.className = "saas-ripple-span";
    target.appendChild(circle);
    
    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleRipple(e);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Skills", href: "/skills" },
    { name: "Experience", href: "/experience" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2 transition-all duration-300">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes saas-ripple {
          to { transform: scale(4); opacity: 0; }
        }
        @keyframes mobile-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

      {/* Main SaaS Navbar Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* ================= 1. BRAND LOGO & ICON ================= */}
        <Link 
          href="/" 
          onClick={handleRipple} 
          className="relative overflow-hidden flex items-center gap-2.5 group rounded-2xl p-2 bg-white/80 dark:bg-[#070D1C]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm cursor-pointer active:scale-95 transition-transform"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-indigo-600 via-blue-500 to-cyan-400 blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[#030712] border border-cyan-400/40 shadow-inner flex items-center justify-center p-0.5">
              <img
                src="/logo-najwan.jpg"
                alt="Najwan Logo"
                className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </Link>

        {/* ================= 2. CENTRAL PILL CAPSULE NAVIGATION ================= */}
        <nav className={`hidden md:flex items-center gap-1 p-1.5 rounded-full transition-all duration-300 ${
          scrolled 
            ? "bg-white/90 dark:bg-[#070D1C]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)]" 
            : "bg-white/70 dark:bg-[#070D1C]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-sm"
        }`}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleRipple}
                className={`relative overflow-hidden px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
                  isActive
                    ? "bg-[#ccff00] text-slate-950 shadow-[0_0_20px_rgba(204,255,0,0.4)] scale-102"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10"
                }`}
              >
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ================= 3. RIGHT UTILITY CONTROLS ================= */}
        <div className="flex items-center gap-2">
          
          {/* Dark / Light Mode Toggle Button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              type="button"
              className="relative overflow-hidden w-10 h-10 rounded-2xl bg-white/80 dark:bg-[#070D1C]/80 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-xs backdrop-blur-xl"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {!isDark ? (
                <svg className="relative z-10 w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="relative z-10 w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
          )}

          {/* Let's Talk CTA Button */}
          <Link
            href="/contact"
            onClick={handleRipple}
            className="group relative overflow-hidden hidden sm:inline-flex items-center justify-center gap-2 px-6 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <span className="relative z-10">Let's Talk</span>
            <svg className="relative z-10 w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={(e) => { handleRipple(e); setIsOpen(!isOpen); }}
            className="relative overflow-hidden md:hidden w-10 h-10 rounded-2xl bg-white/80 dark:bg-[#070D1C]/80 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90 shadow-xs backdrop-blur-xl"
            aria-label="Toggle Menu"
          >
            <span className="relative z-10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </span>
          </button>
        </div>

      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden flex flex-col bg-[#030712]/95 backdrop-blur-3xl"
          style={{ animation: 'mobile-fade-in 0.3s ease-out forwards' }}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#030712] border border-cyan-400/40 shadow-md flex items-center justify-center p-0.5">
                <img
                  src="/logo-najwan.jpg"
                  alt="Najwan Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <span className="font-black text-lg tracking-wider text-white">NAJWAN</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-rose-500 hover:border-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer shadow-xs"
              aria-label="Close Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-3 flex-1 flex flex-col justify-center">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { handleRipple(e); setTimeout(() => setIsOpen(false), 200); }}
                  className={`relative overflow-hidden block px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                    isActive 
                      ? "bg-[#ccff00] text-slate-950 shadow-md" 
                      : "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/5"
                  }`}
                  style={{ animation: `mobile-fade-in 0.3s ease-out forwards ${i * 0.04}s`, opacity: 0 }}
                >
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-6 border-t border-white/10 text-center text-xs text-slate-500 font-mono tracking-widest uppercase">
            © 2026 Najwan Muyassar. Production Ready.
          </div>
        </div>
      )}
    </header>
  );
}