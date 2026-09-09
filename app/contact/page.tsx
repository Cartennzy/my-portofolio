"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 1. Particle Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseVx: number;
      baseVy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    const particleCount = Math.min(Math.floor(width / 20), 80);
    const colors = ["#38bdf8", "#6366f1", "#0D52E8"];

    for (let i = 0; i < particleCount; i++) {
      const vx = prefersReducedMotion ? (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 0.4;
      const vy = prefersReducedMotion ? (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 0.4;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: vx,
        vy: vy,
        baseVx: vx,
        baseVy: vy,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 140;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            p.vx += (dx / distance) * force * 0.4;
            p.vy += (dy / distance) * force * 0.4;
          }

          p.vx += (p.baseVx - p.vx) * 0.05;
          p.vy += (p.baseVy - p.vy) * 0.05;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dxLine = p.x - p2.x;
          const dyLine = p.y - p2.y;
          const distLine = Math.sqrt(dxLine * dxLine + dyLine * dyLine);

          if (distLine < 110) {
            ctx.beginPath();
            const alphaLine = 0.15 * (1 - distLine / 110);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alphaLine})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Scroll Progress & Mouse Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(currentProgress);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 3. True SaaS Ripple Effect
  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const circle = document.createElement("span");
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.style.position = "absolute";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "rgba(255, 255, 255, 0.45)";
    circle.style.transform = "scale(0)";
    circle.style.animation = "saas-ripple 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)";
    circle.style.pointerEvents = "none";
    circle.style.zIndex = "20";

    if (!document.getElementById("ripple-keyframes")) {
      const style = document.createElement("style");
      style.id = "ripple-keyframes";
      style.innerHTML = `
        @keyframes saas-ripple {
          to { transform: scale(3.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const existingRipple = button.getElementsByClassName("saas-ripple-span")[0];
    if (existingRipple) {
      existingRipple.remove();
    }

    circle.className = "saas-ripple-span";
    button.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 650);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 4. Bento Spotlight Mouse Move Handler
  const handleBentoMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  // 5. Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          from_name: "Portfolio Inquiry - " + formData.name,
          subject: `[Portfolio] Pesan Baru dari ${formData.name}`,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setErrorMessage(result.message || "Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan. Periksa koneksi internet Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-900 dark:text-slate-100 selection:bg-[#0D52E8] selection:text-white overflow-hidden pb-16 transition-colors duration-300">
      
      {/* ================= 0. TOP SCROLL PROGRESS BAR ================= */}
      <div className="fixed top-0 left-0 w-full h-0.75 z-50 pointer-events-none bg-slate-200/50 dark:bg-white/5">
        <div
          className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(99,102,241,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ================= 1. INTERACTIVE CANVAS ENGINE ================= */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 opacity-40 dark:opacity-75 transition-opacity duration-500"
        style={{ pointerEvents: "none" }}
      />

      {/* ================= 2. AURORA BEAM RAYS & AMBIENT MESH ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-125 h-125 rounded-full bg-radial from-blue-400/15 dark:from-[#0D52E8]/20 via-indigo-500/5 to-transparent blur-[120px] transition-transform duration-300 ease-out pointer-events-none"
          style={{
            transform: `translate3d(${mousePos.x - 250}px, ${mousePos.y - 250}px, 0)`,
          }}
        />
        <div className="absolute -top-32 right-10 w-150 h-125 bg-linear-to-br from-indigo-400/15 dark:from-indigo-600/15 via-blue-400/10 to-transparent blur-[130px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-1/3 -left-32 w-125 h-125 bg-linear-to-tr from-cyan-400/10 dark:from-cyan-600/15 via-indigo-500/5 to-transparent blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[48px_48px] pointer-events-none" />
      </div>

      {/* ================= 3. EDITORIAL MINIMALIST HERO ================= */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 pt-28 pb-10 sm:pt-36 sm:pb-14 text-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-md shadow-xs mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-slate-700 dark:text-slate-300">
            LET'S COLLABORATE
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] uppercase max-w-3xl mx-auto">
          HAVE A PROJECT{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300">
            IN MIND?
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl mx-auto">
          Saya selalu terbuka untuk mendiskusikan peluang baru, perancangan arsitektur sistem, ataupun kolaborasi pengembangan produk digital Anda.
        </p>
      </div>

      {/* ================= 4. CONTACT BENTO GRID ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start animate-[fade-in_0.4s_ease-out]">
          
          {/* Left Column: Status, Channels & Social Media */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Availability Status */}
            <div 
              onMouseMove={handleBentoMouseMove}
              className="group relative overflow-hidden bg-white/80 dark:bg-[#0A162B]/80 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl hover:border-indigo-400/50 hover:shadow-[0_15px_40px_rgba(99,102,241,0.1)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.08), transparent 40%)` }} />
              <div className="relative z-10 flex items-center gap-4">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#0A162B]"></span>
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">Status: Available for Work</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Open for Freelance & Full-Stack Projects</p>
                </div>
              </div>
            </div>

            {/* Direct Channels (Gmail & WhatsApp) */}
            <div 
              onMouseMove={handleBentoMouseMove}
              className="group/bento relative overflow-hidden bg-white/80 dark:bg-[#0A162B]/80 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl hover:border-indigo-400/50 hover:shadow-[0_15px_40px_rgba(99,102,241,0.1)] transition-all duration-300 hover:-translate-y-0.5 space-y-4"
            >
              <div className="pointer-events-none absolute -inset-px opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.08), transparent 40%)` }} />
              
              <div className="relative z-10">
                <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-3 px-1">Direct Channels</h2>
                
                <div className="space-y-3">
                  {/* Gmail */}
                  <a
                    href="mailto:najwanmuyassar16@gmail.com"
                    onClick={handleRipple}
                    className="group relative overflow-hidden flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-200/80 dark:border-white/5 hover:border-indigo-400/30"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#060B14] border border-slate-200 dark:border-white/10 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <svg className="w-full h-full" viewBox="0 0 48 48">
                        <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"/>
                        <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"/>
                        <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"/>
                        <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L4.664,5.034C3.649,4.282,3,5.188,3,5.922V12.298z"/>
                        <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l8.336-6.166C44.351,4.282,45,5.188,45,5.922V12.298z"/>
                      </svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Gmail Address</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors mt-0.5">
                        najwanmuyassar16@gmail.com
                      </p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/628996602425"
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleRipple}
                    className="group relative overflow-hidden flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-200/80 dark:border-white/5 hover:border-emerald-400/30"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <svg className="w-full h-full" viewBox="0 0 24 24" fill="#25D366">
                        <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.98-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Chat WhatsApp</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-0.5">
                        +62 899 6602 425
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Profiles Bento Card */}
            <div 
              onMouseMove={handleBentoMouseMove}
              className="group/bento relative overflow-hidden bg-white/80 dark:bg-[#0A162B]/80 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl hover:border-indigo-400/50 hover:shadow-[0_15px_40px_rgba(99,102,241,0.1)] transition-all duration-300 hover:-translate-y-0.5 space-y-4"
            >
              <div className="pointer-events-none absolute -inset-px opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.08), transparent 40%)` }} />
              
              <div className="relative z-10">
                <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-3 px-1">Connect On Social</h2>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* GitHub */}
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleRipple}
                    className="relative overflow-hidden flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/80 dark:bg-white/5 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group shadow-xs"
                  >
                    <svg className="w-5 h-5 fill-current mb-1.5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span className="text-[11px] font-bold">GitHub</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleRipple}
                    className="relative overflow-hidden flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/80 dark:bg-white/5 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group shadow-xs"
                  >
                    <svg className="w-5 h-5 fill-current mb-1.5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
                    </svg>
                    <span className="text-[11px] font-bold">LinkedIn</span>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleRipple}
                    className="relative overflow-hidden flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/80 dark:bg-white/5 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group shadow-xs"
                  >
                    <svg className="w-5 h-5 fill-current mb-1.5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="text-[11px] font-bold">Instagram</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Contact Form */}
          <div 
            onMouseMove={handleBentoMouseMove}
            className="lg:col-span-7 group/form relative overflow-hidden bg-white/80 dark:bg-[#0A162B]/80 border border-slate-200/80 dark:border-white/10 rounded-3xl p-7 sm:p-10 shadow-xl backdrop-blur-xl hover:border-indigo-400/50 hover:shadow-[0_15px_40px_rgba(99,102,241,0.1)] transition-all duration-300"
          >
            <div className="pointer-events-none absolute -inset-px opacity-0 group-hover/form:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.08), transparent 40%)` }} />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 group-hover/form:text-indigo-600 dark:group-hover/form:text-cyan-400 transition-colors">Send a Message</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mb-8">
                Pesan Anda akan diteruskan langsung ke kotak masuk Gmail saya secara real-time.
              </p>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-center space-y-4 my-4 animate-[fade-in_0.4s_ease-out]">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pesan Berhasil Terkirim!</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                    Terima kasih telah menghubungi. Sistem akan segera meneruskan pesan ini dan saya akan membalasnya dalam 24 jam.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { handleRipple(e); setIsSubmitted(false); }}
                    className="relative overflow-hidden mt-4 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md"
                  >
                    <span className="relative z-10">Kirim Pesan Lain</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-[fade-in_0.3s_ease-out]">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-wide uppercase text-slate-700 dark:text-slate-400">Nama Lengkap <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="Masukkan Nama Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-wide uppercase text-slate-700 dark:text-slate-400">Alamat Email <span className="text-rose-500">*</span></label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold tracking-wide uppercase text-slate-700 dark:text-slate-400">Kotak Pesan <span className="text-rose-500">*</span></label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Ceritakan secara singkat gambaran sistem, proyek, atau peluang kolaborasi yang ingin Anda diskusikan..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner text-slate-900 dark:text-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleRipple}
                    className="relative overflow-hidden w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer group/btn"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white dark:text-slate-900" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          MENGIRIM PESAN...
                        </>
                      ) : (
                        <>
                          KIRIM PESAN SEKARANG
                          <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ================= ULTRA HIGH-TIER BENTO FOOTER ================= */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4">
        <div className="relative rounded-[2.5rem] bg-white/80 dark:bg-[#070D1C]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl p-8 sm:p-12 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-cyan-400/10 dark:from-cyan-400/20 to-transparent blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial from-blue-400/10 dark:from-blue-500/15 to-transparent blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 border-b border-slate-200/80 dark:border-white/10">
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center">
                  <div className="absolute -inset-2 rounded-2xl bg-linear-to-r from-indigo-600 via-blue-500 to-cyan-400 blur-lg opacity-70 animate-pulse pointer-events-none" />
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#030712] border border-cyan-400/40 shadow-xl flex items-center justify-center p-0.5">
                    <img src="/logo-najwan.jpg" alt="Najwan Muyassar Logo" className="w-full h-full object-cover rounded-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-wider text-slate-900 dark:text-white leading-tight">NAJWAN MUYASSAR</h3>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Web Dev • Data Analyst • UI/UX Designer</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal max-w-md">
                Mengembangkan aplikasi web modern, visualisasi data analitik bisnis, dan perancangan desain antarmuka profesional untuk ekosistem digital masa kini.
              </p>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="font-bold text-slate-800 dark:text-emerald-400">All Systems Operational</span>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span className="text-slate-500 dark:text-slate-400">99.98% Uptime</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400" />
                <h4 className="text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase">Explore</h4>
              </div>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Home Canvas</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/about" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>About Biography</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/projects" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Featured Works</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/skills" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Tech Architecture</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/experience" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Experience Track</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400" />
                <h4 className="text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase">Production Apps</h4>
              </div>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-indigo-400/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#0D52E8] group-hover:scale-125 transition-transform" /><span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">VictoryArena</span></div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Sport Booking</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-indigo-400/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 group-hover:scale-125 transition-transform" /><span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-500 dark:group-hover:text-white transition-colors">Toko Online</span></div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">E-Commerce</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-indigo-400/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" /><span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 dark:group-hover:text-white transition-colors">MindHaven</span></div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Mental Health</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-indigo-400/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" /><span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-white transition-colors">Petty Claim</span></div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Finance SaaS</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400" />
                <h4 className="text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase">Network</h4>
              </div>
              <div className="flex flex-col gap-2.5">
                <a href="https://github.com" target="_blank" rel="noreferrer" onClick={handleRipple} className="relative overflow-hidden flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-all duration-200 group shadow-xs active:scale-[0.96]">
                  <div className="relative z-10 flex items-center gap-2.5 text-xs font-semibold">
                    <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                    <span>GitHub</span>
                  </div>
                  <span className="relative z-10 text-xs">↗</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" onClick={handleRipple} className="relative overflow-hidden flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-all duration-200 group shadow-xs active:scale-[0.96]">
                  <div className="relative z-10 flex items-center gap-2.5 text-xs font-semibold">
                    <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" /></svg>
                    <span>LinkedIn</span>
                  </div>
                  <span className="relative z-10 text-xs">↗</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" onClick={handleRipple} className="relative overflow-hidden flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-all duration-200 group shadow-xs active:scale-[0.96]">
                  <div className="relative z-10 flex items-center gap-2.5 text-xs font-semibold">
                    <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </div>
                  <span className="relative z-10 text-xs">↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <p>© 2026 Najwan Muyassar. All rights reserved.</p>
            </div>
            <button onClick={(e) => { handleRipple(e); scrollToTop(); }} className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer shadow-xs group">
              <span className="relative z-10">Back to Top</span>
              <svg className="relative z-10 w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}