"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPillarsVisible, setIsPillarsVisible] = useState(false);

  // Splash Screen State Machine (5 Detik Full-Animation)
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [hudPhase, setHudPhase] = useState("CORE_INIT");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("showcase");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 }); 
  const pillarsRef = useRef<HTMLElement | null>(null);

  // Splash Screen 5 Detik Timer & Phase Controller
  useEffect(() => {
    const phases = [
      "SYSTEM_KERNEL_CHECK",
      "CALIBRATING_PARTICLE_GRID",
      "INITIALIZING_RUNTIME_SERVICES",
      "SYNCHRONIZING_ARCHITECTURE_MODELS",
      "READY_ENTERPRISE_SYSTEM"
    ];

    let currentPhaseIndex = 0;
    const phaseInterval = setInterval(() => {
      currentPhaseIndex++;
      if (currentPhaseIndex < phases.length) {
        setHudPhase(phases[currentPhaseIndex]);
      }
    }, 950);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 750);
    }, 5000);

    return () => {
      clearInterval(phaseInterval);
      clearTimeout(timer);
    };
  }, []);

  // 1. Particle Canvas Engine
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

    const particleCount = Math.min(Math.floor(width / 18), 75); 
    const colors = ["#06b6d4", "#6366f1", "#3b82f6", "#a855f7", "#10b981", "#f59e0b"]; 

    for (let i = 0; i < particleCount; i++) {
      const vx = prefersReducedMotion ? (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 0.45;
      const vy = prefersReducedMotion ? (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 0.45;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: vx,
        vy: vy,
        baseVx: vx,
        baseVy: vy,
        size: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.45 + 0.25,
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
          const maxDistance = 140; 

          if (distance < maxDistance && distance > 0) {
            const force = (maxDistance - distance) / maxDistance;
            p.vx += (dx / distance) * force * 0.3;
            p.vy += (dy / distance) * force * 0.3;
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
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distLine = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (distLine < 100) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 0.18 * (1 - distLine / 100);
            ctx.lineWidth = 0.75;
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

  // Zero-Lag Dynamic Ripple Effect
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
    { name: "React 19", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", borderHover: "hover:border-cyan-400" },
    { name: "Next.js 15", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", borderHover: "hover:border-slate-300" },
    { name: "TypeScript", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", borderHover: "hover:border-blue-400" },
    { name: "Tailwind CSS", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", borderHover: "hover:border-teal-400" },
    { name: "Node.js", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", borderHover: "hover:border-emerald-400" },
    { name: "Laravel 10", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg", borderHover: "hover:border-rose-400" },
    { name: "PostgreSQL", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", borderHover: "hover:border-indigo-400" },
    { name: "MySQL", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", borderHover: "hover:border-amber-400" },
    { name: "Power BI", iconUrl: "/logo-powerbi.png", borderHover: "hover:border-yellow-400" },
    { name: "Figma", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", borderHover: "hover:border-purple-400" },
  ];

  const projects = [
    {
      id: "mental-health",
      title: "Sistem Layanan Kesehatan Mental (MindHaven)",
      category: "Full-Stack Web App, Portal Konsultasi & Asesmen",
      image: "/logo-mindhaven.jpg",
      link: "https://mind-haven-opal.vercel.app/",
      accentGradient: "from-emerald-500/25 via-teal-500/10 to-transparent",
      cardBorder: "border-emerald-500/40 hover:border-emerald-400",
      btnGradient: "from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500",
      scale: "scale-105",
      glowColor: "rgba(16, 185, 129, 0.45)",
      demoLink: "https://mind-haven-opal.vercel.app/",
      demoLabel: "Buka Website",
      challenge: "Menyediakan layanan konsultasi daring yang responsif, stabil, dan melindungi privasi data rekam medis pasien.",
      solution: "Membangun sistem web menggunakan Next.js dan backend Laravel terhubung basis data relasional MySQL teroptimasi.",
      techStack: ["Next.js", "Laravel", "MySQL", "Tailwind CSS"],
      highlights: [
        "Sistem Penjadwalan Sesi Konsultasi",
        "Penyimpanan Rekam Medis Terproteksi",
        "Modul Asesmen Psikologis Mandiri",
        "Dashboard Terpadu Konselor & Pengguna"
      ],
      codeSnippet: `// mindhaven_consultation_pipeline.ts
export const handlePatientBooking = async (payload: BookingRecord) => {
  const isAvailable = await db('schedules').where({ slot: payload.time }).first();
  if (!isAvailable) throw new Error('Slot tidak tersedia');
  await db('appointments').insert(payload);
  return { status: 'success', timestamp: Date.now() };
};`
    },
    {
      id: "futsal-booking",
      title: "Sistem Reservasi Lapangan Futsal (Victory Arena)",
      category: "Full-Stack Web App, Manajemen Jadwal & Pembayaran Online",
      image: "/logo-victory-arena.png",
      link: "https://victory-arena-zeta.vercel.app/",
      accentGradient: "from-blue-600/25 via-indigo-600/10 to-transparent",
      cardBorder: "border-blue-500/40 hover:border-blue-400",
      btnGradient: "from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-indigo-500",
      scale: "scale-105",
      glowColor: "rgba(59, 130, 246, 0.45)",
      desc: "Aplikasi pemesanan lapangan olahraga real-time untuk mencegah konflik jadwal ganda secara otomatis.",
      demoLink: "https://victory-arena-zeta.vercel.app/",
      demoLabel: "Buka Website",
      challenge: "Menghilangkan kendala bentrok pencatatan jadwal saat beban transaksi tinggi di akhir pekan.",
      solution: "Mengintegrasikan transaksi locking pada MySQL database dan update ketersediaan slot antarmuka secara presisi.",
      techStack: ["React", "Node.js", "MySQL", "Express"],
      highlights: [
        "Matriks Ketersediaan Slot Real-time",
        "Pencegahan Duplikasi Slot Otomatis",
        "Dashboard Rekap Finansial Pemilik",
        "Struk Konfirmasi Digital Terintegrasi"
      ],
      codeSnippet: `// victory_booking_strategy.ts
const bookSlot = async (slotId: number, userId: string) => {
  return await db.transaction(async (trx) => {
    const slot = await trx('court_slots').where({ id: slotId }).forUpdate();
    if (slot.is_booked) throw new Error('Slot sudah dipesan');
    await trx('reservations').insert({ slot_id: slotId, user_id: userId });
  });
};`
    },
    {
      id: "petty-claim",
      title: "Sistem Reimbursement Kas Perusahaan (Petty Claim)",
      category: "Enterprise Financial System & Workflow Persetujuan",
      image: "/logo-pettyclaim.jpg",
      link: "#",
      accentGradient: "from-amber-500/25 via-orange-500/10 to-transparent",
      cardBorder: "border-amber-500/40 hover:border-amber-400",
      btnGradient: "from-amber-500 via-orange-600 to-amber-600 hover:from-amber-400 hover:to-orange-500",
      scale: "scale-95",
      glowColor: "rgba(245, 158, 11, 0.45)",
      desc: "Platform pengelolaan kas operasional dan validasi pengajuan klaim berjenjang untuk akurasi audit keuangan.",
      demoLink: "#",
      demoLabel: "Tahap Rilis",
      challenge: "Digitalisasi alur klaim berbasis dokumen fisik menjadi sistem terpadu yang transparan dan dapat diaudit menyeluruh.",
      solution: "Merancang mekanisme multi-tier approval menggunakan Laravel dan PostgreSQL untuk integritas relasi foreign key dan audit trail.",
      techStack: ["Laravel 10", "Vue.js", "PostgreSQL", "Docker"],
      highlights: [
        "Alur Persetujuan Bertingkat (Multi-tier)",
        "Pencatatan Audit Log Permanen",
        "Penyimpanan Bukti Transaksi Digital",
        "Ekspor Rekap Laporan Finansial"
      ],
      codeSnippet: `// PettyClaim Approval Engine (PHP/Laravel)
public function approveClaim(ClaimRequest $request, int $claimId) {
    return DB::transaction(function () use ($request, $claimId) {
        $claim = PettyClaim::lockForUpdate()->findOrFail($claimId);
        $claim->update(['status' => 'APPROVED', 'approved_by' => auth()->id()]);
        AuditLog::create(['event' => 'CLAIM_APPROVED', 'claim_id' => $claimId]);
        return response()->json(['success' => true]);
    });
}`
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 selection:bg-cyan-500 selection:text-white overflow-hidden font-sans antialiased transition-colors duration-300">

      {/* ================= HIGH-TIER 5S ENTERPRISE SPLASH SCREEN ================= */}
      {isLoading && (
        <div
          className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#040711] transition-all duration-700 ease-in-out select-none ${
            isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          {/* Spatial Grid & Ray Aura */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2)_0,transparent_65%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

          {/* Kinetic Auroras */}
          <div className="absolute w-120 h-120 rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none animate-pulse" />
          <div className="absolute w-96 h-96 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />

          {/* Interactive Core Assembly */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            
            <div className="relative flex items-center justify-center w-56 h-56 mb-8">
              {/* Outer Orbit Halo 1 */}
              <div className="absolute inset-0 rounded-full border border-cyan-400/25 border-dashed animate-spin-slow pointer-events-none" />
              {/* Counter Rotating Ring */}
              <div className="absolute inset-3 rounded-full border border-indigo-500/30 border-t-cyan-400 border-r-transparent animate-[spin_4.5s_linear_infinite_reverse] pointer-events-none" />
              {/* Pulsing Core Atmosphere */}
              <div className="absolute inset-6 rounded-full border border-emerald-400/20 animate-ping pointer-events-none" />
              
              {/* Laser Scan Sweep Line */}
              <div className="absolute inset-x-4 h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent animate-[scan_2.2s_ease-in-out_infinite] shadow-[0_0_15px_#22d3ee] pointer-events-none z-20" />

              {/* Central Logo Matrix Shield */}
              <div className="relative w-28 h-28 rounded-3xl overflow-hidden bg-[#091122] border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.45)] p-1.5 flex items-center justify-center z-10">
                <img
                  src="/logo-najwan.jpg"
                  alt="Najwan Muyassar Logo"
                  className="w-full h-full object-cover rounded-2xl filter brightness-105"
                />
              </div>
            </div>

            {/* Clean Identity Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-[0.25em] text-white">
                NAJWAN <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">MUYASSAR</span>
              </h2>
              <p className="text-xs font-mono text-cyan-400/90 uppercase tracking-widest">
                SYSTEM ARCHITECT & DEVELOPER
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{hudPhase}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= CANVAS PARTICLE ENGINE ================= */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 opacity-45 dark:opacity-75 pointer-events-none"
      />

      {/* ================= COLORFUL AMBIENT BACKGROUND GLOWS ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-120 h-120 rounded-full bg-radial from-cyan-500/20 via-blue-500/10 to-transparent blur-[120px] transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mousePos.x - 240}px, ${mousePos.y - 240}px, 0)`,
          }}
        />
        <div className="absolute -top-32 right-10 w-130 h-130 bg-purple-600/15 blur-[140px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-120 h-120 bg-emerald-600/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[48px_48px]" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Najwan Muyassar
              </h1>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                Full-Stack Developer & UI/UX Designer
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
              Halo! Saya membangun aplikasi web yang cepat, stabil, dan nyaman dipakai pengguna nyata. Dari logika database di balik layar sampai detail antarmuka interaktif dan visualisasi analitik bisnis.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/projects"
                onClick={handleRipple}
                className="group relative overflow-hidden inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-linear-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 active:brightness-90 cursor-pointer select-none border border-cyan-300/30"
              >
                <span className="relative z-10">Lihat Hasil Karya Saya</span>
              </Link>

              <Link
                href="/contact"
                onClick={handleRipple}
                className="group relative overflow-hidden inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/70 dark:bg-[#091224] hover:bg-slate-100 dark:hover:bg-[#0e1c38] text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 border border-slate-300 dark:border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 active:brightness-90 cursor-pointer select-none backdrop-blur-md"
              >
                <span className="relative z-10">Ajak Ngobrol Santai</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-95">
            <div className="absolute w-72 sm:w-88 h-72 sm:h-88 rounded-full border border-cyan-400/30 dark:border-cyan-400/25 pointer-events-none" />
            <div className="absolute w-84 sm:w-96 h-84 sm:h-96 rounded-full border border-dashed border-indigo-400/30 dark:border-indigo-400/20 pointer-events-none animate-spin-slow" />

            <div className="relative z-10 w-full max-w-85 flex items-end justify-center pointer-events-none">
              <img
                src="/najwan-removebg.png"
                alt="Najwan Muyassar"
                className="w-full h-auto max-h-115 object-contain object-bottom filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] select-none"
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
      <section className="relative z-10 w-full bg-slate-100/90 dark:bg-[#090e1c]/90 border-y border-slate-200 dark:border-cyan-500/20 py-5 overflow-hidden backdrop-blur-md">
        <div className="flex w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
          <div className="flex items-center gap-4 pr-4">
            {techLogos.map((tech, idx) => (
              <div key={`tech-1-${idx}`} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 ${tech.borderHover} hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] shrink-0 transition-all duration-200 hover:scale-105`}>
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <img src={tech.iconUrl} alt={tech.name} className="w-full h-full object-contain" loading="lazy" />
                </div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">{tech.name}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pr-4" aria-hidden="true">
            {techLogos.map((tech, idx) => (
              <div key={`tech-2-${idx}`} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 ${tech.borderHover} hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] shrink-0 transition-all duration-200 hover:scale-105`}>
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <img src={tech.iconUrl} alt={tech.name} className="w-full h-full object-contain" loading="lazy" />
                </div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT HIGHLIGHT SECTION ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center items-center">
            <div className="absolute -inset-4 bg-linear-to-tr from-cyan-500/30 via-blue-600/20 to-purple-600/30 rounded-3xl blur-2xl opacity-75 pointer-events-none" />
            <div className="relative w-64 sm:w-76 h-96 rounded-2xl overflow-hidden bg-slate-900 border-2 border-cyan-400/40 shadow-2xl">
              {aboutProfileImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Najwan Muyassar Profil ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-1000 ease-in-out ${
                    currentImgIdx === index ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase leading-snug">
              <span className="bg-linear-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-white dark:via-sky-200 dark:to-blue-400 bg-clip-text text-transparent">
                Fokus Pada Hasil & Kualitas
              </span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
              Bagi saya, aplikasi yang hebat adalah aplikasi yang menyelesaikan masalah nyata secara terstruktur dan efisien. Saya memadukan logika teknis yang rapi, tampilan antarmuka yang modern, dan data analitik yang tepat sasaran.
            </p>

            <div className="pt-2">
              <Link 
                href="/about" 
                onClick={handleRipple} 
                className="group relative overflow-hidden inline-flex items-center px-7 py-3.5 rounded-xl bg-linear-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-950 font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-cyan-400/20 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 active:brightness-90 cursor-pointer"
              >
                <span className="relative z-10">Kenal Lebih Dekat</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RECENT PROJECT SHOWCASE ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-slate-200 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
              <span className="bg-linear-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-white dark:via-sky-200 dark:to-blue-400 bg-clip-text text-transparent">
                Proyek Pilihan
              </span>
            </h2>
          </div>

          <Link 
            href="/projects" 
            onClick={handleRipple} 
            className="group relative overflow-hidden inline-flex items-center px-5 py-2.5 rounded-xl border border-cyan-500/30 hover:border-cyan-400 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0A1428] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-200 active:translate-y-0.5 active:scale-95 active:brightness-90"
          >
            <span className="relative z-10">Lihat Semua Proyek</span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className={`relative group rounded-2xl border ${project.cardBorder} bg-white dark:bg-[#091122] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl active:translate-y-0.5 active:scale-98 focus:outline-none focus:ring-2 focus:ring-cyan-400 overflow-hidden`}
            >
              <div className={`absolute -inset-1 bg-linear-to-b ${project.accentGradient} opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-slate-400">0{idx + 1}</span>
                  <span className="font-mono text-xs font-semibold text-slate-400">Architecture Spec</span>
                </div>

                <div className="relative w-full h-44 rounded-xl flex items-center justify-center p-3 mb-4 bg-slate-100 dark:bg-[#0c172e] border border-slate-200 dark:border-white/10 group-hover:border-cyan-400/40 transition-colors">
                  <div className="w-24 h-24 rounded-xl bg-white dark:bg-white/95 flex items-center justify-center p-2 shadow-md border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform duration-300">
                    <img src={project.image} alt={project.title} className={`w-full h-full object-contain ${project.scale}`} />
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1.5 line-clamp-2 leading-relaxed">
                  {project.category}
                </p>
              </div>

              <div className="relative z-10 pt-4 mt-5 border-t border-slate-100 dark:border-white/10">
                <div className={`w-full py-2.5 px-3 rounded-xl bg-linear-to-r ${project.btnGradient} text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all duration-200 shadow-sm group-hover:shadow-md`}>
                  <span>Bedah Rincian Proyek</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= THREE PILLARS OF MASTERY ================= */}
      <section ref={pillarsRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-slate-200 dark:border-white/10">
        <div className={`space-y-2 mb-10 text-center max-w-3xl mx-auto transition-all duration-500 ${isPillarsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
            <span className="bg-linear-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-white dark:via-sky-200 dark:to-blue-400 bg-clip-text text-transparent">
              Keahlian Utama
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
            Klik kartu bidang di bawah ini untuk langsung mengecek karya nyata dan teknologi yang saya gunakan.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pilar 1 */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => { handleRipple(e); router.push("/projects"); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push("/projects"); }}
            onMouseMove={handleBentoMouseMove}
            className="group relative overflow-hidden bg-white dark:bg-[#091122] border-2 border-cyan-500/30 hover:border-cyan-400 p-6 rounded-2xl shadow-sm hover:shadow-[0_10px_30px_rgba(6,182,212,0.25)] transition-all duration-300 hover:-translate-y-1.5 active:translate-y-0.5 active:scale-98 active:brightness-90 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3.5 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 flex items-center justify-center border border-cyan-400/40 text-cyan-600 dark:text-cyan-400 shadow-xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                1. Pembuatan Web & Aplikasi Stabil
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-normal">
                Saya membuat aplikasi web yang siap pakai dari frontend sampai backend. Antarmuka cepat diakses, database aman, dan sistem siap menampung traffic tinggi.
              </p>

              <div className="p-3 rounded-xl bg-cyan-500/5 dark:bg-[#050811] border border-cyan-500/20 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-500 font-bold">•</span> Next.js, React, Tailwind CSS
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-500 font-bold">•</span> Node.js, Express, Full-Stack Architecture
                </div>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-bold relative z-10">
              <span>Buka Portofolio Web App</span>
            </div>
          </div>

          {/* Pilar 2 */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => { handleRipple(e); router.push("/projects"); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push("/projects"); }}
            onMouseMove={handleBentoMouseMove}
            className="group relative overflow-hidden bg-white dark:bg-[#091122] border-2 border-amber-500/30 hover:border-amber-400 p-6 rounded-2xl shadow-sm hover:shadow-[0_10px_30px_rgba(245,158,11,0.25)] transition-all duration-300 hover:-translate-y-1.5 active:translate-y-0.5 active:scale-98 active:brightness-90 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3.5 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center border border-amber-400/40 text-amber-600 dark:text-amber-400 shadow-xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                2. Analisis Data & Dashboard Manajemen
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-normal">
                Data mentah dan laporan tabel yang panjang diubah menjadi dashboard visual interaktif yang langsung memberi insight efisien dan tren metrik masa depan.
              </p>

              <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-[#050811] border border-amber-500/20 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">•</span> Microsoft Power BI
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">•</span> SQL & DAX Modeling
                </div>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold relative z-10">
              <span>Buka Sampel Dashboard Power BI</span>
            </div>
          </div>

          {/* Pilar 3 */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => { handleRipple(e); router.push("/projects"); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push("/projects"); }}
            onMouseMove={handleBentoMouseMove}
            className="group relative overflow-hidden bg-white dark:bg-[#091122] border-2 border-purple-500/30 hover:border-purple-400 p-6 rounded-2xl shadow-sm hover:shadow-[0_10px_30px_rgba(168,85,247,0.25)] transition-all duration-300 hover:-translate-y-1.5 active:translate-y-0.5 active:scale-98 active:brightness-90 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3.5 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center border border-purple-400/40 text-purple-600 dark:text-purple-400 shadow-xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                3. Desain Antarmuka yang Nyaman Dipakai
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-normal">
                Sebelum mulai penulisan kode, alur aplikasi dirancang matang di Figma. Hasilnya adalah tata letak intuitif, ramah pengguna, dan tanpa kebingungan alur.
              </p>

              <div className="p-3 rounded-xl bg-purple-500/5 dark:bg-[#050811] border border-purple-500/20 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">•</span> Standar Desain Rapi & Konsisten
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">•</span> Figma Prototype Interaktif
                </div>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-bold relative z-10">
              <span>Buka Prototipe Figma UI/UX</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10 mb-6">
        <div className="p-8 sm:p-10 rounded-2xl bg-linear-to-r from-cyan-500/15 via-blue-600/10 to-indigo-600/15 border-2 border-cyan-400/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgba(6,182,212,0.2)] backdrop-blur-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase">
              <span className="bg-linear-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-white dark:via-sky-200 dark:to-blue-400 bg-clip-text text-transparent">
                Punya Rencana Proyek atau Posisi yang Cocok?
              </span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-normal max-w-lg">
              Saya senang berdiskusi tentang bagaimana teknologi web dan analitik data bisa mempercepat target produk Anda.
            </p>
          </div>

          <Link 
            href="/contact" 
            onClick={handleRipple} 
            className="group relative overflow-hidden shrink-0 px-8 py-4 rounded-xl bg-linear-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-cyan-400/40 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 active:brightness-90 flex items-center gap-2 cursor-pointer border border-cyan-300/30"
          >
            <span className="relative z-10">Hubungi Saya Sekarang</span>
          </Link>
        </div>
      </section>

      {/* ================= PROJECT DETAIL MODAL ================= */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity" 
            onClick={closeModal} 
          />

          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#091122] border-2 border-cyan-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedProject.title}</h3>
              <button 
                onClick={closeModal}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-white/10 px-6 bg-slate-50 dark:bg-[#060a14]">
              <button 
                onClick={() => setActiveTab("showcase")}
                className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                  activeTab === "showcase" ? "border-cyan-500 text-cyan-600 dark:text-cyan-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Overview & Detail
              </button>
              <button 
                onClick={() => setActiveTab("code")}
                className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                  activeTab === "code" ? "border-cyan-500 text-cyan-600 dark:text-cyan-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Snippet Kode
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {activeTab === "showcase" ? (
                <>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Tantangan & Solusi:</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed"><span className="font-semibold text-slate-900 dark:text-white">Tantangan:</span> {selectedProject.challenge}</p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed"><span className="font-semibold text-cyan-600 dark:text-cyan-400">Solusi:</span> {selectedProject.solution}</p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Fitur Utama:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                      {selectedProject.highlights?.map((h: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                          <span className="text-cyan-500 font-bold">•</span> {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Teknologi Terpasang:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack?.map((t: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-cyan-700 dark:text-cyan-300 text-xs font-mono font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Cuplikan Logika Handler Inti</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20">TypeScript / PHP</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed border border-cyan-500/20">
                    <code>{selectedProject.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Footer Modal Action */}
            <div className="p-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/5">
              <button 
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Tutup
              </button>

              {selectedProject.demoLink && selectedProject.demoLink !== "#" ? (
                <a 
                  href={selectedProject.demoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center shadow-sm"
                >
                  <span>{selectedProject.demoLabel}</span>
                </a>
              ) : (
                <span className="text-xs font-mono text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/25 font-bold">
                  {selectedProject.demoLabel}
                </span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
        <div className="relative rounded-2xl bg-white dark:bg-[#080f1e] border-2 border-cyan-500/20 p-8 transition-all overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-100 dark:border-white/10">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-900 border border-cyan-400/40 flex items-center justify-center p-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                  <img src="/logo-najwan.jpg" alt="Najwan Muyassar Logo" className="w-full h-full object-cover rounded-md" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-wide text-slate-900 dark:text-white">NAJWAN MUYASSAR</h3>
                  <p className="text-[10px] font-mono bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent uppercase tracking-wider font-bold">Full-Stack Dev • Data • UI/UX</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal max-w-md">
                Mengembangkan website handal, dashboard analitik bisnis, dan antarmuka produk yang mempermudah urusan pengguna setiap hari.
              </p>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white uppercase">Navigasi Cepat</h4>
              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li><Link href="/" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Halaman Utama</Link></li>
                <li><Link href="/about" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Biografi Lengkap</Link></li>
                <li><Link href="/projects" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Galeri Proyek</Link></li>
                <li><Link href="/skills" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Keahlian & Stack</Link></li>
                <li><Link href="/experience" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Pengalaman Kerja</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white uppercase">Aplikasi Unggulan</h4>
              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">VictoryArena</span>
                </li>
                <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">MindHaven</span>
                </li>
                <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Petty Claim</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white uppercase">Koneksi Sosial</h4>
              <div className="flex flex-col gap-2">
                <a href="https://github.com/Cartennzy" target="_blank" rel="noreferrer" onClick={handleRipple} className="relative overflow-hidden flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-500 text-xs font-semibold transition-all">
                  <span className="relative z-10">GitHub</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" onClick={handleRipple} className="relative overflow-hidden flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-500 text-xs font-semibold transition-all">
                  <span className="relative z-10">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <p>© 2026 Najwan Muyassar. Dibuat dengan performa presisi tinggi.</p>
            <button 
              onClick={(e) => { handleRipple(e); scrollToTop(); }} 
              className="relative overflow-hidden inline-flex items-center px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all cursor-pointer"
            >
              <span className="relative z-10">Kembali ke Atas</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ripple-effect {
          from { transform: scale(0); opacity: 0.55; }
          to { transform: scale(2.8); opacity: 0; }
        }
        .ripple-animation {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: scale(0);
          animation: ripple-effect 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
          z-index: 30;
        }
        @keyframes scan {
          0% { top: 14%; opacity: 0.15; }
          50% { top: 86%; opacity: 0.9; }
          100% { top: 14%; opacity: 0.15; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />

    </div>
  );
}