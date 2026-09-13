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

  // 1. High-Performance Particle Canvas Engine
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

    const particleCount = Math.min(Math.floor(width / 24), 50); 
    const colors = ["#38bdf8", "#818cf8", "#3b82f6", "#a855f7"]; 

    for (let i = 0; i < particleCount; i++) {
      const vx = prefersReducedMotion ? (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 0.35;
      const vy = prefersReducedMotion ? (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 0.35;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: vx,
        vy: vy,
        baseVx: vx,
        baseVy: vy,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.15,
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
          const distance = Math.hypot(dx, dy);
          const maxDistance = 120; 

          if (distance < maxDistance && distance > 0) {
            const force = (maxDistance - distance) / maxDistance;
            p.vx += (dx / distance) * force * 0.25;
            p.vy += (dy / distance) * force * 0.25;
          }

          p.vx += (p.baseVx - p.vx) * 0.04;
          p.vy += (p.baseVy - p.vy) * 0.04;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distLine = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (distLine < 95) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 0.12 * (1 - distLine / 95);
            ctx.lineWidth = 0.6;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
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
      { threshold: 0.1 }
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

  // Fast & Zero-Lag Ripple Effect
  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    const circle = document.createElement("span");
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.className = "ripple-animation";

    const oldRipple = target.querySelector(".ripple-animation");
    if (oldRipple) oldRipple.remove();

    target.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
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
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      scale: "scale-110",
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
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      scale: "scale-105",
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
    if (slot.is_booked) throw new Error('Slot sudah dipesan');
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
      badge: "IN PROGRESS",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      scale: "scale-95",
      glowColor: "rgba(245, 158, 11, 0.45)",
      accent: "from-amber-500/30 via-orange-600/15 to-transparent",
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
    // Multi-tier workflow validation
    return response()->json(['status' => 'in_progress']);
}`
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500 selection:text-black overflow-hidden font-sans antialiased">

      {/* ================= SPLASH SCREEN ================= */}
      {isLoading && (
        <div
          className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#050811] transition-all duration-700 ease-in-out select-none ${
            isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <div className="absolute w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none animate-pulse" />
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-36 h-36 rounded-full border border-cyan-400/30 border-dashed animate-spin-slow pointer-events-none" />
              <div className="absolute w-32 h-32 rounded-full border-2 border-transparent border-t-cyan-400 border-b-indigo-500 animate-spin pointer-events-none" />
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

      {/* ================= TOP SCROLL PROGRESS BAR ================= */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none bg-white/5">
        <div
          className="h-full bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ================= CANVAS PARTICLE ENGINE ================= */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 opacity-70 pointer-events-none"
      />

      {/* ================= AMBIENT GLOW AURORA ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-120 h-120 rounded-full bg-radial from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] transition-transform duration-300 ease-out pointer-events-none"
          style={{
            transform: `translate3d(${mousePos.x - 240}px, ${mousePos.y - 240}px, 0)`,
          }}
        />
        <div className="absolute -top-32 right-10 w-130 h-130 bg-purple-600/15 blur-[140px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-120 h-120 bg-cyan-600/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-7 text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-xs font-mono tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Available for Projects & Hiring
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
                <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Najwan Muyassar
                </span>
              </h1>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight hero-gradient-text drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
                Full-Stack Developer & UI/UX Designer
              </h2>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
              Halo! Saya membangun aplikasi web yang cepat, stabil, dan nyaman dipakai pengguna nyata. Dari logika database di balik layar sampai detail antarmuka interaktif dan visualisasi analitik bisnis.
            </p>

            {/* ACTION BUTTONS WITH FULL ANIMATION & RIPPLE */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/projects"
                onClick={handleRipple}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-linear-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:-translate-y-1 active:translate-y-1 active:scale-95 transition-all duration-200 border border-cyan-300/40 cursor-pointer select-none"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                <span className="relative z-10 font-black">Lihat Hasil Karya Saya</span>
                <span className="relative z-10 text-base transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
              </Link>

              <Link
                href="/contact"
                onClick={handleRipple}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 border border-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 cursor-pointer select-none backdrop-blur-xl"
              >
                <span className="relative z-10">Ajak Ngobrol Santai</span>
                <span className="relative z-10 transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-110 sm:min-h-130">
            <div className="absolute w-80 sm:w-110 h-80 sm:h-110 bg-radial from-cyan-500/20 via-blue-500/15 to-transparent rounded-full blur-[80px] pointer-events-none animate-pulse" />
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full border border-cyan-400/20 pointer-events-none flex items-center justify-center">
              <div className="absolute inset-2 rounded-full border border-dashed border-indigo-400/30 animate-spin-slow pointer-events-none" />
            </div>

            <div className="relative z-10 w-full max-w-90 sm:max-w-105 flex items-end justify-center pointer-events-none">
              <img
                src="/najwan-removebg.png"
                alt="Najwan Muyassar"
                className="w-full h-auto max-h-120 object-contain object-bottom filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] select-none"
                style={{
                  maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ================= TECH STACK MARQUEE ================= */}
      <section className="relative z-10 w-full bg-[#090e1c]/80 backdrop-blur-xl border-y border-white/10 py-6 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#070b14] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#070b14] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
          <div className="flex items-center gap-6 pr-6">
            {techLogos.map((tech, idx) => (
              <div key={`tech-1-${idx}`} className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-105 shrink-0">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <img src={tech.iconUrl} alt={tech.name} className="w-full h-full object-contain filter drop-shadow-sm" loading="lazy" />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">{tech.name}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pr-6" aria-hidden="true">
            {techLogos.map((tech, idx) => (
              <div key={`tech-2-${idx}`} className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-105 shrink-0">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <img src={tech.iconUrl} alt={tech.name} className="w-full h-full object-contain filter drop-shadow-sm" loading="lazy" />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT HIGHLIGHT SECTION ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center items-center">
            <div className="absolute -inset-6 bg-linear-to-tr from-cyan-500/25 via-blue-600/25 to-purple-600/30 rounded-[3rem] blur-3xl opacity-75 animate-[pulse_4s_ease-in-out_infinite] pointer-events-none" />

            <div className="relative w-72 sm:w-84 h-104 rounded-3xl overflow-hidden bg-[#0A162B] p-2 border border-white/20 shadow-2xl backdrop-blur-xl group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                {aboutProfileImages.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Najwan Muyassar About ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-1000 ease-in-out ${
                      currentImgIdx === index ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-linear-to-t from-[#030712]/90 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-widest uppercase border border-cyan-400/30">
              TENTANG SAYA
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight text-white">
              FOKUS PADA <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400">HASIL & KUALITAS</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Bagi saya, aplikasi yang hebat adalah aplikasi yang menyelesaikan masalah nyata secara terstruktur dan efisien. Saya memadukan logika teknis yang rapi, tampilan antarmuka yang modern, dan data analitik yang tepat sasaran.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                href="/about" 
                onClick={handleRipple} 
                className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-linear-to-r from-white to-slate-200 text-slate-950 px-8 py-4 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-lg hover:shadow-cyan-400/30 hover:-translate-y-1 active:translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span className="relative z-10">Kenal Lebih Dekat</span>
                <span className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RECENT PROJECT SHOWCASE ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase border border-cyan-400/30">
              PORTFOLIO
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              PROYEK <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500">PILIHAN</span>
            </h2>
          </div>

          <Link 
            href="/projects" 
            onClick={handleRipple} 
            className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 hover:border-cyan-400/50 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-all duration-200 bg-[#0A1428]/80 backdrop-blur-xl shadow-xs hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] active:translate-y-0.5 active:scale-95"
          >
            <span className="relative z-10">Lihat Semua Proyek</span>
            <span className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((project, idx) => (
            <div 
              key={project.id} 
              role="button"
              tabIndex={0}
              onClick={(e) => { 
                handleRipple(e); 
                openModal(project); 
              }}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(project); 
                }
              }}
              className="relative group rounded-3xl p-px transition-all duration-300 hover:-translate-y-2 active:scale-[0.98] active:translate-y-1 flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {/* Glow backdrop on hover */}
              <div 
                className="absolute -inset-0.5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                style={{ background: `linear-gradient(135deg, ${project.glowColor}, transparent 70%)` }} 
              />
              
              <div className="relative h-full flex flex-col justify-between rounded-3xl bg-[#091122]/90 backdrop-blur-2xl border border-white/10 group-hover:border-cyan-400/60 p-7 shadow-xl group-hover:shadow-[0_15px_40px_rgba(6,182,212,0.2)] transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[11px] font-bold text-slate-400">0{idx + 1}</span>
                    <span className={`px-2.5 py-1 rounded-md border font-mono text-[10px] font-semibold uppercase tracking-wider ${project.badgeColor}`}>
                      {project.badge}
                    </span>
                  </div>

                  <div className="relative w-full h-48 rounded-2xl flex items-center justify-center p-4 my-2 overflow-hidden bg-[#0c172e] border border-white/5 group-hover:border-cyan-400/30 transition-all duration-300">
                    <div className={`absolute inset-0 bg-radial ${project.accent} opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                    <div className="relative z-10 w-28 h-28 rounded-2xl overflow-hidden bg-white/95 flex items-center justify-center p-2.5 shadow-xl border border-white/20 group-hover:scale-105 transition-transform duration-300">
                      <img src={project.image} alt={project.title} className={`w-full h-full object-contain filter brightness-[1.02] contrast-[1.1] ${project.scale}`} />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mt-4">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-normal mt-1.5 line-clamp-2 leading-relaxed">
                    {project.category}
                  </p>
                </div>

                {/* Tombol Bedah Rincian Proyek */}
                <div className="pt-5 mt-6 border-t border-white/10">
                  <div className="w-full py-3 px-4 rounded-xl bg-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-linear-to-r group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <span>Bedah Rincian Proyek</span>
                    <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= THREE PILLARS OF MASTERY ================= */}
      <section ref={pillarsRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-white/10">
        <div className={`space-y-3 mb-14 text-center max-w-3xl mx-auto transition-all duration-700 ease-out ${isPillarsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-block px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-widest uppercase border border-cyan-400/30">
            FOKUS KEAHLIAN
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            KEAHLIAN <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400">UTAMA</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
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
            className={`group relative overflow-hidden bg-[#091122]/90 border border-white/10 p-8 rounded-3xl hover:border-cyan-400/60 shadow-xl hover:shadow-[0_15px_40px_rgba(6,182,212,0.2)] transition-all duration-500 ease-out hover:-translate-y-2 active:translate-y-1 active:scale-95 backdrop-blur-xl flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isPillarsVisible ? "opacity-100 translate-y-0 delay-100" : "opacity-0 translate-y-10"}`}
          >
            <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(6,182,212,0.15), transparent 40%)` }} />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-400/20 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-colors duration-300">
                  <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                </div>
                <span className="text-[10px] font-mono px-3 py-1 rounded-md bg-cyan-500/15 text-cyan-300 font-bold uppercase tracking-wider border border-cyan-500/30">
                  Full-Stack Engineering
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                1. Pembuatan Web & Aplikasi Stabil
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Saya membuat aplikasi web yang siap pakai dari frontend sampai backend. Antarmuka cepat diakses, database aman, dan sistem siap menampung traffic tinggi.
              </p>

              <div className="p-4 rounded-2xl bg-[#050811] border border-white/5 space-y-2 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> <span className="font-semibold text-white">Performa Kilat & SEO Ramah</span> (Next.js & React)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> <span className="font-semibold text-white">Arsitektur Data Aman</span> (Laravel & PostgreSQL)
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-cyan-400 font-bold">
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
            className={`group relative overflow-hidden bg-[#091122]/90 border border-white/10 p-8 rounded-3xl hover:border-amber-400/60 shadow-xl hover:shadow-[0_15px_40px_rgba(245,158,11,0.2)] transition-all duration-500 ease-out hover:-translate-y-2 active:translate-y-1 active:scale-95 backdrop-blur-xl flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 ${isPillarsVisible ? "opacity-100 translate-y-0 delay-200" : "opacity-0 translate-y-10"}`}
          >
            <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(245,158,11,0.15), transparent 40%)` }} />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-400/20 group-hover:bg-amber-500/20 group-hover:border-amber-400/50 transition-colors duration-300">
                  <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-[10px] font-mono px-3 py-1 rounded-md bg-amber-500/15 text-amber-300 font-bold uppercase tracking-wider border border-amber-500/30">
                  Business Intelligence
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                2. Analisis Data & Dashboard Manajemen
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Data mentah dan laporan tabel yang panjang diubah menjadi dashboard visual interaktif yang langsung memberi insight: pos yang menguntungkan dan tren metrik masa depan.
              </p>

              <div className="p-4 rounded-2xl bg-[#050811] border border-white/5 space-y-2 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span> <span className="font-semibold text-white">Dashboard Eksekutif Cepat Baca</span> (Microsoft Power BI)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span> <span className="font-semibold text-white">Pengolahan & Rumus Metrik</span> (SQL & DAX Modeling)
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-amber-400 font-bold">
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
            className={`group relative overflow-hidden bg-[#091122]/90 border border-white/10 p-8 rounded-3xl hover:border-purple-400/60 shadow-xl hover:shadow-[0_15px_40px_rgba(168,85,247,0.2)] transition-all duration-500 ease-out hover:-translate-y-2 active:translate-y-1 active:scale-95 backdrop-blur-xl flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 ${isPillarsVisible ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-10"}`}
          >
            <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(168,85,247,0.15), transparent 40%)` }} />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-400/20 group-hover:bg-purple-500/20 group-hover:border-purple-400/50 transition-colors duration-300">
                  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <span className="text-[10px] font-mono px-3 py-1 rounded-md bg-purple-500/15 text-purple-300 font-bold uppercase tracking-wider border border-purple-500/30">
                  UI/UX & Product Design
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                3. Desain Antarmuka yang Nyaman Dipakai
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Sebelum mulai penulisan kode, alur aplikasi dirancang matang di Figma. Hasilnya adalah tata letak intuitif, ramah pengguna, dan tanpa kebingungan alur.
              </p>

              <div className="p-4 rounded-2xl bg-[#050811] border border-white/5 space-y-2 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">✓</span> <span className="font-semibold text-white">Standar Desain Rapi & Konsisten</span> (Design Tokens)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">✓</span> <span className="font-semibold text-white">Bisa Diklik & Dicoba Langsung</span> (Figma Prototype)
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-purple-400 font-bold">
              <span>Buka Prototipe Figma UI/UX</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 mb-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-r from-cyan-500/15 via-blue-600/10 to-purple-600/15 border border-cyan-400/40 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-2xl shadow-[0_10px_35px_rgba(6,182,212,0.15)] hover:shadow-[0_15px_45px_rgba(6,182,212,0.3)] transition-all duration-500">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider border border-cyan-400/30">
              Langkah Berikutnya
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              Punya Rencana Proyek atau Posisi yang Cocok?
            </h3>
            <p className="text-slate-300 text-sm font-normal max-w-xl">
              Saya senang berdiskusi tentang bagaimana teknologi web dan analitik data bisa mempercepat target produk Anda.
            </p>
          </div>

          <Link 
            href="/contact" 
            onClick={handleRipple} 
            className="group relative overflow-hidden shrink-0 px-9 py-4.5 rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white text-xs font-black tracking-widest uppercase transition-all duration-200 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:-translate-y-1 active:translate-y-1 active:scale-95 flex items-center gap-3 cursor-pointer border border-cyan-200/50"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            <span className="relative z-10">Hubungi Saya Sekarang</span>
            <span className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-200">→</span>
          </Link>
        </div>
      </section>

      {/* ================= PROJECT DETAIL MODAL (HIGH SAAS) ================= */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md transition-opacity" 
            onClick={closeModal} 
          />

          {/* Modal Card Content */}
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#091122] border border-cyan-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  {selectedProject.badge}
                </span>
                <h3 className="text-xl font-black text-white">{selectedProject.title}</h3>
              </div>
              <button 
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-6 bg-[#060a14]">
              <button 
                onClick={() => setActiveTab("showcase")}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                  activeTab === "showcase" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Overview & Metrik
              </button>
              <button 
                onClick={() => setActiveTab("code")}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                  activeTab === "code" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Snippet & Arsitektur
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-sm">
              {activeTab === "showcase" ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedProject.metrics?.map((m: any, i: number) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className="text-lg font-black text-cyan-400">{m.value}</div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Tantangan & Solusi:</h4>
                    <p className="text-slate-300 leading-relaxed"><span className="text-white font-semibold">Tantangan:</span> {selectedProject.challenge}</p>
                    <p className="text-slate-300 leading-relaxed"><span className="text-cyan-400 font-semibold">Solusi:</span> {selectedProject.solution}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Fitur Utama:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {selectedProject.highlights?.map((h: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-cyan-400 font-bold">✓</span> {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Teknologi Terpasang:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack?.map((t: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">Kode Telemetri / Handler Inti</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white/10 text-cyan-400">TypeScript / PHP</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-[#030610] border border-white/10 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
                    <code>{selectedProject.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Footer Modal Action */}
            <div className="p-5 border-t border-white/10 flex items-center justify-between bg-white/5">
              <button 
                onClick={closeModal}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Tutup
              </button>

              {selectedProject.demoLink && selectedProject.demoLink !== "#" ? (
                <a 
                  href={selectedProject.demoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{selectedProject.demoLabel}</span>
                  <span>↗</span>
                </a>
              ) : (
                <span className="text-xs font-mono text-amber-400 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                  {selectedProject.demoLabel}
                </span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4">
        <div className="relative rounded-[2.5rem] bg-[#080f1e]/90 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 sm:p-12 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 border-b border-white/10">
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center">
                  <div className="absolute -inset-2 rounded-2xl bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 blur-lg opacity-70 animate-pulse pointer-events-none" />
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#030712] border border-cyan-400/40 shadow-xl flex items-center justify-center p-0.5">
                    <img src="/logo-najwan.jpg" alt="Najwan Muyassar Logo" className="w-full h-full object-cover rounded-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-wider text-white leading-tight">NAJWAN MUYASSAR</h3>
                  <p className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-widest mt-0.5">Full-Stack Dev • Data Analyst • UI/UX</p>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light max-w-md">
                Mengembangkan website handal, dashboard analitik bisnis, dan antarmuka produk yang mempermudah urusan pengguna setiap hari.
              </p>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">Navigasi Cepat</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-300">
                <li><Link href="/" className="hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Halaman Utama</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/about" className="hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Biografi Lengkap</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/projects" className="hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Galeri Proyek</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/skills" className="hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Keahlian & Tech Stack</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
                <li><Link href="/experience" className="hover:text-cyan-400 transition-colors flex items-center justify-between group"><span>Pengalaman Kerja</span><span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span></Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">Aplikasi Unggulan</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-300">
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-400/30 transition-colors cursor-pointer group">
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">VictoryArena</span>
                  <span className="text-[10px] font-mono text-slate-400">Sport Booking</span>
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-400/30 transition-colors cursor-pointer group">
                  <span className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">MindHaven</span>
                  <span className="text-[10px] font-mono text-slate-400">Mental Health</span>
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-amber-400/30 transition-colors cursor-pointer group">
                  <span className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">Petty Claim</span>
                  <span className="text-[10px] font-mono text-slate-400">Finance SaaS</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">Koneksi Sosial</h4>
              <div className="flex flex-col gap-2.5">
                <a href="https://github.com/Cartennzy" target="_blank" rel="noreferrer" onClick={handleRipple} className="relative overflow-hidden flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-slate-950 border border-white/10 text-slate-200 transition-all duration-200 group shadow-xs active:scale-95">
                  <span className="relative z-10 text-xs font-semibold">GitHub</span>
                  <span className="relative z-10 text-xs">↗</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" onClick={handleRipple} className="relative overflow-hidden flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-[#0A66C2] hover:text-white border border-white/10 text-slate-200 transition-all duration-200 group shadow-xs active:scale-95">
                  <span className="relative z-10 text-xs font-semibold">LinkedIn</span>
                  <span className="relative z-10 text-xs">↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <p>© 2026 Najwan Muyassar. Dibuat dengan performa presisi tinggi.</p>
            <button 
              onClick={(e) => { handleRipple(e); scrollToTop(); }} 
              className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-cyan-400 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 cursor-pointer shadow-xs group"
            >
              <span className="relative z-10">Kembali ke Atas</span>
              <span className="relative z-10 group-hover:-translate-y-1 transition-transform">↑</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Style Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ripple-effect {
          from { transform: scale(0); opacity: 0.6; }
          to { transform: scale(3.2); opacity: 0; }
        }
        .ripple-animation {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: ripple-effect 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
          z-index: 30;
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .hero-gradient-text {
          background: linear-gradient(90deg, #38bdf8, #818cf8, #3b82f6, #06b6d4, #38bdf8);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fluid-gradient 7s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 18s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.6); }
      `}} />

    </div>
  );
}