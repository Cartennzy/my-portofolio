"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// 1. Data Project Coding (MindHaven, Victory Arena, dan Petty Claim sebagai In Progress)
const codingProjects = [
  {
    id: "mental-health-web",
    title: "Sistem Layanan Kesehatan Mental (MindHaven)",
    category: "Full-Stack Web App, Portal Konsultasi & Asesmen",
    image: "/logo-mindhaven.jpg",
    link: "https://mind-haven-opal.vercel.app/",
    badge: "Full-Stack Web",
    scale: "scale-120",
    glowColor: "rgba(16, 185, 129, 0.45)",
    accent: "from-emerald-500/30 via-teal-600/15 to-transparent",
    desc: "Platform web untuk konsultasi kesehatan mental dan screening psikologis online, dilengkapi sistem booking jadwal serta manajemen rekam medis yang aman.",
    demoLink: "https://mind-haven-opal.vercel.app/",
    demoLabel: "KUNJUNGI WEB",
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
    demoLabel: "KUNJUNGI WEB",
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
    demoLabel: "SEGERA HADIR",
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

// 2. Data Project Data Analyst & Visualization (Power BI)
const dataAnalystProjects = [
  {
    id: "supermarket-analysis-bi",
    title: "Supermarket Analysis Business Intelligence Dashboard",
    category: "Microsoft Power BI, Analisis Pendapatan & Cabang Kota",
    image: "/logo-powerbi.png",
    link: "/SuperMarket_Analysis_BI_Dashboard.pdf",
    badge: "Power BI Analytics",
    scale: "scale-110",
    glowColor: "rgba(239, 68, 68, 0.45)",
    accent: "from-red-500/30 via-orange-600/15 to-transparent",
    desc: "Dashboard analitik Power BI interaktif untuk memonitor ringkasan eksekutif supermarket, mencakup total pendapatan, profit bersih, serta performa per cabang kota.",
    demoLink: "/SuperMarket_Analysis_BI_Dashboard.pdf", 
    demoLabel: "BUKA LAPORAN", 
    challenge: "Manajemen kesulitan memonitor performa penjualan antar cabang karena laporan masih menggunakan file terpisah.",
    solution: "Menggabungkan berbagai sumber data ke dalam Power BI dan merancang dasbor terpusat yang bisa difilter berdasarkan kota dan rentang waktu.",
    techStack: ["Power BI", "Power Query", "DAX", "Excel"],
    highlights: [
      "Penyegaran Data Otomatis",
      "Filter Interaktif Berdasarkan Kota & Tanggal",
      "Perhitungan Metrik Keuangan dengan DAX",
      "Ringkasan Eksekutif untuk Pengambilan Keputusan"
    ],
    metrics: [
      { label: "Baris Data", value: "500K+" },
      { label: "Pendapatan", value: "$322K" },
      { label: "Kecepatan Muat", value: "< 1s" },
      { label: "Cabang", value: "3 Kota" }
    ],
    codeSnippet: `// DAX: Year-over-Year Growth
YoY_Revenue_Growth = 
VAR CurrentRevenue = SUM(Sales[Revenue])
VAR PreviousYearRevenue = CALCULATE(SUM(Sales[Revenue]), SAMEPERIODLASTYEAR('Calendar'[Date]))
RETURN
DIVIDE(CurrentRevenue - PreviousYearRevenue, PreviousYearRevenue, 0)`
  },
  {
    id: "global-superstore-bi-product",
    title: "Global Superstore: Product & Sales Analytics Dashboard",
    category: "Microsoft Power BI, Analisis Produk Unggulan & Peramalan",
    image: "/logo-powerbi.png",
    link: "/Global_Superstore_BI.pdf",
    badge: "Power BI Analytics",
    scale: "scale-110",
    glowColor: "rgba(245, 158, 11, 0.45)",
    accent: "from-amber-500/30 via-orange-600/15 to-transparent",
    desc: "Visualisasi mendalam analisis performa produk global untuk memetakan volume penjualan dan batas keuntungan produk.",
    demoLink: "/Global_Superstore_BI.pdf", 
    demoLabel: "BUKA LAPORAN", 
    challenge: "Perusahaan perlu mengetahui produk mana yang penjualannya tinggi namun memberikan margin keuntungan yang kecil.",
    solution: "Membuat visualisasi matriks profitabilitas produk serta grafik peramalan tren penjualan di masa depan.",
    techStack: ["Power BI", "Python (Pandas)", "SQL", "DAX"],
    highlights: [
      "Analisis Kuadran Keuntungan Produk",
      "Grafik Peramalan Penjualan Otomatis",
      "Parameter Interaktif Skenario Bisnis",
      "Rincian Kategori Produk Hingga Detail"
    ],
    metrics: [
      { label: "Data Transaksi", value: "1.2M+" },
      { label: "Kategori Produk", value: "150+" },
      { label: "Akurasi Model", value: "92%" },
      { label: "Pembaruan", value: "Rutin" }
    ],
    codeSnippet: `// Python Script Data Transformation
import pandas as pd
dataset['Margin'] = (dataset['Profit'] / dataset['Sales']) * 100
dataset['Alert'] = dataset['Margin'].apply(lambda x: 'High Risk' if x < 5 else 'Normal')
return dataset`
  },
];

// 3. Data Project UI/UX Design (QurbanKu & Reliev)
const uiuxProjects = [
  {
    id: "qurbanku",
    title: "QurbanKu: Aplikasi Pemesanan Hewan Qurban",
    category: "Desain UI/UX Mobile, Alur Pengguna & Prototipe Figma",
    image: "/logo-qurbanku.jpg",
    link: "https://www.figma.com/proto/pQGRgNeCvFG6hfvQZLSrh3/QurbanKu?node-id=1-4&p=f&t=TX7KPEE32XTModMx-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A4&show-proto-sidebar=1",
    badge: "Mobile UI/UX",
    scale: "scale-115",
    glowColor: "rgba(13, 82, 232, 0.45)",
    accent: "from-blue-600/30 via-indigo-600/15 to-transparent",
    desc: "Perancangan antarmuka aplikasi mobile qurban mulai dari riset kebutuhan pengguna, penyusunan alur (user flow), hingga prototipe interaktif di Figma.",
    demoLink: "https://www.figma.com/proto/pQGRgNeCvFG6hfvQZLSrh3/QurbanKu?node-id=1-4&p=f&t=TX7KPEE32XTModMx-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A4&show-proto-sidebar=1",
    demoLabel: "BUKA PROTOTIPE",
    challenge: "Alur pembelian hewan qurban pada platform lain seringkali membingungkan dan membuat pengguna ragu untuk bertransaksi.",
    solution: "Menyederhanakan proses pemesanan menjadi 3 langkah mudah, memperjelas informasi produk, dan menggunakan skema warna yang menumbuhkan kepercayaan.",
    techStack: ["Figma", "Design Tokens", "Atomic Design", "Prototyping"],
    highlights: [
      "Alur Pembayaran 3 Langkah yang Ringkas",
      "Panduan Warna & Tipografi Terstandarisasi",
      "Prototipe Berfidelitas Tinggi",
      "Kepatuhan Standar Keterbacaan Aksesibilitas"
    ],
    metrics: [
      { label: "Kemudahan Uji", value: "96%" },
      { label: "Efisiensi Klik", value: "+45%" },
      { label: "Langkah Alur", value: "3 Tahap" },
      { label: "Komponen UI", value: "120+" }
    ],
    codeSnippet: `// Figma Design Token Structure (JSON)
{
  "color": {
    "primary": {
      "500": { "value": "#0D52E8", "type": "color" }
    }
  }
}`
  },
  {
    id: "reliev",
    title: "Reliev: Portal Konsultasi & Kesehatan Mental",
    category: "Desain UI/UX Web & Mobile, Sistem Desain & Pemetaan Empati",
    image: "/logo-reliev.jpg",
    link: "https://www.figma.com/proto/XOTxYyomD33qit71MW8ldY/Reliev?t=IeqgWbPAgIX7NZjV-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&node-id=6-5&starting-point-node-id=6%3A5",
    badge: "MOBILE UI/UX",
    scale: "scale-120",
    glowColor: "rgba(16, 185, 129, 0.45)",
    accent: "from-emerald-500/30 via-teal-600/15 to-transparent",
    desc: "Perancangan tampilan antarmuka layanan konsultasi psikologi yang memberikan rasa aman, privat, serta kenyamanan visual bagi pengguna.",
    demoLink: "https://www.figma.com/proto/XOTxYyomD33qit71MW8ldY/Reliev?t=IeqgWbPAgIX7NZjV-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&node-id=6-5&starting-point-node-id=6%3A5",
    demoLabel: "BUKA PROTOTIPE",
    challenge: "Aplikasi kesehatan mental seringkali berkesan kaku atau menegangkan bagi pengguna yang sedang mengalami stres.",
    solution: "Menggunakan palet warna lembut (Emerald & Teal), tata letak yang lapang, serta kalimat sapaan yang suportif untuk menciptakan suasana yang menenangkan.",
    techStack: ["Figma", "Wireframing", "Empathy Mapping", "Psychology Design"],
    highlights: [
      "Pemilihan Warna Berbasis Psikologi Visual",
      "Formulir Asesmen yang Nyaman & Tidak Membebani",
      "Tampilan Responsif untuk Ponsel dan Komputer",
      "Struktur Navigasi yang Sangat Intuitif"
    ],
    metrics: [
      { label: "Penurunan Bounce", value: "-30%" },
      { label: "Keterlibatan", value: "+50%" },
      { label: "Skor SUS", value: "92" },
      { label: "Aksesibilitas", value: "100" }
    ],
    codeSnippet: `// CSS Design System implementation
:root {
  --color-brand-emerald-500: #10B981;
  --color-brand-teal-600: #0D9488;
  --shadow-calm-elevation: 0 10px 30px rgba(16, 185, 129, 0.15);
}
.btn-calm { background: var(--color-brand-emerald-500); }`
  },
];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "coding" | "data" | "uiux">("all");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeModalTab, setActiveModalTab] = useState("showcase");

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

  // 3. Handle Esc Key and Body Scroll Lock for Modal
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

  // 4. True SaaS Ripple Effect
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

  // 5. Bento Spotlight Mouse Move Handler
  const handleBentoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  // 6. Modal Handlers
  const openModal = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setActiveModalTab("showcase");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
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

      {/* ================= 3. EDITORIAL MINIMALIST HERO ================= */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 pt-28 pb-10 sm:pt-36 sm:pb-14 text-center">

        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-md shadow-xs mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-slate-700 dark:text-slate-300">
            SELECTED PORTFOLIO & DATA ANALYTICS
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] uppercase max-w-3xl mx-auto">
          FEATURED{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300">
            WORKS & VISUALS
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl mx-auto">
          Eksplorasi sistem aplikasi coding, visualisasi data analitik bisnis dengan Power BI, serta perancangan antarmuka UI/UX Design di Figma.
        </p>

        {/* Segmented Filter Capsule */}
        <div className="mt-7 flex justify-center">
          <div className="p-1 rounded-full bg-white/70 dark:bg-[#0c1322]/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl inline-flex items-center gap-1 shadow-xs overflow-x-auto max-w-full">
            {[
              { label: "All Portfolio", key: "all" },
              { label: "Coding Projects", key: "coding" },
              { label: "Data Analytics", key: "data" },
              { label: "UI/UX Design", key: "uiux" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={(e) => { handleRipple(e); setActiveFilter(t.key as any); }}
                className={`relative overflow-hidden px-4 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 active:translate-y-0.5 ${
                  activeFilter === t.key 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-[1.02]" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">

        {/* ================= SECTION 1: CODING PROJECTS ================= */}
        {(activeFilter === "all" || activeFilter === "coding") && (
          <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-[#0C1B33] border border-indigo-100 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-cyan-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Coding & Web Development Projects</h2>
                <p className="text-[11px] font-mono text-indigo-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">Full-Stack Applications & Systems</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {codingProjects.map((project, idx) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onMouseMove={handleBentoMouseMove}
                  onClick={(e) => { handleRipple(e); openModal(project); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(project); }}
                  className="relative group rounded-3xl p-px transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                  project-card-trigger="true"
                >
                  <div
                    className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${project.glowColor}, transparent 70%)` }}
                  />

                  <div className="relative h-full flex flex-col justify-between rounded-3xl bg-white/80 dark:bg-[#080E1E]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 group-hover:border-indigo-400/60 p-7 shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.15)] transition-all duration-300 overflow-hidden">
                    <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.12), transparent 40%)` }} />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          0{idx + 1}
                        </span>

                        {/* Status Badge Khusus In Progress */}
                        {project.badge === "In Progress" ? (
                          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                            {project.badge}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-cyan-400 font-mono text-[10px] font-semibold uppercase tracking-wider">
                            {project.badge}
                          </span>
                        )}
                      </div>

                      <div className="relative w-full h-52 rounded-2xl flex items-center justify-center p-4 my-2 overflow-hidden bg-slate-100/70 dark:bg-[#0B152B]/70 border border-slate-200 dark:border-white/5 group-hover:border-indigo-400/30 transition-all duration-300">
                        <div className={`absolute inset-0 bg-radial ${project.accent} opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                        <div className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-3 shadow-xl border border-white/20 group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={project.image}
                            alt={project.title}
                            className={`w-full h-full object-contain mix-blend-multiply brightness-[1.03] contrast-[1.15] transition-transform duration-300 ${project.scale}`}
                          />
                        </div>
                      </div>

                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors leading-snug mt-4">
                        {project.title}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 mt-1">
                        {project.category}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-2 leading-relaxed line-clamp-2">
                        {project.desc}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-5 mt-6 border-t border-slate-100 dark:border-white/10">
                      <div className="flex items-center gap-2 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-[10px] font-mono text-indigo-700 dark:text-cyan-300 font-bold uppercase tracking-wide">
                          {project.badge === "In Progress" ? "In Development" : "Click to inspect"}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-indigo-600 text-slate-700 dark:text-slate-300 group-hover:text-white flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:border-indigo-600 transition-all duration-300 shadow-md">
                        <svg className="relative z-10 w-4 h-4 transform group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION 2: DATA ANALYTICS & VISUALIZATION (POWER BI) ================= */}
        {(activeFilter === "all" || activeFilter === "data") && (
          <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-[#2B1B0A] border border-amber-200 dark:border-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Data Analyst & Visualization (Power BI)</h2>
                <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest font-semibold">Business Intelligence & Interactive Dashboards</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8">
              {dataAnalystProjects.map((project, idx) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onMouseMove={handleBentoMouseMove}
                  onClick={(e) => { handleRipple(e); openModal(project); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(project); }}
                  className="relative group rounded-3xl p-px transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  project-card-trigger="true"
                >
                  <div
                    className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${project.glowColor}, transparent 70%)` }}
                  />

                  <div className="relative h-full flex flex-col justify-between rounded-3xl bg-white/80 dark:bg-[#080E1E]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 group-hover:border-amber-500/60 dark:group-hover:border-amber-400/60 p-7 shadow-xl hover:shadow-[0_15px_40px_rgba(245,158,11,0.15)] transition-all duration-300 overflow-hidden">
                    <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(245,158,11,0.12), transparent 40%)` }} />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          DATA 0{idx + 1}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-mono text-[10px] font-semibold uppercase tracking-wider">
                          {project.badge}
                        </span>
                      </div>

                      <div className="relative w-full h-52 rounded-2xl flex items-center justify-center p-4 my-2 overflow-hidden bg-slate-100/70 dark:bg-[#0B152B]/70 border border-slate-200 dark:border-white/5 group-hover:border-amber-500/30 transition-all duration-300">
                        <div className={`absolute inset-0 bg-radial ${project.accent} opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                        <div className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-3 shadow-xl border border-white/20 group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={project.image}
                            alt={project.title}
                            className={`w-full h-full object-contain mix-blend-multiply brightness-[1.03] contrast-[1.15] transition-transform duration-300 ${project.scale}`}
                          />
                        </div>
                      </div>

                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug mt-4">
                        {project.title}
                      </h3>
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">
                        {project.category}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-2 leading-relaxed line-clamp-2">
                        {project.desc}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-5 mt-6 border-t border-slate-100 dark:border-white/10">
                      <div className="flex items-center gap-2 bg-amber-500/10 dark:bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/20">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wide">
                          Click to inspect
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-amber-600 text-slate-700 dark:text-slate-300 group-hover:text-white flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:border-amber-600 transition-all duration-300 shadow-md">
                        <svg className="relative z-10 w-4 h-4 transform group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION 3: UI/UX DESIGN PROJECTS ================= */}
        {(activeFilter === "all" || activeFilter === "uiux") && (
          <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-[#0C1B33] border border-indigo-100 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-cyan-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">UI/UX Design Projects (Figma Prototypes)</h2>
                <p className="text-[11px] font-mono text-indigo-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">Mobile & Web Interface Systems</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {uiuxProjects.map((project, idx) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onMouseMove={handleBentoMouseMove}
                  onClick={(e) => { handleRipple(e); openModal(project); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(project); }}
                  className="relative group rounded-3xl p-px transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                  project-card-trigger="true"
                >
                  <div
                    className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${project.glowColor}, transparent 70%)` }}
                  />

                  <div className="relative h-full flex flex-col justify-between rounded-3xl bg-white/80 dark:bg-[#080E1E]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 group-hover:border-indigo-400/60 p-7 shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.15)] transition-all duration-300 overflow-hidden">
                    <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99,102,241,0.12), transparent 40%)` }} />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          UI/UX 0{idx + 1}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 font-mono text-[10px] font-semibold uppercase tracking-wider">
                          {project.badge}
                        </span>
                      </div>

                      <div className="relative w-full h-52 rounded-2xl flex items-center justify-center p-4 my-2 overflow-hidden bg-slate-100/70 dark:bg-[#0B152B]/70 border border-slate-200 dark:border-white/5 group-hover:border-indigo-400/30 transition-all duration-300">
                        <div className={`absolute inset-0 bg-radial ${project.accent} opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                        <div className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-3 shadow-xl border border-white/20 group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={project.image}
                            alt={project.title}
                            className={`w-full h-full object-contain mix-blend-multiply brightness-[1.03] contrast-[1.15] transition-transform duration-300 ${project.scale}`}
                          />
                        </div>
                      </div>

                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors leading-snug mt-4">
                        {project.title}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 mt-1">
                        {project.category}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-2 leading-relaxed line-clamp-2">
                        {project.desc}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-5 mt-6 border-t border-slate-100 dark:border-white/10">
                      <div className="flex items-center gap-2 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-[10px] font-mono text-indigo-700 dark:text-cyan-300 font-bold uppercase tracking-wide">
                          Click to inspect
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-indigo-600 text-slate-700 dark:text-slate-300 group-hover:text-white flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:border-indigo-600 transition-all duration-300 shadow-md">
                        <svg className="relative z-10 w-4 h-4 transform group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= INTERACTIVE PROJECT DETAIL MODAL ================= */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div 
            className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={closeModal}
            aria-hidden="true"
          />

          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`relative z-10 w-full max-w-4xl max-h-[90vh] bg-slate-900/95 border border-indigo-500/30 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.25)] flex flex-col overflow-hidden transition-all duration-300 transform ${isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl shrink-0 gap-3">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-cyan-400 font-mono text-[10px] font-semibold uppercase tracking-wider w-max">
                  {selectedProject.badge}
                </span>
                <h3 id="modal-title" className="text-base sm:text-xl font-bold text-white leading-tight truncate">
                  {selectedProject.title}
                </h3>
              </div>

              {/* Action Buttons: Tombol GitHub dihapus, Tombol Web Utama Selalu Tampil Responsif */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {selectedProject.demoLink && selectedProject.demoLink !== "#" ? (
                  <a
                    href={selectedProject.demoLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleRipple}
                    className="relative overflow-hidden group/btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-95 active:translate-y-0.5 flex items-center gap-2 cursor-pointer border border-cyan-400/40"
                  >
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <span className="relative z-10">{selectedProject.demoLabel || "Kunjungi Web"}</span>
                    <svg className="relative z-10 w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <span className="px-3.5 py-2 bg-slate-800/80 border border-white/10 text-slate-400 rounded-full text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider cursor-not-allowed">
                    {selectedProject.demoLabel || "Segera Hadir"}
                  </span>
                )}

                <button
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="group w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 transition-all duration-300 shrink-0 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-white transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center overflow-x-auto border-b border-white/10 bg-[#030712]/50 px-4 shrink-0 scrollbar-hide">
              <button onClick={() => setActiveModalTab("showcase")} className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 cursor-pointer ${activeModalTab === "showcase" ? "text-cyan-400 border-cyan-400" : "text-slate-500 border-transparent hover:text-slate-300"}`}>
                01. Showcase
              </button>
              <button onClick={() => setActiveModalTab("architecture")} className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 cursor-pointer ${activeModalTab === "architecture" ? "text-cyan-400 border-cyan-400" : "text-slate-500 border-transparent hover:text-slate-300"}`}>
                02. Architecture & Tech
              </button>
              <button onClick={() => setActiveModalTab("benchmarks")} className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 cursor-pointer ${activeModalTab === "benchmarks" ? "text-cyan-400 border-cyan-400" : "text-slate-500 border-transparent hover:text-slate-300"}`}>
                03. Benchmarks & Impact
              </button>
            </div>

            {/* Modal Body / Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">

              {/* Tab 01: Showcase */}
              {activeModalTab === "showcase" && (
                <div className="animate-[fade-in_0.3s_ease-out]">
                  <div className="w-full bg-slate-800/50 rounded-2xl border border-white/5 p-4 flex justify-center items-center h-48 sm:h-72 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial from-cyan-500/10 to-transparent opacity-50"></div>
                    <img src={selectedProject.image} alt={selectedProject.title} className="max-h-full max-w-full object-contain filter drop-shadow-2xl relative z-10" />
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      <span className="bg-black/60 backdrop-blur border border-white/10 text-[9px] font-mono text-cyan-300 px-2 py-1 rounded shadow">PROD_ENV_ACTIVE</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2 border-l-2 border-rose-500 pl-2">Challenge Statement</h4>
                      <p className="text-sm font-light leading-relaxed text-slate-300">{selectedProject.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2 border-l-2 border-emerald-500 pl-2">Engineering Solution</h4>
                      <p className="text-sm font-light leading-relaxed text-slate-300">{selectedProject.solution}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 02: Architecture & Dataflow */}
              {activeModalTab === "architecture" && (
                <div className="animate-[fade-in_0.3s_ease-out] space-y-8">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">Architectural Highlights</h4>
                    <ul className="space-y-3">
                      {selectedProject.highlights.map((highlight: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                          <svg className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="text-sm text-slate-200">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">Pipeline / Pseudo-code Snippet</h4>
                    <div className="relative bg-[#030712] border border-white/10 rounded-xl overflow-hidden p-4">
                      <div className="flex gap-1.5 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      </div>
                      <pre className="text-[11px] sm:text-xs font-mono text-cyan-100 overflow-x-auto">
                        <code>{selectedProject.codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 03: Benchmarks & Impact */}
              {activeModalTab === "benchmarks" && (
                <div className="animate-[fade-in_0.3s_ease-out]">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">Key Metric Highlight</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {selectedProject.metrics.map((metric: any, i: number) => (
                      <div key={i} className="bg-linear-to-br from-white/5 to-transparent border border-white/10 p-5 rounded-2xl flex flex-col justify-center items-center text-center shadow-lg hover:border-cyan-500/30 transition-colors">
                        <span className="text-3xl font-black text-white drop-shadow-md">{metric.value}</span>
                        <span className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider mt-2">{metric.label}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">Core Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs font-mono rounded-lg">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-6 py-4 border-t border-white/10 bg-slate-900 flex justify-end shrink-0">
              <button 
                onClick={(e) => { handleRipple(e); closeModal(); }}
                className="relative overflow-hidden px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 border border-white/10 active:scale-95 active:translate-y-0.5 cursor-pointer"
              >
                <span className="relative z-10">Back to Overview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Style for Custom Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.5); }
      `}} />

    </div>
  );
}