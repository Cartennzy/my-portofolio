"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "organization">("overview");
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

  // 3. True SaaS Ripple Effect with Animation Feedback
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

  // 4. Bento Spotlight Mouse Move Handler
  const handleBentoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
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

      {/* ================= 3. EDITORIAL MINIMALIST HERO (KATA-KATA REALISTIS, NON-AI) ================= */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 pt-28 pb-10 sm:pt-36 sm:pb-14 text-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-md shadow-xs mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-slate-700 dark:text-slate-300">
            BIOGRAFI & LATAR BELAKANG
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] uppercase max-w-3xl mx-auto">
          PROFIL AKADEMIK &{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300">
            PENGALAMAN ORGANISASI
          </span>
        </h1>

        {/* Subtitle Realistis */}
        <p className="mt-4 text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl mx-auto">
          Halo, saya Najwan Muyassar. Halaman ini merangkum perjalanan studi saya di S1 Sistem Informasi UBSI, riwayat kepemimpinan organisasi, serta komitmen saya untuk bekerja secara profesional di bidang teknologi.
        </p>

        {/* Segmented Tab Capsule dengan Ripple & Active State */}
        <div className="mt-7 flex justify-center">
          <div className="p-1 rounded-full bg-white/70 dark:bg-[#0c1322]/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl inline-flex items-center gap-1 shadow-xs">
            <button
              onClick={(e) => { handleRipple(e); setActiveTab("overview"); }}
              className={`relative overflow-hidden px-5 sm:px-7 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <span className="relative z-10">Overview & Edukasi</span>
            </button>
            <button
              onClick={(e) => { handleRipple(e); setActiveTab("organization"); }}
              className={`relative overflow-hidden px-5 sm:px-7 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "organization"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <span className="relative z-10">Organisasi & Pengalaman</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 4. TAB CONTENT SYSTEM ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
        
        {/* ================= TAB 1: OVERVIEW & EDUCATION ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
            {/* Bento Metrics Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { val: "3.88", tag: "PRESTASI AKADEMIK", title: "IPK Konsisten Tinggi", desc: "Menjaga performa studi dengan perolehan IPK 3.88 di program studi S1 Sistem Informasi Universitas Bina Sarana Informatika." },
                { val: "5+", tag: "PENGALAMAN KEPEMIMPINAN", title: "Aktif Berorganisasi", desc: "Terbiasa memimpin tim, menyusun program kerja, dan berkoordinasi langsung dengan pihak kampus maupun sekolah." },
                { val: "100%", tag: "TANGGUNG JAWAB", title: "Etos Kerja Profesional", desc: "Disiplin dalam manajemen waktu, teliti terhadap detail tugas, serta siap belajar hal baru untuk menyesuaikan diri dengan dunia kerja." }
              ].map((metric, idx) => (
                <div 
                  key={idx}
                  onMouseMove={handleBentoMouseMove}
                  className="group relative overflow-hidden bg-white/80 dark:bg-[#0A162B]/80 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-[0_15px_40px_rgba(99,102,241,0.15)] hover:border-indigo-400/50 transition-all duration-300 ease-out hover:-translate-y-1 backdrop-blur-xl flex flex-col justify-between"
                >
                  <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.12), transparent 40%)` }} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{metric.val}</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                        {metric.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">{metric.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-normal leading-relaxed">
                      {metric.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Riwayat Pendidikan Section */}
            <div className="bg-white/80 dark:bg-[#0A162B]/80 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-[#0C1B33] border border-indigo-100 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Pendidikan Formal</h3>
                  <p className="text-[11px] font-mono text-indigo-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">Riwayat Sekolah & Kuliah</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* UBSI */}
                <div onMouseMove={handleBentoMouseMove} className="group relative overflow-hidden p-6 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between hover:border-indigo-400/50 hover:shadow-[0_10px_30px_rgba(99,102,241,0.1)] transition-all duration-300 hover:-translate-y-0.5">
                  <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.08), transparent 40%)` }} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-cyan-400">2024 — SEKARANG</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                        IPK: 3.88 / 4.00
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      UNIVERSITAS BINA SARANA INFORMATIKA
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                      S1 Sistem Informasi
                    </p>
                  </div>
                  <p className="relative z-10 text-xs text-slate-500 dark:text-slate-400 font-normal mt-4 pt-3 border-t border-slate-200 dark:border-white/10 leading-relaxed">
                    Mempelajari konsep dasar hingga lanjutan seputar pemrograman web, struktur basis data, analisis sistem, dan manajemen proyek teknologi informasi secara aplikatif.
                  </p>
                </div>

                {/* SMAN 9 */}
                <div onMouseMove={handleBentoMouseMove} className="group relative overflow-hidden p-6 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between hover:border-indigo-400/50 hover:shadow-[0_10px_30px_rgba(99,102,241,0.1)] transition-all duration-300 hover:-translate-y-0.5">
                  <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.08), transparent 40%)` }} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">2021 — 2024</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0D52E8] dark:text-cyan-400 font-mono text-[10px] font-bold">
                        LULUS
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      SMA NEGERI 9 TAMBUN SELATAN
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                      MIPA (Matematika dan Ilmu Pengetahuan Alam)
                    </p>
                  </div>
                  <p className="relative z-10 text-xs text-slate-500 dark:text-slate-400 font-normal mt-4 pt-3 border-t border-slate-200 dark:border-white/10 leading-relaxed">
                    Menyelesaikan pendidikan menengah dengan fokus pada ilmu eksakta dan logika analitis. Aktif memimpin kegiatan kesiswaan serta organisasi baris-berbaris dan kedisiplinan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ORGANISASI & PENGALAMAN ================= */}
        {activeTab === "organization" && (
          <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
            <div className="bg-white/80 dark:bg-[#0A162B]/80 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-[#0C1B33] border border-indigo-100 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Pengalaman & Keaktifan Organisasi</h3>
                  <p className="text-[11px] font-mono text-indigo-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">Leadership & Contributions</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* HIMSI DPP */}
                <div className="group relative pl-6 sm:pl-7 border-l-2 border-indigo-600 dark:border-cyan-400 space-y-1.5 hover:bg-slate-50/70 dark:hover:bg-white/5 p-3.5 -ml-3 rounded-r-2xl transition-colors">
                  <div className="absolute -left-2.25 top-4.5 w-4 h-4 rounded-full bg-white dark:bg-[#0A162B] border-2 border-indigo-600 dark:border-cyan-400 group-hover:scale-125 transition-all duration-300" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      HIMPUNAN MAHASISWA SISTEM INFORMASI DEWAN PIMPINAN PUSAT (DPP)
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-cyan-400 font-mono text-[10px] font-bold">
                      2026 — SEKARANG
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-cyan-500 uppercase tracking-wider">
                    Staff Anggota Divisi Sosial dan Masyarakat
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 font-normal space-y-1 list-disc list-outside pl-4 leading-relaxed pt-1">
                    <li>Aktif membangun komunikasi dan hubungan kerja sama yang baik dengan sesama organisasi mahasiswa di lingkungan kampus.</li>
                    <li>Mendukung kelancaran kegiatan sosial kemasyarakatan serta membantu mengelola relasi eksternal dan perolehan sponsor kegiatan.</li>
                  </ul>
                </div>

                {/* HIMSI DPC CUTMUTIA */}
                <div className="group relative pl-6 sm:pl-7 border-l-2 border-slate-300 dark:border-white/20 hover:border-indigo-400 space-y-1.5 hover:bg-slate-50/70 dark:hover:bg-white/5 p-3.5 -ml-3 rounded-r-2xl transition-colors">
                  <div className="absolute -left-2.25 top-4.5 w-4 h-4 rounded-full bg-white dark:bg-[#0A162B] border-2 border-slate-400 dark:border-white/40 group-hover:border-indigo-400 group-hover:scale-125 transition-all duration-300" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      HIMPUNAN MAHASISWA SISTEM INFORMASI DPC CUTMUTIA X KALIMALANG
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono text-[10px] font-bold">
                      2024 — 2025
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 uppercase tracking-wider transition-colors">
                    Staff Anggota Divisi Penelitian dan Pengembangan
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 font-normal space-y-1 list-disc list-outside pl-4 leading-relaxed pt-1">
                    <li>Terlibat dalam kepanitiaan workshop study club Campus Meet Up untuk memperluas wawasan teknologi mahasiswa.</li>
                    <li>Membantu meriset kebutuhan mahasiswa dan mengevaluasi kegiatan internal himpunan agar berjalan lebih terstruktur.</li>
                  </ul>
                </div>

                {/* VOLUNTEER LKBB BSI FLASH */}
                <div className="group relative pl-6 sm:pl-7 border-l-2 border-slate-300 dark:border-white/20 hover:border-indigo-400 space-y-1.5 hover:bg-slate-50/70 dark:hover:bg-white/5 p-3.5 -ml-3 rounded-r-2xl transition-colors">
                  <div className="absolute -left-2.25 top-4.5 w-4 h-4 rounded-full bg-white dark:bg-[#0A162B] border-2 border-slate-400 dark:border-white/40 group-hover:border-indigo-400 group-hover:scale-125 transition-all duration-300" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      VOLUNTEER LKBB BSI FLASH
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono text-[10px] font-bold">
                      2026
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 uppercase tracking-wider transition-colors">
                    Divisi Liaison Officer (LO) LKBB
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 font-normal space-y-1 list-disc list-outside pl-4 leading-relaxed pt-1">
                    <li>Menjadi narahubung yang sigap membantu kontingen peserta lomba dalam hal registrasi, informasi teknis, dan ketepatan jadwal acara.</li>
                    <li>Bekerjasama dalam tim panitia besar untuk memastikan kelancaran acara skala regional dari awal hingga selesai.</li>
                  </ul>
                </div>

                {/* OSIS SMAN 9 */}
                <div className="group relative pl-6 sm:pl-7 border-l-2 border-slate-300 dark:border-white/20 hover:border-indigo-400 space-y-1.5 hover:bg-slate-50/70 dark:hover:bg-white/5 p-3.5 -ml-3 rounded-r-2xl transition-colors">
                  <div className="absolute -left-2.25 top-4.5 w-4 h-4 rounded-full bg-white dark:bg-[#0A162B] border-2 border-slate-400 dark:border-white/40 group-hover:border-indigo-400 group-hover:scale-125 transition-all duration-300" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      OSIS SMA NEGERI 9 TAMBUN SELATAN
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono text-[10px] font-bold">
                      2021 — 2023
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 uppercase tracking-wider transition-colors">
                    Ketua Sekretariat Bidang Prestasi Akademik dan Non Akademik
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 font-normal space-y-1 list-disc list-outside pl-4 leading-relaxed pt-1">
                    <li>Mengkoordinasikan perencanaan kegiatan sekolah dan bertanggung jawab atas pendataan prestasi siswa.</li>
                    <li>Mengevaluasi berjalannya program kerja bersama guru pembimbing untuk hasil yang lebih optimal di tahun berikutnya.</li>
                  </ul>
                </div>

                {/* PASKIBRA SMAN 9 */}
                <div className="group relative pl-6 sm:pl-7 border-l-2 border-slate-300 dark:border-white/20 hover:border-indigo-400 space-y-1.5 hover:bg-slate-50/70 dark:hover:bg-white/5 p-3.5 -ml-3 rounded-r-2xl transition-colors">
                  <div className="absolute -left-2.25 top-4.5 w-4 h-4 rounded-full bg-white dark:bg-[#0A162B] border-2 border-slate-400 dark:border-white/40 group-hover:border-indigo-400 group-hover:scale-125 transition-all duration-300" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                      PASKIBRA SMA NEGERI 9 TAMBUN SELATAN
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono text-[10px] font-bold">
                      2021 — 2023
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 uppercase tracking-wider transition-colors">
                    Ketua Umum Paskibra
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 font-normal space-y-1 list-disc list-outside pl-4 leading-relaxed pt-1">
                    <li>Memimpin organisasi dan mengarahkan anggota dalam menjalankan puluhan program kerja rutin serta latihan kedisiplinan.</li>
                    <li>Mengasah mental kepemimpinan, ketegasan, dan manajemen waktu dalam mengemban amanah organisasi skala sekolah.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. BOTTOM CALL TO ACTION ================= */}
        <div className="p-6 sm:p-10 rounded-3xl bg-linear-to-r from-indigo-500/10 via-blue-500/10 to-transparent border border-indigo-400/30 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-2xl shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.2)] transition-shadow duration-500 mt-10">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
              Tertarik Berkolaborasi atau Merekrut?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-normal max-w-xl">
              Saya siap bekerja sama dan memberikan kontribusi terbaik di perusahaan atau instansi Anda.
            </p>
          </div>
          <Link
            href="/contact"
            onClick={handleRipple}
            className="group relative overflow-hidden shrink-0 px-7 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:translate-y-1 active:scale-[0.96] flex items-center gap-2 cursor-pointer"
          >
            <span className="relative z-10">Hubungi Saya</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

      </div>

    </div>
  );
}