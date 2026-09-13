"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPillarsVisible, setIsPillarsVisible] = useState(false);

  // --- Splash Screen Clean High-Tier SaaS State ---
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("showcase");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 }); 
  const pillarsRef = useRef<HTMLElement | null>(null);

  // Splash Screen Timer
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      const closeTimer = setTimeout(() => {
        setIsLoading(false);
      }, 700);
      return () => clearTimeout(closeTimer);
    }, 1500);

    return () => clearTimeout(exitTimer);
  }, []);

  // 1. Interactive Starfield / Neural Mesh Particle Canvas Engine
  useEffect(() => {
    if (isLoading) return;
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
  }, [isLoading]);

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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPillarsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (pillarsRef.current) {
      observer.observe(pillarsRef.current);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (pillarsRef.current) observer.disconnect();
    };
  }, []);

  // 3. Modal Esc Key & Body Scroll Lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) closeModal();
    };

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  // 4. About Section Profile Images Auto-slide
  const aboutProfileImages = ["/profile_najwan1.jpg", "/profile_najwan2.jpg"];
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % aboutProfileImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [aboutProfileImages.length]);

  // Enhanced True Ripple Effect with Position Matrix
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

  const handleBentoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const openModal = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setActiveTab("showcase");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const techLogos = [
    { name: "React 19", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Next.js 15", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "TypeScript", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Tailwind CSS", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Node.js", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Laravel 10", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
    { name: "PostgreSQL", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Git & GitHub", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "Power BI", iconUrl: "/logo-powerbi.png" },
    { name: "Figma", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  ];

  const projects = [
    {
      id: "mental-health",
      title: "Sistem Layanan Kesehatan Mental (MindHaven)",
      category: "Full-Stack Web App, Portal Konsultasi & Asesmen",
      image: "/logo-mindhaven.jpg",
      link: "https://mind-haven-opal.vercel.app/",
      accent: "from-emerald-500/30 via-teal-600/15 to-transparent",
      badge: "FULL-STACK WEB",
      scale: "scale-120",
      glowColor: "rgba(16, 185, 129, 0.45)",
      demoLink: "https://mind-haven-opal.vercel.app/",
      demoLabel: "BUKA WEBSITE",
      challenge: "Menyediakan layanan konsultasi psikologis online yang mudah diakses, responsif, dan menjaga kerahasiaan data pribadi pasien.",
      solution: "Mengembangkan aplikasi web menggunakan Next.js dan Laravel untuk menangani antrean sesi, pencatatan rekam medis, serta fitur konsultasi interaktif.",
      techStack: ["Next.js", "Laravel", "PostgreSQL", "Tailwind CSS"],
      highlights: [
        "Sistem Booking Sesi Konsultasi Real-time",
        "Penyimpanan Data Pasien Terproteksi",
        "Modul Asesmen Psikologi Mandiri",
        "Dashboard Khusus Konselor dan Pasien"
      ],
      metrics: [
        { label: "Sesi Aktif", value: "100+" },
        { label: "Waktu Muat", value: "< 1.2s" },
        { label: "Uptime", value: "99.9%" },
        { label: "Kepuasan", value: "98%" }
      ],
      codeSnippet: `// mindhaven_telemetry_pipeline.ts
export const handlePatientData = async (payload: PatientRecord) => {
  const secureData = await encryptRecord(payload);
  await db.records.insert(secureData);
  return { status: 'success', timestamp: Date.now() };
};`
    },
    {
      id: "futsal-booking",
      title: "Sistem Reservasi Lapangan Futsal (Victory Arena)",
      category: "Full-Stack Web App, Manajemen Jadwal & Pembayaran Online",
      image: "/logo-victory-arena.png",
      link: "https://victory-arena-zeta.vercel.app/",
      badge: "FULL-STACK WEB",
      scale: "scale-115",
      glowColor: "rgba(13, 82, 232, 0.45)",
      accent: "from-blue-600/30 via-indigo-600/15 to-transparent",
      desc: "Aplikasi pemesanan lapangan olahraga secara real-time untuk menghindari bentrok jadwal, lengkap dengan sistem konfirmasi pembayaran digital.",
      demoLink: "https://victory-arena-zeta.vercel.app/",
      demoLabel: "BUKA WEBSITE",
      challenge: "Sering terjadi kesalahan pencatatan jadwal (double booking) pada jam operasional sibuk di akhir pekan.",
      solution: "Menerapkan sistem penguncian slot berbasis database transaksi otomatis dan pembaruan jadwal secara real-time di sisi antarmuka.",
      techStack: ["React", "Node.js", "PostgreSQL", "Express"],
      highlights: [
        "Matriks Ketersediaan Lapangan Real-time",
        "Pencegahan Bentrok Jadwal Otomatis",
        "Dashboard Rekap Pendapatan Pemilik Lapangan",
        "Struk Bukti Pemesanan Digital"
      ],
      metrics: [
        { label: "Pengguna", value: "500+" },
        { label: "Konflik Jadwal", value: "0%" },
        { label: "Kecepatan", value: "Optimal" },
        { label: "Pemesanan", value: "1K+" }
      ],
      codeSnippet: `// Booking Transaction Strategy
const bookSlot = async (slotId, userId) => {
  return await db.transaction(async (trx) => {
    const slot = await trx('slots').where({id: slotId}).forUpdate();
    if (slot.is_booked) throw new Error('Slot sudah dipesan orang lain');
    await trx('bookings').insert({ slot_id: slotId, user_id: userId });
  });
};`
    },
    {
      id: "petty-claim",
      title: "Sistem Reimbursement Kas Perusahaan (Petty Claim)",
      category: "Enterprise Financial System & Workflow Persetujuan",
      image: "/logo-pettyclaim.jpg",
      link: "#",
      badge: "In Progress",
      scale: "scale-90",
      glowColor: "rgba(245, 158, 11, 0.45)",
      accent: "from-amber-500/30 via-yellow-600/15 to-transparent",
      desc: "Proyek sistem pengelolaan kas kecil dan pengajuan klaim dana operasional yang sedang dalam tahap pengembangan aktif untuk digitalisasi proses keuangan perusahaan.",
      demoLink: "#",
      demoLabel: "DALAM TAHAP RILIS",
      challenge: "Mengganti alur klaim manual berbasis kertas menjadi platform digital terintegrasi yang transparan dan mudah diaudit.",
      solution: "Merancang arsitektur multi-approval berjenjang dengan pencatatan log aktivitas otomatis dan penyimpanan bukti transaksi digital.",
      techStack: ["Laravel", "Vue.js", "MySQL", "Docker"],
      highlights: [
        "Alur Persetujuan Bertingkat (Multi-tier Approval)",
        "Pencatatan Audit Trail Otomatis",
        "Manajemen Bukti Pengeluaran Digital",
        "Ekspor Laporan Keuangan Instan"
      ],
      metrics: [
        { label: "Status", value: "Building" },
        { label: "Progress", value: "80%" },
        { label: "Arsitektur", value: "Modular" },
        { label: "Target", value: "2026" }
      ],
      codeSnippet: `// Petty Claim Development Snippet
public function submitClaim(Request $request) {
    // Under active development & testing phase
    return response()->json(['status' => 'in_progress']);
}`
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-900 dark:text-slate-100 selection:bg-[#0D52E8] selection:text-white overflow-hidden font-sans transition-colors duration-300">

      {/* ================= CLEAN HIGH-TIER SAAS SPLASH SCREEN ================= */}
      {isLoading && (
        <div
          className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#030712] transition-all duration-700 ease-in-out select-none ${
            isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <div className="absolute w-96 h-96 rounded-full bg-radial from-cyan-500/20 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none animate-pulse" />

          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-36 h-36 rounded-full border border-cyan-400/20 border-dashed animate-spin-slow pointer-events-none" />
              <div className="absolute w-32 h-32 rounded-full border-2 border-transparent border-t-indigo-500 border-b-cyan-400 animate-spin pointer-events-none" />
              <div className="absolute -inset-4 bg-linear-to-r from-blue-600 to-cyan-400 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none" />

              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#0A1224] border-2 border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.4)] p-1 flex items-center justify-center">
                <img
                  src="/logo-najwan.jpg"
                  alt="Najwan Muyassar Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            <h2 className="text-xl font-black uppercase tracking-[0.25em] text-white">
              NAJWAN <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400">MUYASSAR</span>
            </h2>
            <p className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mt-1.5">
              SYSTEM ARCHITECTURE & PORTFOLIO
            </p>
          </div>
        </div>
      )}

      {/* ================= 0. TOP SCROLL PROGRESS BAR ================= */}
      <div className="fixed top-0 left-0 w-full h-0.75 z-50 pointer-events-none bg-slate-200/50 dark:bg-white/5">
        <div
          className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(99,102,241,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ================= 1. CANVAS PARTICLE ENGINE ================= */}
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

      {/* ================= 3. HERO SECTION ================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-7 text-left">
            <div className="space-y-2">
              <h1 className="relative text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] drop-shadow-sm group">
                <span className="bg-linear-to-r from-slate-950 via-slate-600 to-slate-950 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent bg-size-[200%_auto] animate-text-shimmer inline-block">
                  Najwan Muyassar
                </span>
                <span className="absolute -inset-x-2 -inset-y-1 bg-indigo-500/10 dark:bg-cyan-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 pointer-events-none rounded-full" />
              </h1>

              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight hero-gradient-text drop-shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                Full-Stack Developer & UI UX Designer
              </h2>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl transition-colors">
              Halo! Saya membangun aplikasi web yang cepat, stabil, dan nyaman dipakai pengguna nyata. Dari logika database di balik layar sampai detail tampilan antarmuka dan laporan analitik bisnis—semuanya saya kerjakan terstruktur agar siap dipakai di dunia nyata.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/projects"
                onClick={handleRipple}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-indigo-500/25 hover:shadow-cyan-500/40 hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.96] border border-cyan-400/30 cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                <span className="relative z-10">Lihat Hasil Karya Saya</span>
                <svg
                  className="relative z-10 w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </Link>

              <Link
                href="/contact"
                onClick={handleRipple}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 border border-slate-300 dark:border-white/15 hover:border-indigo-400/50 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.96] cursor-pointer"
              >
                <span className="relative z-10">Ajak Ngobrol Santai</span>
                <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-120 sm:min-h-140">
            <div className="absolute w-100 sm:w-130 h-100 sm:h-130 bg-radial from-indigo-500/15 dark:from-indigo-500/25 via-sky-400/10 to-transparent rounded-full blur-[90px] pointer-events-none" />

            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#8fa499]/30 dark:bg-[#20332c]/50 backdrop-blur-md border border-white/50 dark:border-white/20 shadow-xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-linear-to-b from-white/20 via-transparent to-black/20" />
            </div>

            <div className="absolute w-84 sm:w-110 h-84 sm:h-110 rounded-full border border-slate-300/60 dark:border-white/15 pointer-events-none flex items-center justify-center">
              <div className="absolute inset-2 rounded-full border border-dashed border-indigo-400/30 dark:border-cyan-400/20 animate-spin-slow pointer-events-none" />
            </div>

            <div className="relative z-10 w-full max-w-95 sm:max-w-112.5 flex items-end justify-center pointer-events-none">
              <img
                src="/najwan-removebg.png"
                alt="Najwan Muyassar"
                className="w-full h-auto max-h-125 object-contain object-bottom filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)] select-none"
                style={{
                  maskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ================= 4. TECH STACK MARQUEE ================= */}
      <section className="relative z-10 w-full bg-white/70 dark:bg-[#050912]/80 backdrop-blur-xl border-y border-slate-200/80 dark:border-white/10 py-6 overflow-hidden transition-colors">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#f8fafc] dark:from-[#030712] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#f8fafc] dark:from-[#030712] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-[marquee_22s_linear_infinite] hover:[animation-play-state:paused]">
          <div className="flex items-center gap-6 pr-6">
            {techLogos.map((tech, idx) => (
              <div key={`tech-1-${idx}`} className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-white dark:bg-[#0A1428]/90 border border-slate-200 dark:border-white/10 shadow-xs hover:border-indigo-400/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all hover:scale-105 hover:-translate-y-0.5 shrink-0">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <img src={tech.iconUrl} alt={tech.name} className="w-full h-full object-contain filter drop-shadow-xs" loading="lazy" />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">{tech.name}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pr-6" aria-hidden="true">
            {techLogos.map((tech, idx) => (
              <div key={`tech-2-${idx}`} className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-white dark:bg-[#0A1428]/90 border border-slate-200 dark:border-white/10 shadow-xs hover:border-indigo-400/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all hover:scale-105 hover:-translate-y-0.5 shrink-0">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <img src={tech.iconUrl} alt={tech.name} className="w-full h-full object-contain filter drop-shadow-xs" loading="lazy" />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. ABOUT HIGHLIGHT SECTION ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center items-center">
            <div className="absolute -inset-6 bg-linear-to-tr from-[#0D52E8]/20 dark:from-[#0D52E8]/40 via-cyan-400/15 dark:via-cyan-400/25 to-indigo-600/20 dark:to-indigo-600/40 rounded-[3rem] blur-3xl opacity-70 animate-[pulse_4s_ease-in-out_infinite] pointer-events-none" />

            <div className="relative w-72 sm:w-84 h-104 rounded-3xl overflow-hidden bg-slate-200 dark:bg-[#0A162B] p-2 border border-slate-300 dark:border-white/20 shadow-2xl backdrop-blur-xl group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                {aboutProfileImages.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Najwan Muyassar About ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-1000 ease-in-out ${
                      currentImgIdx === index ? "opacity-100 scale-100 filter-none" : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-linear-to-t from-[#030712]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 text-xs font-bold tracking-widest uppercase border border-indigo-500/30 dark:border-cyan-400/30">
              TENTANG SAYA
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase leading-tight text-slate-900 dark:text-white">
              FOKUS PADA <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500">HASIL & KUALITAS</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Bagi saya, aplikasi yang baik adalah aplikasi yang menyelesaikan masalah nyata dengan efisien. Saya memadukan logika teknis yang rapi, tampilan antarmuka yang nyaman, dan data analitik yang jelas untuk mendukung kebutuhan Anda.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                href="/about" 
                onClick={handleRipple} 
                className="group relative overflow-hidden inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-7 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-md hover:-translate-y-1 hover:shadow-xl active:translate-y-0.5 active:scale-[0.96] cursor-pointer"
              >
                <span className="relative z-10">Kenal Lebih Dekat</span>
                <span className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. RECENT PROJECT SHOWCASE ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase border border-indigo-500/20 dark:border-cyan-400/30">
              PORTFOLIO
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              PROYEK <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-400">PILIHAN</span>
            </h2>
          </div>

          <Link 
            href="/projects" 
            onClick={handleRipple} 
            className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 dark:border-white/15 hover:border-indigo-400/50 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all duration-200 bg-white dark:bg-[#0A1428]/80 backdrop-blur-xl shadow-xs hover:-translate-y-1 hover:shadow-md active:translate-y-0.5 active:scale-95"
          >
            <span className="relative z-10">Lihat Semua Proyek</span>
            <svg className="relative z-10 w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((project, idx) => (
            <div 
              key={project.id} 
              role="button"
              tabIndex={0}
              onClick={(e) => { handleRipple(e); openModal(project); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(project); }}
              className="relative group rounded-3xl p-px transition-all duration-300 hover:-translate-y-2 active:scale-[0.98] flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
            >
              <div className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `linear-gradient(135deg, ${project.glowColor}, transparent 70%)` }} />
              <div className="relative h-full flex flex-col justify-between rounded-3xl bg-white/80 dark:bg-[#080E1E]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 group-hover:border-indigo-400/60 p-7 shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.15)] transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/10 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">0{idx + 1}</span>
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-cyan-400 font-mono text-[10px] font-semibold uppercase tracking-wider">{project.badge}</span>
                  </div>

                  <div className="relative w-full h-48 rounded-2xl flex items-center justify-center p-4 my-2 overflow-hidden bg-slate-100/70 dark:bg-[#0B152B]/70 border border-slate-200 dark:border-white/5 group-hover:border-indigo-400/30 transition-all duration-300">
                    <div className={`absolute inset-0 bg-radial ${project.accent} opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                    <div className="relative z-10 w-32 h-32 rounded-2xl overflow-hidden bg-[#ffffff] flex items-center justify-center p-3 shadow-xl border border-white/20 group-hover:scale-105 transition-transform duration-300">
                      <img src={project.image} alt={project.title} className={`w-full h-full object-contain mix-blend-multiply brightness-[1.03] contrast-[1.15] transition-transform duration-300 ${project.scale}`} />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mt-4">{project.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1.5 line-clamp-2 leading-relaxed">{project.category}</p>
                </div>

                {/* Tombol Bedah Rincian */}
                <div className="pt-5 mt-6 border-t border-slate-100 dark:border-white/10">
                  <div className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-indigo-600 dark:group-hover:bg-cyan-400 group-hover:text-white dark:group-hover:text-slate-900 transition-colors shadow-sm">
                    <span>Bedah Rincian Proyek</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 7. THREE PILLARS OF MASTERY ================= */}
      <section ref={pillarsRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/80 dark:border-white/10 transition-colors">
        <div className={`space-y-3 mb-14 text-center max-w-3xl mx-auto transition-all duration-700 ease-out ${isPillarsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-block px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 text-xs font-bold tracking-widest uppercase border border-indigo-500/30 dark:border-cyan-400/30">
            FOKUS KEAHLIAN
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
            KEAHLIAN <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-cyan-400">UTAMA</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
            Klik kartu bidang di bawah ini untuk langsung mengecek karya nyata dan teknologi yang saya gunakan.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pilar 1 */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => { handleRipple(e); router.push("/projects"); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push("/projects"); }}
            onMouseMove={handleBentoMouseMove}
            className={`group relative overflow-hidden bg-white/80 dark:bg-[#0A162B]/80 border border-slate-200 dark:border-white/10 p-8 rounded-3xl hover:border-indigo-400/60 shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.15)] transition-all duration-500 ease-out hover:-translate-y-2 active:scale-[0.98] backdrop-blur-xl flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400/50 ${isPillarsVisible ? "opacity-100 translate-y-0 delay-100" : "opacity-0 translate-y-10"}`}
          >
            <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.12), transparent 40%)` }} />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-[#0C1B33] flex items-center justify-center border border-indigo-100 dark:border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-400/40 transition-colors duration-300">
                  <svg className="w-7 h-7 text-indigo-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                </div>
                <span className="text-[10px] font-mono px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  Full-Stack Engineering
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                1. Pembuatan Web & Aplikasi Stabil
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Saya membuat aplikasi web yang siap pakai dari frontend sampai backend. Antarmuka cepat diakses, database aman, dan sistem siap menampung lonjakan pengguna tanpa lag.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#030712] border border-slate-200/80 dark:border-white/5 space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> <span className="font-semibold">Performa Kilat & SEO Ramah</span> (Next.js & React)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> <span className="font-semibold">Arsitektur Data Aman</span> (Laravel & PostgreSQL)
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-indigo-600 dark:text-cyan-400 font-bold">
              <span>Buka Portofolio Web App</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </div>
          </div>

          {/* Pilar 2 */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => { handleRipple(e); router.push("/projects"); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push("/projects"); }}
            onMouseMove={handleBentoMouseMove}
            className={`group relative overflow-hidden bg-white/80 dark:bg-[#0A162B]/80 border border-slate-200 dark:border-white/10 p-8 rounded-3xl hover:border-indigo-400/60 shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.15)] transition-all duration-500 ease-out hover:-translate-y-2 active:scale-[0.98] backdrop-blur-xl flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400/50 ${isPillarsVisible ? "opacity-100 translate-y-0 delay-200" : "opacity-0 translate-y-10"}`}
          >
            <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.12), transparent 40%)` }} />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-[#0C1B33] flex items-center justify-center border border-indigo-100 dark:border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-400/40 transition-colors duration-300">
                  <svg className="w-7 h-7 text-indigo-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-[10px] font-mono px-3 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                  Business Intelligence
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                2. Analisis Data & Dashboard Manajemen
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Data mentah dan laporan tabel yang panjang diubah menjadi dashboard visual interaktif yang langsung memberi insight: produk mana yang untung, pos mana yang boros, dan arah tren ke depan.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#030712] border border-slate-200/80 dark:border-white/5 space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span> <span className="font-semibold">Dashboard Eksekutif Cepat Baca</span> (Microsoft Power BI)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span> <span className="font-semibold">Pengolahan & Rumus Metrik</span> (SQL & DAX Modeling)
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-indigo-600 dark:text-cyan-400 font-bold">
              <span>Buka Sampel Dashboard Power BI</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </div>
          </div>

          {/* Pilar 3 */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => { handleRipple(e); router.push("/projects"); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push("/projects"); }}
            onMouseMove={handleBentoMouseMove}
            className={`group relative overflow-hidden bg-white/80 dark:bg-[#0A162B]/80 border border-slate-200 dark:border-white/10 p-8 rounded-3xl hover:border-indigo-400/60 shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.15)] transition-all duration-500 ease-out hover:-translate-y-2 active:scale-[0.98] backdrop-blur-xl flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400/50 ${isPillarsVisible ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-10"}`}
          >
            <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.12), transparent 40%)` }} />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-[#0C1B33] flex items-center justify-center border border-indigo-100 dark:border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-400/40 transition-colors duration-300">
                  <svg className="w-7 h-7 text-indigo-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <span className="text-[10px] font-mono px-3 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  UI/UX & Product Design
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                3. Desain Antarmuka yang Nyaman Dipakai
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Sebelum mulai coding, alur aplikasi dirancang matang di Figma. Hasilnya adalah tombol yang mudah ditemukan, tata letak yang ramah pemula, dan alur transaksi yang tidak membingungkan.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#030712] border border-slate-200/80 dark:border-white/5 space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">✓</span> <span className="font-semibold">Standar Desain Rapi & Konsisten</span> (Design Tokens)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">✓</span> <span className="font-semibold">Bisa Diklik & Dicoba Langsung</span> (Figma Prototype)
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-indigo-600 dark:text-cyan-400 font-bold">
              <span>Buka Prototipe Figma UI/UX</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. BOTTOM CTA ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 mb-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-r from-indigo-500/15 via-blue-500/10 to-cyan-500/10 border border-indigo-400/40 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-2xl shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.25)] transition-shadow duration-500">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
              Langkah Berikutnya
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
              Punya Rencana Proyek atau Posisi yang Cocok?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-normal max-w-xl">
              Saya senang berdiskusi tentang bagaimana teknologi dan data bisa mempercepat target tim Anda. Mari jadwalkan obrolan singkat atau sesi wawancara.
            </p>
          </div>

          <Link 
            href="/contact" 
            onClick={handleRipple} 
            className="group relative overflow-hidden shrink-0 px-8 py-4 rounded-full bg-linear-to-r from-slate-950 to-indigo-950 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 text-xs font-black tracking-widest uppercase transition-all duration-200 shadow-xl shadow-indigo-500/20 hover:shadow-cyan-500/30 hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.96] flex items-center gap-3 cursor-pointer border border-cyan-400/30"
          >
            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            <span className="relative z-10">Hubungi Saya Sekarang</span>
            <span className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-200">→</span>
          </Link>
        </div>
      </section>

      {/* ================= 9. FOOTER ================= */}
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
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-light max-w-md">
                Mengembangkan website handal, dashboard analitik bisnis, dan antarmuka produk yang mempermudah urusan pengguna setiap hari.
              </p>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase">Navigasi Cepat</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li><Link href="/" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Halaman Utama</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/about" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Biografi Lengkap</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/projects" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Galeri Proyek</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/skills" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Keahlian & Tech Stack</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/experience" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Pengalaman Kerja</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase">Aplikasi Unggulan</h4>
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
              <h4 className="text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase">Koneksi Sosial</h4>
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
            <p>© 2026 Najwan Muyassar. Dibuat dengan presisi dan performa tinggi.</p>
            <button 
              onClick={(e) => { handleRipple(e); scrollToTop(); }} 
              className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 cursor-pointer shadow-xs group"
            >
              <span className="relative z-10">Kembali ke Atas</span>
              <svg className="relative z-10 w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Style for Custom Scrollbars & Floater Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fluid-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 6s ease-in-out infinite;
        }
        .hero-gradient-text {
          background: linear-gradient(90deg, #4f46e5, #06b6d4, #2563eb, #06b6d4, #4f46e5);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fluid-gradient 6s linear infinite;
        }
        .dark .hero-gradient-text {
          background: linear-gradient(90deg, #818cf8, #67e8f9, #60a5fa, #67e8f9, #818cf8);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fluid-gradient 6s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 16s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
      `}} />

    </div>
  );
}