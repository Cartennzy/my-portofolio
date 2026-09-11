"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface SkillItem {
  name: string;
  category: "frontend" | "backend" | "tools";
  level: number;
  badge: string;
  iconUrl: string;
  description: string;
}

interface SoftSkillItem {
  name: string;
  badge: string;
  description: string;
  iconSvg: React.ReactNode;
}

const hardSkillsData: SkillItem[] = [
  {
    name: "React.js & Next.js",
    category: "frontend",
    level: 92,
    badge: "Advanced",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    description: "Membangun aplikasi web modern berbasis SSR/SSG dengan performa tinggi.",
  },
  {
    name: "TypeScript & JavaScript",
    category: "frontend",
    level: 90,
    badge: "Proficient",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    description: "Type safety dan logika pemrograman sisi klien yang tangguh.",
  },
  {
    name: "Tailwind CSS & CSS",
    category: "frontend",
    level: 95,
    badge: "Expert",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    description: "Perancangan UI responsif, kustomisasi design system, dan animasi CSS.",
  },
  {
    name: "Node.js & Express",
    category: "backend",
    level: 88,
    badge: "Advanced",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    description: "Pengembangan server side, RESTful API, dan backend terdistribusi.",
  },
  {
    name: "Laravel Framework",
    category: "backend",
    level: 85,
    badge: "Proficient",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
    description: "Arsitektur MVC, routing, migration database, dan integrasi payment gateway.",
  },
  {
    name: "PostgreSQL & MySQL",
    category: "tools",
    level: 88,
    badge: "Advanced",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    description: "Perancangan basis data relasional, indexing, dan optimalisasi query SQL.",
  },
  {
    name: "Git & GitHub",
    category: "tools",
    level: 90,
    badge: "Expert",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    description: "Version control kolaboratif, branch management, dan code integration.",
  },
  {
    name: "Figma UI/UX Design",
    category: "frontend",
    level: 86,
    badge: "Proficient",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    description: "User flow, wireframe, prototype interaktif, dan design system.",
  },
  {
    name: "Microsoft Power BI",
    category: "tools",
    level: 85,
    badge: "Analytics",
    iconUrl: "/logo-powerbi.png",
    description: "Visualisasi data bisnis, dashboard analitik interaktif, dan business intelligence.",
  },
  {
    name: "Microsoft Word",
    category: "tools",
    level: 95,
    badge: "Expert",
    iconUrl: "/logo-word.png",
    description: "Penyusunan laporan formal, dokumentasi sistem, dan penulisan akademik.",
  },
  {
    name: "Microsoft Excel",
    category: "tools",
    level: 92,
    badge: "Expert",
    iconUrl: "/logo-excel.png",
    description: "Pengolahan data lanjutan, formula kompleks, pivot table, dan analisis spreadsheet.",
  },
  {
    name: "Microsoft PowerPoint",
    category: "tools",
    level: 90,
    badge: "Expert",
    iconUrl: "/logo-powerpoint.png",
    description: "Perancangan presentasi eksekutif, pitch deck proyek, dan visualisasi materi.",
  },
];

