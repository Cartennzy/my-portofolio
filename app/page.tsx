"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPillarsVisible, setIsPillarsVisible] = useState(false);

  // Splash Screen State
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Modal State
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
      }, 600);
      return () => clearTimeout(closeTimer);
    }, 1200);

    return () => clearTimeout(exitTimer);
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

  // Fast & Zero-Lag Dynamic Ripple Effect
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
    { name: "MySQL", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
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
      accent: "from-emerald-500/25 via-teal-600/10 to-transparent",
      scale: "scale-105",
      glowColor: "rgba(16, 185, 129, 0.4)",
      demoLink: "https://mind-haven-opal.vercel.app/",
      demoLabel: "BUKA WEBSITE",
      challenge: "Menyediakan layanan konsultasi daring yang responsif, stabil, dan melindungi privasi data rekam medis pasien.",
      solution: "Membangun sistem web menggunakan Next.js dan backend Laravel terhubung basis data relasional MySQL teroptimasi.",
      techStack: ["Next.js", "Laravel", "MySQL", "Tailwind CSS"],
      highlights: [
        "Sistem Penjadwalan Sesi Konsultasi",
        "Penyimpanan Rekam Medis Terproteksi",
        "Modul Asesmen Psikologis Mandiri",
        "Dashboard Terpadu Konselor & Pengguna"
      ],
      metrics: [
        { label: "Database", value: "MySQL" },
        { label: "Waktu Muat", value: "< 1.2s" },
        { label: "Uptime", value: "99.9%" },
        { label: "Arsitektur", value: "Modular" }
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
      scale: "scale-105",
      glowColor: "rgba(13, 82, 232, 0.4)",
      accent: "from-blue-600/25 via-indigo-600/10 to-transparent",
      desc: "Aplikasi pemesanan lapangan olahraga real-time untuk mencegah konflik jadwal ganda secara otomatis.",
      demoLink: "https://victory-arena-zeta.vercel.app/",
      demoLabel: "BUKA WEBSITE",
      challenge: "Menghilangkan kendala bentrok pencatatan jadwal (double booking) saat beban transaksi tinggi di akhir pekan.",
      solution: "Mengintegrasikan transaksi locking pada MySQL database dan update ketersediaan slot antarmuka secara presisi.",
      techStack: ["React", "Node.js", "MySQL", "Express"],
      highlights: [
        "Matriks Ketersediaan Slot Real-time",
        "Pencegahan Duplikasi Slot Otomatis",
        "Dashboard Rekap Finansial Pemilik",
        "Struk Konfirmasi Digital Terintegrasi"
      ],
      metrics: [
        { label: "Database", value: "MySQL" },
        { label: "Konflik Slot", value: "0%" },
        { label: "Respon DB", value: "35ms" },
        { label: "Status", value: "Production" }
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
      scale: "scale-95",
      glowColor: "rgba(245, 158, 11, 0.4)",
      accent: "from-amber-500/25 via-orange-600/10 to-transparent",
      desc: "Platform pengelolaan kas operasional dan validasi pengajuan klaim berjenjang untuk akurasi audit keuangan.",
      demoLink: "#",
      demoLabel: "TAHAP RILIS",
      challenge: "Digitalisasi alur klaim berbasis dokumen fisik menjadi sistem terpadu yang transparan dan dapat diaudit menyeluruh.",
      solution: "Merancang mekanisme multi-tier approval menggunakan Laravel dan PostgreSQL untuk integritas relasi foreign key dan audit trail.",
      techStack: ["Laravel 10", "Vue.js", "PostgreSQL", "Docker"],
      highlights: [
        "Alur Persetujuan Bertingkat (Multi-tier)",
        "Pencatatan Audit Log Permanen",
        "Penyimpanan Bukti Transaksi Digital",
        "Ekspor Rekap Laporan Finansial"
      ],
      metrics: [
        { label: "Database", value: "PostgreSQL" },
        { label: "Workflow", value: "Multi-tier" },
        { label: "Audit Trail", value: "Immutable" },
        { label: "Target", value: "2026" }
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

      {/* ================= SPLASH SCREEN ================= */}
      {isLoading && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-all duration-500 ease-in-out select-none ${
            isExiting ? "opacity-0 pointer-events-none scale-102" : "opacity-100 scale-100"
          }`}
        >
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 p-1 mb-5 flex items-center justify-center shadow-lg">
              <img
                src="/logo-najwan.jpg"
                alt="Najwan Muyassar Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h2 className="text-lg font-black uppercase tracking-widest text-white">
              NAJWAN <span className="text-cyan-400">MUYASSAR</span>
            </h2>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-1">
              SYSTEM ARCHITECT & DEVELOPER
            </p>
          </div>
        </div>
      )}

      {/* ================= TOP SCROLL PROGRESS BAR ================= */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none bg-black/5 dark:bg-white/5">
        <div
          className="h-full bg-cyan-600 dark:bg-cyan-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ================= CANVAS PARTICLE ENGINE ================= */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 opacity-40 dark:opacity-60 pointer-events-none"
      />

      {/* ================= SUBTLE AMBIENT BACKGROUND ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[100px] transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mousePos.x - 192}px, ${mousePos.y - 192}px, 0)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[48px_48px]" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-medium tracking-wide">
                TERBUKA UNTUK PROYEK & REKRUTMEN
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Najwan Muyassar
              </h1>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-cyan-700 dark:text-cyan-400">
                Full-Stack Developer & UI/UX Designer
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
              Halo! Saya membangun aplikasi web yang cepat, stabil, dan nyaman dipakai pengguna nyata. Dari logika database di balik layar sampai detail antarmuka interaktif dan visualisasi analitik bisnis.
            </p>

            {/* ACTION BUTTONS WITH DYNAMIC RIPPLE & ACTIVE STATE */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/projects"
                onClick={handleRipple}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 active:brightness-90 cursor-pointer select-none"
              >
                <span className="relative z-10">Lihat Hasil Karya Saya</span>
                <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </Link>

              <Link
                href="/contact"
                onClick={handleRipple}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-200/70 dark:bg-white/5 hover:bg-slate-300/80 dark:hover:bg-white/10 text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 border border-slate-300/80 dark:border-white/15 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 active:brightness-90 cursor-pointer select-none"
              >
                <span className="relative z-10">Ajak Ngobrol Santai</span>
                <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-95">
            <div className="absolute w-72 sm:w-88 h-72 sm:h-88 rounded-full border border-slate-300 dark:border-white/10 pointer-events-none" />

            <div className="relative z-10 w-full max-w-85 flex items-end justify-center pointer-events-none">
              <img
                src="/najwan-removebg.png"
                alt="Najwan Muyassar"
                className="w-full h-auto max-h-115 object-contain object-bottom filter drop-shadow-md select-none"
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
      <section className="relative z-10 w-full bg-slate-100/80 dark:bg-[#090e1c]/80 border-y border-slate-200 dark:border-white/10 py-5 overflow-hidden backdrop-blur-md">
        <div className="flex w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
          <div className="flex items-center gap-4 pr-4">
            {techLogos.map((tech, idx) => (
              <div key={`tech-1-${idx}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 transition-transform hover:scale-102">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <img src={tech.iconUrl} alt={tech.name} className="w-full h-full object-contain" loading="lazy" />
                </div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">{tech.name}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pr-4" aria-hidden="true">
            {techLogos.map((tech, idx) => (
              <div key={`tech-2-${idx}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 transition-transform hover:scale-102">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <img src={tech.iconUrl} alt={tech.name} className="w-full h-full object-contain" loading="lazy" />
                </div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT HIGHLIGHT SECTION ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center items-center">
            <div className="relative w-64 sm:w-76 h-96 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-white/15 shadow-xl">
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
            <div className="inline-flex items-center px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-semibold tracking-wider">
              TENTANG SAYA
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase leading-snug">
              <span className="bg-linear-to-r from-slate-900 via-slate-700 to-cyan-700 dark:from-white dark:via-sky-200 dark:to-blue-400 bg-clip-text text-transparent">
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
                className="group relative overflow-hidden inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 active:brightness-90 cursor-pointer shadow-sm"
              >
                <span className="relative z-10">Kenal Lebih Dekat</span>
                <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RECENT PROJECT SHOWCASE ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-slate-200 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-semibold tracking-wider">
              PORTFOLIO
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
              <span className="bg-linear-to-r from-slate-900 via-slate-700 to-cyan-700 dark:from-white dark:via-sky-200 dark:to-blue-400 bg-clip-text text-transparent">
                Proyek Pilihan
              </span>
            </h2>
          </div>

          <Link 
            href="/projects" 
            onClick={handleRipple} 
            className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0A1428] hover:border-cyan-500 transition-all duration-200 active:translate-y-0.5 active:scale-95 active:brightness-90"
          >
            <span className="relative z-10">Lihat Semua Proyek</span>
            <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
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
              className="relative group rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#091122] p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-md active:translate-y-0.5 active:scale-98 focus:outline-none focus:ring-2 focus:ring-cyan-500 overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold text-slate-400">0{idx + 1}</span>
                  <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold tracking-wider uppercase">
                    {project.techStack[2]}
                  </span>
                </div>

                <div className="relative w-full h-44 rounded-xl flex items-center justify-center p-3 mb-4 bg-slate-100 dark:bg-[#0c172e] border border-slate-200 dark:border-white/5">
                  <div className="w-24 h-24 rounded-xl bg-white dark:bg-white/95 flex items-center justify-center p-2 shadow-sm border border-slate-200 dark:border-white/10">
                    <img src={project.image} alt={project.title} className={`w-full h-full object-contain ${project.scale}`} />
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1.5 line-clamp-2 leading-relaxed">
                  {project.category}
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/10">
                <div className="w-full py-2.5 px-3 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-200">
                  <span>Bedah Rincian Proyek</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= THREE PILLARS OF MASTERY ================= */}
      <section ref={pillarsRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-slate-200 dark:border-white/10">
        <div className={`space-y-2 mb-10 text-center max-w-3xl mx-auto transition-all duration-500 ${isPillarsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-semibold tracking-wider">
            FOKUS KEAHLIAN
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
            <span className="bg-linear-to-r from-slate-900 via-slate-700 to-cyan-700 dark:from-white dark:via-sky-200 dark:to-blue-400 bg-clip-text text-transparent">
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
            className="group relative overflow-hidden bg-white dark:bg-[#091122] border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:border-cyan-500/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 active:scale-98 active:brightness-90 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                  Full-Stack
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                1. Pembuatan Web & Aplikasi Stabil
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-normal">
                Saya membuat aplikasi web yang siap pakai dari frontend sampai backend. Antarmuka cepat diakses, database aman, dan sistem siap menampung traffic tinggi.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-white/5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span> Next.js, React, Tailwind CSS
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span> Laravel, MySQL, PostgreSQL
                </div>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-bold">
              <span>Buka Portofolio Web App</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </div>
          </div>

          {/* Pilar 2 */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => { handleRipple(e); router.push("/projects"); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push("/projects"); }}
            onMouseMove={handleBentoMouseMove}
            className="group relative overflow-hidden bg-white dark:bg-[#091122] border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:border-cyan-500/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 active:scale-98 active:brightness-90 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-600 dark:text-amber-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                  BI & Analytics
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                2. Analisis Data & Dashboard Manajemen
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-normal">
                Data mentah dan laporan tabel yang panjang diubah menjadi dashboard visual interaktif yang langsung memberi insight efisien dan tren metrik masa depan.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-white/5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">•</span> Microsoft Power BI
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">•</span> SQL & DAX Modeling
                </div>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold">
              <span>Buka Sampel Dashboard Power BI</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </div>
          </div>

          {/* Pilar 3 */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => { handleRipple(e); router.push("/projects"); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push("/projects"); }}
            onMouseMove={handleBentoMouseMove}
            className="group relative overflow-hidden bg-white dark:bg-[#091122] border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:border-cyan-500/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 active:scale-98 active:brightness-90 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-600 dark:text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                  Design
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                3. Desain Antarmuka yang Nyaman Dipakai
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-normal">
                Sebelum mulai penulisan kode, alur aplikasi dirancang matang di Figma. Hasilnya adalah tata letak intuitif, ramah pengguna, dan tanpa kebingungan alur.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-white/5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span> Standar Desain Rapi & Konsisten
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span> Figma Prototype Interaktif
                </div>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-bold">
              <span>Buka Prototipe Figma UI/UX</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10 mb-6">
        <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#080f1e] border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-mono text-xs uppercase font-medium">
              LANGKAH BERIKUTNYA
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase">
              <span className="bg-linear-to-r from-slate-900 via-slate-700 to-cyan-700 dark:from-white dark:via-sky-200 dark:to-blue-400 bg-clip-text text-transparent">
                Punya Rencana Proyek atau Posisi yang Cocok?
              </span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-normal max-w-lg">
              Saya senang berdiskusi tentang bagaimana teknologi web dan analitik data bisa mempercepat target produk Anda.
            </p>
          </div>

          <Link 
            href="/contact" 
            onClick={handleRipple} 
            className="group relative overflow-hidden shrink-0 px-7 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 active:brightness-90 flex items-center gap-2 cursor-pointer"
          >
            <span className="relative z-10">Hubungi Saya Sekarang</span>
            <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* ================= PROJECT DETAIL MODAL ================= */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
            onClick={closeModal} 
          />

          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#091122] border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold">
                  SPESIFIKASI PROYEK
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedProject.title}</h3>
              </div>
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
                Overview & Metrik
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedProject.metrics?.map((m: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                        <div className="text-base font-extrabold text-cyan-600 dark:text-cyan-400">{m.value}</div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">{m.label}</div>
                      </div>
                    ))}
                  </div>

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
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span> {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Teknologi Terpasang:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack?.map((t: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-mono">
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
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">TypeScript / PHP</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
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
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>{selectedProject.demoLabel}</span>
                  <span>↗</span>
                </a>
              ) : (
                <span className="text-xs font-mono text-amber-700 dark:text-amber-400 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                  {selectedProject.demoLabel}
                </span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
        <div className="relative rounded-2xl bg-white dark:bg-[#080f1e] border border-slate-200 dark:border-white/10 p-8 transition-all overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-100 dark:border-white/10">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center p-0.5">
                  <img src="/logo-najwan.jpg" alt="Najwan Muyassar Logo" className="w-full h-full object-cover rounded-md" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-wide text-slate-900 dark:text-white">NAJWAN MUYASSAR</h3>
                  <p className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Full-Stack Dev • Data • UI/UX</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal max-w-md">
                Mengembangkan website handal, dashboard analitik bisnis, dan antarmuka produk yang mempermudah urusan pengguna setiap hari.
              </p>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white uppercase">Navigasi Cepat</h4>
              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li><Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Halaman Utama</Link></li>
                <li><Link href="/about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Biografi Lengkap</Link></li>
                <li><Link href="/projects" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Galeri Proyek</Link></li>
                <li><Link href="/skills" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Keahlian & Stack</Link></li>
                <li><Link href="/experience" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Pengalaman Kerja</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white uppercase">Aplikasi Unggulan</h4>
              <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">VictoryArena</span>
                  <span className="text-[10px] font-mono text-slate-400">MySQL</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">MindHaven</span>
                  <span className="text-[10px] font-mono text-slate-400">MySQL</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Petty Claim</span>
                  <span className="text-[10px] font-mono text-slate-400">PostgreSQL</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white uppercase">Koneksi Sosial</h4>
              <div className="flex flex-col gap-2">
                <a href="https://github.com/Cartennzy" target="_blank" rel="noreferrer" onClick={handleRipple} className="relative overflow-hidden flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-cyan-500 text-xs font-semibold transition-all">
                  <span className="relative z-10">GitHub</span>
                  <span className="relative z-10">↗</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" onClick={handleRipple} className="relative overflow-hidden flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-cyan-500 text-xs font-semibold transition-all">
                  <span className="relative z-10">LinkedIn</span>
                  <span className="relative z-10">↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <p>© 2026 Najwan Muyassar. Dibuat dengan performa presisi tinggi.</p>
            <button 
              onClick={(e) => { handleRipple(e); scrollToTop(); }} 
              className="relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all cursor-pointer"
            >
              <span className="relative z-10">Kembali ke Atas</span>
              <span className="relative z-10">↑</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Ripple Animation Style */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ripple-effect {
          from { transform: scale(0); opacity: 0.5; }
          to { transform: scale(2.8); opacity: 0; }
        }
        .ripple-animation {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.45);
          transform: scale(0);
          animation: ripple-effect 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
          z-index: 30;
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