const softSkillsData: SoftSkillItem[] = [
  {
    name: "Kepemimpinan & Operasional Lapangan",
    badge: "Leadership",
    description: "Kepemimpinan strategis, manajemen operasional lapangan, koordinasi lintas tim, dan kedisiplinan tinggi yang terasah melalui pengalaman organisasi struktural.",
    iconSvg: (
      <svg className="w-6 h-6 text-indigo-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: "Komunikasi & Problem Solving",
    badge: "Communication",
    description: "Komunikasi interpersonal adaptif, negosiasi kemitraan, kolaborasi tim yang solid, serta penyelesaian masalah (problem solving) yang solutif dan berorientasi hasil.",
    iconSvg: (
      <svg className="w-6 h-6 text-indigo-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export default function SkillsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 1. Interactive Starfield / Neural Mesh Particle Canvas Engine
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
  const handleBentoMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const filteredHardSkills = activeFilter === "all"
    ? hardSkillsData
    : hardSkillsData.filter((s) => s.category === activeFilter);

  return (
    <div className="relative w-full min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-900 dark:text-slate-100 selection:bg-[#0D52E8] selection:text-white overflow-hidden pb-16 transition-colors duration-300">
      
      {/* ================= 0. TOP SCROLL PROGRESS BAR ================= */}
      <div className="fixed top-0 left-0 w-full h-0.75 z-50 pointer-events-none bg-slate-200/50 dark:bg-white/5">
        <div
          className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(99,102,241,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ================= 1. INTERACTIVE CANVAS PARTICLE ENGINE ================= */}
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
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-slate-700 dark:text-slate-300">
            CORE COMPETENCIES & EXPERTISE
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] uppercase max-w-3xl mx-auto">
          TECHNOLOGIES &{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300">
            KEMAMPUAN
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl mx-auto">
          Kumpulan framework, database, perkakas analitik, dan kompetensi interpersonal berstandar profesional yang saya kuasai.
        </p>

        {/* Segmented Filter Capsule */}
        <div className="mt-7 flex justify-center">
          <div className="p-1 rounded-full bg-white/70 dark:bg-[#0c1322]/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl inline-flex items-center gap-1 shadow-xs overflow-x-auto max-w-full">
            {[
              { label: "All Stack", key: "all" },
              { label: "Frontend", key: "frontend" },
              { label: "Backend", key: "backend" },
              { label: "Tools & Analytics", key: "tools" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={(e) => { handleRipple(e); setActiveFilter(tab.key); }}
                className={`relative overflow-hidden px-4 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 active:translate-y-0.5 ${
                  activeFilter === tab.key 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-[1.02]" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SECTION 1: HARD SKILLS & TOOLS ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16 space-y-8 animate-[fade-in_0.4s_ease-out]">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-[#0C1B33] border border-indigo-100 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-cyan-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Hard Skills & Tools</h2>
            <p className="text-[11px] font-mono text-indigo-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">Technical Core Capabilities & Software</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHardSkills.map((skill, index) => {
            const isMicrosoft = skill.name.includes("Microsoft");

            return (
              <article
                key={skill.name}
                onMouseMove={handleBentoMouseMove}
                className="relative group flex flex-col justify-between bg-white/80 dark:bg-[#080E1E]/90 border border-slate-200/80 dark:border-white/10 hover:border-indigo-400/60 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden backdrop-blur-xl"
              >
                {/* Spotlight Glow Overlay */}
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.12), transparent 40%)` }} />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-[#0B152B] border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner overflow-hidden ${
                      isMicrosoft ? "p-1" : "p-2.5"
                    }`}>
                      <img
                        src={skill.iconUrl}
                        alt={skill.name}
                        className={`w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal filter drop-shadow-xs transition-transform ${
                          isMicrosoft ? "scale-[1.65]" : "scale-100"
                        }`}
                        loading="lazy"
                      />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 text-[10px] font-mono font-bold tracking-wider border border-indigo-500/20 uppercase">
                      {skill.badge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-cyan-400">
                      {skill.level}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mb-5 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>

                  <div className="w-full bg-slate-100 dark:bg-[#030712] rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-white/5">
                    <div
                      className="bg-linear-to-r from-indigo-600 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>

                <div className="relative z-10 pt-5 mt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Verified Capability</span>
                  <span className="text-indigo-600 dark:text-cyan-400 font-bold group-hover:scale-110 transition-transform">0{index + 1}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ================= SECTION 2: SOFT SKILLS ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16 space-y-8 animate-[fade-in_0.4s_ease-out]">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Soft Skills & Karakter Kerja</h2>
            <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-semibold">Professional Work Attributes</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {softSkillsData.map((soft) => (
            <div
              key={soft.name}
              onMouseMove={handleBentoMouseMove}
              className="relative group overflow-hidden bg-white/80 dark:bg-[#080E1E]/90 border border-slate-200/80 dark:border-white/10 p-7 rounded-3xl shadow-xl backdrop-blur-xl hover:border-emerald-400/50 hover:shadow-[0_15px_40px_rgba(16,185,129,0.1)] transition-all duration-300 hover:-translate-y-1 flex gap-5 items-start"
            >
              <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(16,185,129,0.08), transparent 40%)` }} />
              
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {soft.iconSvg}
              </div>
              <div className="relative z-10 space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{soft.name}</h3>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 uppercase font-bold">
                    {soft.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                  {soft.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BOTTOM CTA ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-12 mb-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-r from-indigo-500/10 via-blue-500/10 to-transparent border border-indigo-400/30 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-2xl shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.2)] transition-shadow duration-500">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
              Butuh sistem yang dibangun dengan keahlian ini?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-normal max-w-xl">
              Mari rancang arsitektur aplikasi dan sistem digital Anda bersama saya.
            </p>
          </div>
          <Link
            href="/contact"
            onClick={handleRipple}
            className="group relative overflow-hidden shrink-0 px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-lg hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.96] flex items-center gap-2 cursor-pointer border border-slate-300 dark:border-white/20"
          >
            <span className="relative z-10">Start Project</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
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
            </div>

            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase">Explore</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Home Canvas</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/about" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>About Biography</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/projects" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Featured Works</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/skills" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Tech Architecture</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/experience" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Experience Track</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase">Production Apps</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-indigo-400/30 transition-colors cursor-pointer group">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">VictoryArena</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Sport Booking</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-indigo-400/30 transition-colors cursor-pointer group">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 dark:group-hover:text-white transition-colors">MindHaven</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Mental Health</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-indigo-400/30 transition-colors cursor-pointer group">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-white transition-colors">Petty Claim</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Finance SaaS</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase">Network</h4>
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
            <p>© 2026 Najwan Muyassar. All rights reserved.</p>
            <button onClick={(e) => { handleRipple(e); scrollToTop(); }} className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all duration-200 active:scale-95 cursor-pointer shadow-xs group">
              <span className="relative z-10">Back to Top</span>
              <svg className="relative z-10 w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Style for Custom Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
      `}} />

    </div>
  );
}