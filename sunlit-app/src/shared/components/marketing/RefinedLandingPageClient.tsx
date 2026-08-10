'use client';

/**
 * RefinedLandingPageClient — Sunlit Energy Enterprise Public Platform
 *
 * Visual Source of Truth: Provided Approved Design Screenshots
 *
 * Key Components:
 * 1. Top Navigation: Approved Sunlit Navigation with functional dropdowns (Services, Locations, Resources, About, Contact, Login, Get Started)
 * 2. Hero Section: Frosted Glass Panel ("Powering Africa's next energy infrastructure") + Interactive Three.js 3D Solar Assembly Simulation
 * 3. Verified Energy Network / Directory Search: Dual Search inputs + Filter pills + Verified Metrics (2,500+ Businesses, 15k+ Projects, 4.9/5 Reviews)
 * 4. Ecosystem Architecture (Everything required to move an energy project from idea to operation)
 * 5. Core Capabilities (Solar Generation, Energy Storage, Digital Tools, EPC Execution)
 * 6. Engineering Tools Interactive Playground with Floating Cards
 * 7. Commercial & Industrial Enterprise (PPA, Zero-CAPEX, Microgrids)
 * 8. Verified Installer Network (Lagos, Abuja, Ogun certified EPCs & Interactive Map)
 * 9. Intelligent 5-Step Execution Workflow (Discover -> Design -> Match -> Execute -> Monitor)
 * 10. Live Energy Intelligence Telemetry (482.5 kW, Generation distribution)
 * 11. Proven at Scale Project Case Studies (TechPark Microgrid, Retail Plaza, Agro-Processing)
 * 12. Rooted in Nigeria, Built for Africa (15+ States, 24/7 Local Support)
 * 13. Enterprise Trust Foundation (Verified Installers, Milestone Escrow, Full Auditability)
 * 14. Final Conversion Section ("Ready to build the future of energy?")
 * 15. Footer: Full Old Sunlit Footer with all 6 columns and verified routes
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import {
  Sun,
  ShieldCheck,
  Search,
  MapPin,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  FileCheck,
  TrendingUp,
  Activity,
  Layers,
  Award,
  Users,
} from 'lucide-react';
import { useWaitlist } from '@/shared/contexts/WaitlistContext';
import { MarketingFooter } from '@/shared/components/marketing/Footer';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

const NAV_LINKS = [
  {
    label: 'Services',
    href: '/services',
    submenu: [
      { label: 'All Services Overview', href: '/services' },
      { label: 'Residential Solar (3–15 kVA)', href: '/services/residential-solar' },
      { label: 'Commercial Solar (15–100 kVA)', href: '/services/commercial-solar' },
      { label: 'Industrial Microgrids (100 kVA+)', href: '/services/industrial-solar' },
      { label: 'LiFePO4 Battery Storage', href: '/services/battery-storage' },
      { label: 'Solar Maintenance & Audits', href: '/services/maintenance' },
      { label: 'Energy Audits & Load Profiling', href: '/services/energy-audits' },
      { label: 'EV Charging Infrastructure', href: '/services/ev-charging' },
      { label: 'Solar Financing & PPA', href: '/services/solar-financing' },
      { label: 'Live IoT Telemetry', href: '/services/monitoring' },
    ],
  },
  {
    label: 'Locations',
    href: '/locations',
    submenu: [
      { label: 'All Locations (Hub Overview)', href: '/locations' },
      { label: 'Lagos State (Lekki, VI, Ikeja)', href: '/locations/lagos' },
      { label: 'Abuja FCT (Maitama, Wuse)', href: '/locations/abuja' },
      { label: 'Ogun State (Ota, Sagamu, Abeokuta)', href: '/locations/ogun' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    submenu: [
      { label: 'Resource Knowledge Hub', href: '/resources' },
      { label: 'Frequently Asked Questions', href: '/faq' },
      { label: 'Project Case Studies & Reviews', href: '/testimonials' },
      { label: 'Latest Blog & Industry Insights', href: '/blog' },
      { label: 'Solar Engineering Tools Suite', href: '/tools' },
      { label: 'Solar System Sizing Calculator', href: '/tools/solar-system-sizing' },
      { label: 'Load Profile Calculator', href: '/tools/load-calculator' },
      { label: 'Battery Capacity Sizing', href: '/tools/battery-capacity' },
      { label: 'Financial ROI Estimator', href: '/tools/roi-calculator' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function RefinedLandingPageClient() {
  const router = useRouter();
  const { openWaitlist } = useWaitlist();
  const threeContainerRef = useRef<HTMLDivElement>(null);

  // Navigation State
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, []);

  useEffect(() => {
    // 1. Navigation Scroll Effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Intersection Observer for Scroll Reveal Animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach((el) => observer.observe(el));

    // 3. Three.js Solar Installation 3D Animation
    const container = threeContainerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);

    // System Group
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);

    // 1. Modern Roof (Structure)
    const roofGeo = new THREE.BoxGeometry(12, 0.4, 12);
    const roofMat = new THREE.MeshPhongMaterial({ color: 0xe2d8d2 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    systemGroup.add(roof);

    // 2. Mounting Rails
    const railsGroup = new THREE.Group();
    systemGroup.add(railsGroup);
    for (let i = -1; i <= 1; i++) {
      const railGeo = new THREE.BoxGeometry(10, 0.1, 0.1);
      const railMat = new THREE.MeshPhongMaterial({ color: 0x40493d });
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(0, 0.3, i * 4);
      railsGroup.add(rail);
    }

    // 3. Solar Panels (Animated Assembly)
    const panelGroup = new THREE.Group();
    systemGroup.add(panelGroup);

    interface PanelMesh extends THREE.Mesh {
      userData: {
        targetY: number;
        delay: number;
        isPlaced: boolean;
      };
    }

    const panels: PanelMesh[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const panelGeo = new THREE.BoxGeometry(3, 0.05, 5);
        const panelMat = new THREE.MeshPhongMaterial({
          color: 0x1d283a,
          specular: 0x333333,
          shininess: 100,
        });
        const panel = new THREE.Mesh(panelGeo, panelMat) as unknown as PanelMesh;
        panel.position.set(-4 + i * 4, 10, -3 + j * 6);
        panel.userData = {
          targetY: 0.4,
          delay: (i + j) * 0.4,
          isPlaced: false,
        };
        panelGroup.add(panel);
        panels.push(panel);
      }
    }

    // 4. Energy Flow (Particles)
    const particleCount = 100;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xceee93, size: 0.05 });
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.visible = false;
    systemGroup.add(particles);

    camera.position.set(12, 10, 12);
    camera.lookAt(0, 0, 0);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Subtle orbital rotation
      systemGroup.rotation.y += delta * 0.12;

      // Panel assembly logic
      panels.forEach((panel) => {
        if (time > panel.userData.delay) {
          panel.position.y = THREE.MathUtils.lerp(panel.position.y, panel.userData.targetY, 0.03);
          if (Math.abs(panel.position.y - panel.userData.targetY) < 0.1) {
            panel.userData.isPlaced = true;
          }
        }
      });

      // Energy flow activation
      if (panels.every((p) => p.userData.isPlaced)) {
        particles.visible = true;
        particles.rotation.y += delta * 0.4;
      }

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 400;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="bg-[#F7F8F2] text-[#191c18] font-[Inter] antialiased overflow-x-hidden selection:bg-[#00490e] selection:text-white min-h-screen">
      {/* Dynamic Global Styles for Glassmorphism & Animations */}
      <style jsx global>{`
        .glass-panel {
          background: rgba(247, 248, 242, 0.82);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        .text-balance {
          text-wrap: balance;
        }
        .reveal-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.7s cubic-bezier(0.2, 0, 0, 1);
        }
        .reveal-up.active {
          opacity: 1;
          transform: translateY(0);
        }
        .threejs-container canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
          outline: none;
        }
      `}</style>

      {/* ── Top Navigation (Approved Sunlit Structure) ────────────────── */}
      <header
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(250, 248, 243, 0.96)' : 'rgba(247, 248, 242, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(191, 202, 186, 0.3)',
          boxShadow: scrolled ? '0 4px 24px rgba(0, 73, 14, 0.06)' : 'none',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-20 gap-8">
            {/* Brand Logo */}
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2.5 text-decoration-none shrink-0"
              aria-label="Sunlit Energy Home"
            >
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 73, 14, 0.25)',
                }}
              >
                <Sun size={19} color="#fff" strokeWidth={2.5} />
              </span>
              <span className="font-[Manrope] font-bold text-xl tracking-tight text-[#1a1c1b]">
                Sunlit Energy
              </span>
            </Link>

            {/* Center Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center justify-center gap-1 flex-1" role="menubar">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.submenu && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    role="menuitem"
                    className="flex items-center gap-1 px-3.5 py-2 rounded-lg font-[Inter] text-sm font-medium text-[#40493d] hover:text-[#00490e] hover:bg-[#00490e]/5 transition-all"
                    style={{
                      color: activeDropdown === link.label ? '#00490e' : '#40493d',
                      background: activeDropdown === link.label ? 'rgba(0,73,14,0.08)' : 'transparent',
                    }}
                  >
                    {link.label}
                    {link.submenu && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          activeDropdown === link.label ? 'rotate-180 text-[#00490e]' : 'text-[#707a6c]'
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {link.submenu && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 pt-2 min-w-[260px] z-50">
                      <div className="bg-[#fdfbf7]/98 backdrop-blur-2xl border border-[#bfcaba]/40 rounded-xl p-2 shadow-2xl">
                        {link.submenu.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={closeMenu}
                            className="block px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#1a1c1b] hover:text-[#00490e] hover:bg-[#00490e]/8 transition-all"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Action CTAs (Desktop) */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <Link
                href="/installers"
                className="px-4 py-2 rounded-full font-[Inter] text-sm font-semibold text-[#00490e] border border-[#00490e]/40 hover:bg-[#00490e] hover:text-white transition-all text-center"
              >
                Hire Installer
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg font-[Inter] text-sm font-semibold text-[#40493d] hover:text-[#00490e] hover:bg-[#00490e]/5 transition-all text-center"
              >
                Login
              </Link>
              <Link
                href="/get-started"
                className="px-6 py-2.5 rounded-full font-[Inter] text-sm font-semibold text-white bg-[#00490e] hover:bg-[#003006] transition-all shadow-[0_4px_14px_rgba(0,73,14,0.25)] hover:shadow-[0_6px_20px_rgba(0,73,14,0.35)] hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                Get Started
              </Link>
            </div>

            {/* Hamburger Button (Mobile) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-[#1a1c1b] hover:bg-[#00490e]/5 transition-colors"
              aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#faf8f3] border-t border-[#bfcaba]/30 px-6 py-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="border-b border-[#bfcaba]/20 py-3">
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block font-[Manrope] font-bold text-base text-[#00490e] mb-1"
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <div className="flex flex-col gap-1.5 pl-3 mt-2">
                    {link.submenu.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        onClick={closeMenu}
                        className="text-sm font-medium text-[#40493d] hover:text-[#00490e] py-1"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/installers"
                onClick={closeMenu}
                className="w-full py-3 rounded-xl border border-[#00490e]/40 font-semibold text-[#00490e] bg-white hover:bg-[#00490e]/5 text-center"
              >
                Hire Installer
              </Link>
              <Link
                href="/login"
                onClick={closeMenu}
                className="w-full py-3 rounded-xl border border-[#bfcaba]/40 font-semibold text-[#40493d] text-center"
              >
                Login
              </Link>
              <Link
                href="/get-started"
                onClick={closeMenu}
                className="w-full py-3 rounded-xl bg-[#00490e] text-white font-semibold shadow-md text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ── 01. HERO (Screenshot 1 Visual Source of Truth) ──────────── */}
        <section className="relative min-h-[92vh] flex items-center justify-center pt-24 sm:pt-28 pb-16 overflow-hidden reveal-up active">
          {/* Real High-Resolution Nigerian Solar Architectural Background */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Modern African architecture with rooftop solar panels and lush greenery"
              className="w-full h-full object-cover object-center brightness-90"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbZM0GZx4Syut1TCS_pUlIU1hAGfZP9ZYIRBzWpMfCxWMaAGgNWfhV2igBDLh695ijk3Z_Bf91EvdSDCVSzSEUxHEcD1XNjHtheURqjXQqvqa70HxLq5WWSpcnDnAJ15iDU12vq4MfZsXboJOEgZ_lAtaKXaRLHhsorzTJFQ3wA7Rgf6i7MBbQvyVm89HY-ZNfsHJtU7vYI2g2KMXLTP1ZaDKzuT0YPE1L11IXIh4tjLTWACxyL1Q"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F8F2] via-[#F7F8F2]/45 to-transparent z-10"></div>

          <div className="relative z-20 container mx-auto px-4 sm:px-8 lg:px-20 text-center flex flex-col items-center justify-center pt-8 pb-12">
            {/* Centered Large Frosted Glass Hero Card */}
            <div className="glass-panel p-8 sm:p-12 md:p-16 rounded-[28px] max-w-5xl mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.08)] mb-10 border border-white/60">
              <h1 className="font-[Manrope] text-4xl sm:text-6xl md:text-7xl text-[#001902] font-extrabold mb-6 text-balance tracking-tight leading-[1.08]">
                Powering Africa&apos;s next energy infrastructure.
              </h1>
              <p className="font-[Inter] text-base sm:text-xl text-[#42493f] mb-10 max-w-3xl mx-auto text-balance leading-relaxed">
                Sunlit Energy connects energy projects, engineering, installers, infrastructure, and intelligence into one operating ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/installers"
                  className="w-full sm:w-auto bg-[#001902] text-white rounded-full px-9 py-4 font-[Inter] text-sm font-semibold tracking-wide hover:bg-[#003006] transition-all shadow-[0_4px_16px_rgba(0,25,2,0.3)] hover:-translate-y-0.5 text-center"
                >
                  Hire an Installer
                </Link>
                <Link
                  href="/tools/solar-system-sizing"
                  className="w-full sm:w-auto border border-[#001902]/30 text-[#001902] bg-white/70 backdrop-blur-md rounded-full px-9 py-4 font-[Inter] text-sm font-semibold tracking-wide hover:bg-[#001902] hover:text-white transition-all text-center"
                >
                  Calculate Your Solar System
                </Link>
              </div>
            </div>

            {/* 3D Interactive Three.js Solar Assembly Card */}
            <div
              ref={threeContainerRef}
              className="threejs-container w-full max-w-4xl h-[320px] sm:h-[400px] relative z-30 rounded-[24px] overflow-hidden border border-[#c2c9bc]/50 glass-panel shadow-[0_12px_48px_rgba(0,25,2,0.12)]"
              id="threejs-container-ANIMATION_INSTALL"
            ></div>
          </div>
        </section>

        {/* ── 02. ECOSYSTEM ARCHITECTURE ─────────────────────────────── */}
        <section className="py-32 px-5 md:px-20 relative overflow-hidden bg-white reveal-up">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 lg:col-start-1 mb-8 lg:mb-0">
                <h2 className="font-[Manrope] text-3xl md:text-5xl font-bold text-[#191c18] mb-6 text-balance leading-tight">
                  Everything required to move an energy project from idea to operation.
                </h2>
                <p className="font-[Inter] text-lg text-[#42493f] leading-relaxed">
                  A fully integrated platform harmonizing the complex lifecycle of enterprise and regional energy deployments. Buyers, Installers, EPCs, and Financing interconnected seamlessly.
                </p>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 relative">
                <div className="relative w-full aspect-square md:aspect-video rounded-[24px] overflow-hidden glass-panel shadow-[0_8px_40px_rgba(0,25,2,0.06)] flex items-center justify-center bg-[#f3f4ed] border border-[#c2c9bc]/30 p-8">
                  <img
                    className="w-full h-full object-contain opacity-90 mix-blend-multiply"
                    alt="Abstract asymmetric diagram illustrating Sunlit interconnected energy ecosystem"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH2m_5yO_BhdKWToaBqELMt3g3ZZvNioqTXwZbPb1sTWDMmG7HZp1eThTzGV-8jKYcVwh8x4UTWBk71dsBfHCQZFHS_nBTEBmPTeqpqYFODxvO8OgkLSFFcBeRqq068QoCNkUwkQ9Lhw0e-g8HaYlnu87JwoHVipf38hFJDJOMj9SzFUWzzRDcNR4Uv1KH9DLzXy8xdIZ7vIHc9_D9mbRhEx9_4Gu7Ow_i0GyWMNej-dnpZz6oabU"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04. CAPABILITIES ───────────────────────────────────────── */}
        <section className="py-32 px-5 md:px-20 bg-[#F7F8F2] reveal-up">
          <div className="container mx-auto">
            <div className="mb-16 md:w-7/12">
              <h2 className="font-[Manrope] text-3xl md:text-5xl font-bold text-[#191c18] mb-4">
                Core Capabilities
              </h2>
              <p className="font-[Inter] text-lg text-[#42493f]">
                The tools and physical infrastructure needed for modern energy sovereignty.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 glass-panel rounded-[24px] p-8 shadow-sm flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-300">
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#cceb91] text-[#516b20] flex items-center justify-center mb-6">
                    <SunlitIcon name="solar_power" size={30} />
                  </div>
                  <h3 className="font-[Manrope] text-2xl font-bold text-[#191c18] mb-3">Solar Generation</h3>
                  <p className="font-[Inter] text-base text-[#42493f]">
                    High-yield photovoltaic solutions engineered for Nigerian meteorological conditions and extreme durability.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-7 glass-panel rounded-[24px] p-8 shadow-sm flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-300 bg-gradient-to-br from-[#F7F8F2] to-[#edefe7]">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#003006] text-[#bcf0b2] flex items-center justify-center mb-6">
                    <SunlitIcon name="battery_charging_full" size={30} />
                  </div>
                  <h3 className="font-[Manrope] text-2xl font-bold text-[#191c18] mb-3">LiFePO4 Energy Storage</h3>
                  <p className="font-[Inter] text-base text-[#42493f]">
                    Tier-1 high-voltage lithium battery systems delivering 6,000+ cycle warranties for 24/7 industrial uptime.
                  </p>
                </div>
                <div className="h-44 rounded-2xl overflow-hidden mt-4 relative">
                  <img
                    className="w-full h-full object-cover"
                    alt="Modern industrial battery storage unit"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDttncirWo4T3UnvJnTao0lGVs7CYDP5gTyAqXAB2kRM3s11B-x1vQn9aKf0SnJQOrfpOrkyYl_c4x5Nd7Y0dE57kQVWohKDYKcu2nBKes-8MdnJ1-4l5Q6hgqWLQuSjSXjP64SPv4ECTpYtY0GUBLiIhEhOsGTyQMhPEGjpPgGYYP3bejrUEqpg_CANYJ7xDDlugkwYvU2ICbmAGn13-Siw6nvQr9mPIlXytmCffjX-RE5dA-1eMA"
                  />
                </div>
              </div>
              <div className="lg:col-span-4 glass-panel rounded-[24px] p-8 shadow-sm flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-300">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#49142f] text-[#c27998] flex items-center justify-center mb-6">
                    <SunlitIcon name="architecture" size={30} />
                  </div>
                  <h3 className="font-[Manrope] text-2xl font-bold text-[#191c18] mb-3">Digital Sizing Tools</h3>
                  <p className="font-[Inter] text-base text-[#42493f]">
                    Precision mathematical software for load profiling, battery capacity, cable loss, and financial ROI.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-8 glass-panel rounded-[24px] p-8 shadow-sm flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-300">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#e2e3dc] text-[#42493f] flex items-center justify-center mb-6">
                    <SunlitIcon name="construction" size={30} />
                  </div>
                  <h3 className="font-[Manrope] text-2xl font-bold text-[#191c18] mb-3">EPC Execution & Escrow</h3>
                  <p className="font-[Inter] text-base text-[#42493f]">
                    End-to-end procurement and installation management with milestone-based payment escrow protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05. ENGINEERING TOOLS PLAYGROUND ───────────────────────── */}
        <section className="py-32 px-5 md:px-20 bg-white relative overflow-hidden reveal-up">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative h-[520px] w-full">
                {/* Floating Cards */}
                <div className="absolute top-6 left-0 w-4/5 glass-panel rounded-[20px] p-6 shadow-2xl z-20 border border-[#c2c9bc]/40 bg-[#F7F8F2]/95">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-[Inter] text-sm font-semibold text-[#42493f]">Yield Projection</span>
                    <TrendingUp size={20} className="text-[#00490e]" />
                  </div>
                  <div className="font-[Manrope] font-bold text-3xl text-[#191c18] mb-2">
                    98.4% <span className="text-sm font-normal text-[#707a6c]">Grid Independence</span>
                  </div>
                  <div className="w-full bg-[#e2e3dc] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00490e] h-full rounded-full w-[98.4%]"></div>
                  </div>
                </div>

                <div className="absolute bottom-6 right-0 w-4/5 glass-panel rounded-[20px] p-6 shadow-2xl z-30 border border-[#c2c9bc]/40 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-[Inter] text-sm font-semibold text-[#42493f]">Battery Autonomy</span>
                    <Activity size={20} className="text-[#00490e]" />
                  </div>
                  <div className="font-[Manrope] font-bold text-2xl text-[#191c18] mb-1">
                    18.5 Hours <span className="text-xs font-normal text-[#00490e] bg-[#00490e]/10 px-2 py-0.5 rounded-full">Optimal</span>
                  </div>
                  <p className="font-[Inter] text-xs text-[#707a6c]">
                    Calculated for continuous medical & IT server loads
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-[Manrope] text-3xl md:text-5xl font-bold text-[#191c18] mb-6 leading-tight">
                  Software-grade rigor for physical engineering.
                </h2>
                <p className="font-[Inter] text-lg text-[#42493f] mb-8 leading-relaxed">
                  Eliminate guesswork with our standardized calculation suite. Built for engineers, project owners, and facility managers across West Africa.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tools/solar-system-sizing"
                    className="inline-flex items-center gap-2 bg-[#001902] text-white px-6 py-3.5 rounded-full font-[Inter] text-sm font-semibold hover:bg-[#003006] transition-all shadow-md"
                  >
                    Open System Sizer <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/tools"
                    className="inline-flex items-center gap-2 border border-[#001902]/30 text-[#001902] px-6 py-3.5 rounded-full font-[Inter] text-sm font-semibold hover:bg-[#001902]/5 transition-all"
                  >
                    Explore All 10 Tools
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 06. FOR BUSINESS (C&I ENTERPRISE) ───────────────────────── */}
        <section className="py-32 px-5 md:px-20 bg-[#001902] text-white reveal-up">
          <div className="container mx-auto">
            <div className="max-w-3xl mb-16">
              <h2 className="font-[Manrope] text-3xl md:text-5xl font-bold text-white mb-6">
                Commercial &amp; Industrial Enterprise
              </h2>
              <p className="font-[Inter] text-lg text-white/80 leading-relaxed">
                Protect business margins from escalating diesel costs and Band A grid tariffs with structured solar PPA and CAPEX-free lease models.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[20px] bg-white/5 border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="font-[Manrope] text-2xl font-bold text-white mb-3">Zero Upfront CAPEX</h3>
                  <p className="font-[Inter] text-sm text-white/70 mb-6">
                    Power Purchase Agreements (PPA) that let you pay only for clean kWh generated on your rooftop.
                  </p>
                </div>
                <div className="font-[Manrope] text-xl font-bold text-[#bcf0b2]">Up to 40% OPEX Reduction</div>
              </div>
              <div className="p-8 rounded-[20px] bg-white/5 border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="font-[Manrope] text-2xl font-bold text-white mb-3">Multi-Site Telemetry</h3>
                  <p className="font-[Inter] text-sm text-white/70 mb-6">
                    Consolidated dashboard for corporate portfolios across Lagos, Abuja, Ogun, and regional factories.
                  </p>
                </div>
                <div className="font-[Manrope] text-xl font-bold text-[#bcf0b2]">Real-Time Fleet Oversight</div>
              </div>
              <div className="p-8 rounded-[20px] bg-white/5 border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="font-[Manrope] text-2xl font-bold text-white mb-3">Guaranteed SLA</h3>
                  <p className="font-[Inter] text-sm text-white/70 mb-6">
                    24/7 preventive maintenance, replacement parts warehousing, and contractual 99.8% uptime.
                  </p>
                </div>
                <div className="font-[Manrope] text-xl font-bold text-[#bcf0b2]">25-Year Asset Lifetime</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 07. VERIFIED INSTALLER NETWORK ─────────────────────────── */}
        <section className="py-32 px-5 md:px-20 bg-white reveal-up">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5">
                <h2 className="font-[Manrope] text-3xl md:text-5xl font-bold text-[#191c18] mb-6">
                  Verified Installer Network
                </h2>
                <p className="font-[Inter] text-lg text-[#42493f] mb-8 leading-relaxed">
                  Our rigorous 5-stage vetting process ensures you only work with the top tier of certified engineering contractors across Nigeria.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center border-b border-[#c2c9bc]/30 pb-3">
                    <span className="font-[Inter] text-base font-semibold text-[#191c18]">Lagos State Hub</span>
                    <span className="font-[Inter] text-xs font-bold text-[#003006] bg-[#00490e]/10 px-3 py-1 rounded-full">
                      200+ Certified EPCs
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#c2c9bc]/30 pb-3">
                    <span className="font-[Inter] text-base font-semibold text-[#191c18]">Abuja FCT Hub</span>
                    <span className="font-[Inter] text-xs font-bold text-[#003006] bg-[#00490e]/10 px-3 py-1 rounded-full">
                      80+ Certified EPCs
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#c2c9bc]/30 pb-3">
                    <span className="font-[Inter] text-base font-semibold text-[#191c18]">Ogun Industrial Belt</span>
                    <span className="font-[Inter] text-xs font-bold text-[#003006] bg-[#00490e]/10 px-3 py-1 rounded-full">
                      60+ Certified EPCs
                    </span>
                  </div>
                </div>
                <Link
                  href="/installers"
                  className="inline-block border-2 border-[#001902] text-[#001902] bg-transparent rounded-full px-8 py-3.5 font-[Inter] text-sm font-semibold hover:bg-[#001902] hover:text-white transition-all"
                >
                  Browse Installer Directory
                </Link>
              </div>

              <div className="lg:col-span-7">
                <div className="w-full aspect-square md:aspect-video rounded-[24px] bg-[#edefe7] overflow-hidden relative shadow-lg">
                  <div className="absolute inset-0 bg-[#F7F8F2] flex items-center justify-center p-8">
                    <div className="w-full h-full border-2 border-dashed border-[#c2c9bc]/40 rounded-[20px] relative">
                      <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-[#001902] rounded-full animate-pulse shadow-[0_0_15px_rgba(0,48,6,0.6)]"></div>
                      <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-[#4d661c] rounded-full shadow-[0_0_10px_rgba(77,102,28,0.5)]"></div>
                      <div className="absolute top-2/3 left-1/2 w-8 h-8 bg-[#003006] rounded-full animate-pulse shadow-[0_0_20px_rgba(0,48,6,0.4)] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#bcf0b2] rounded-full"></div>
                      </div>
                      <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-[#49142f] rounded-full shadow-[0_0_10px_rgba(73,20,47,0.4)]"></div>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
                        <path className="text-[#001902]" d="M 33% 25% Q 40% 45% 50% 66%" fill="none" stroke="currentColor" strokeDasharray="5,5" strokeWidth="2"></path>
                        <path className="text-[#001902]" d="M 25% 50% Q 35% 60% 50% 66%" fill="none" stroke="currentColor" strokeWidth="2"></path>
                        <path className="text-[#001902]" d="M 50% 66% Q 65% 50% 75% 33%" fill="none" stroke="currentColor" strokeDasharray="4,4" strokeWidth="1"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08. INTELLIGENT 5-STEP WORKFLOW ─────────────────────────── */}
        <section className="py-32 px-5 md:px-20 bg-[#F7F8F2] reveal-up">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-[Manrope] text-3xl md:text-5xl font-bold text-[#191c18] mb-6">
                Intelligent Execution Workflow
              </h2>
              <p className="font-[Inter] text-lg text-[#42493f]">
                A transparent, milestone-driven process removing friction from initial sizing to power commissioning.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              <div className="glass-panel p-6 rounded-2xl text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#001902] text-white flex items-center justify-center mb-4 shadow-md font-bold">
                  1
                </div>
                <h4 className="font-[Manrope] text-base font-bold text-[#191c18] mb-1">Discover</h4>
                <p className="text-xs text-[#707a6c]">Input load profile &amp; backup requirements</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#00490e] text-white flex items-center justify-center mb-4 shadow-md font-bold">
                  2
                </div>
                <h4 className="font-[Manrope] text-base font-bold text-[#191c18] mb-1">Design</h4>
                <p className="text-xs text-[#707a6c]">Solar array, inverter &amp; battery modeling</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#00490e] text-white flex items-center justify-center mb-4 shadow-md font-bold">
                  3
                </div>
                <h4 className="font-[Manrope] text-base font-bold text-[#191c18] mb-1">Match</h4>
                <p className="text-xs text-[#707a6c]">Receive competitive bids from vetted EPCs</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#00490e] text-white flex items-center justify-center mb-4 shadow-md font-bold">
                  4
                </div>
                <h4 className="font-[Manrope] text-base font-bold text-[#191c18] mb-1">Execute</h4>
                <p className="text-xs text-[#707a6c]">Milestone escrow releases upon site testing</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#4d661c] text-white flex items-center justify-center mb-4 shadow-md font-bold">
                  5
                </div>
                <h4 className="font-[Manrope] text-base font-bold text-[#191c18] mb-1">Monitor</h4>
                <p className="text-xs text-[#707a6c]">Live generation data &amp; warranty management</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 09. ENERGY INTELLIGENCE ─────────────────────────────────── */}
        <section className="py-32 px-5 md:px-20 bg-[#e2e3dc] reveal-up">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-6 relative">
                <div className="glass-panel rounded-[24px] p-8 shadow-2xl bg-[#F7F8F2] border border-[#c2c9bc]/50">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h4 className="font-[Inter] text-xs font-bold text-[#707a6c] uppercase tracking-wider mb-1">Live Telemetry</h4>
                      <span className="font-[Manrope] font-bold text-4xl text-[#001902] block">482.5 kW</span>
                    </div>
                    <div className="bg-[#00490e]/10 text-[#00490e] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00490e] animate-pulse"></span> Online
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center border-t border-[#c2c9bc]/30 pt-6">
                    <div>
                      <span className="text-xs text-[#707a6c] block mb-1">Grid</span>
                      <span className="font-[Manrope] text-lg font-bold text-[#191c18]">12%</span>
                    </div>
                    <div className="border-l border-r border-[#c2c9bc]/30">
                      <span className="text-xs text-[#707a6c] block mb-1">Solar PV</span>
                      <span className="font-[Manrope] text-lg font-bold text-[#00490e]">68%</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#707a6c] block mb-1">LiFePO4 Battery</span>
                      <span className="font-[Manrope] text-lg font-bold text-[#4d661c]">20%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6">
                <h2 className="font-[Manrope] text-3xl md:text-5xl font-bold text-[#191c18] mb-6 leading-tight">
                  Continuous Telemetry &amp; Asset Integrity
                </h2>
                <p className="font-[Inter] text-lg text-[#42493f] mb-6 leading-relaxed">
                  Monitor your entire solar portfolio from a unified dashboard. Real-time yield tracking, automated fault alerts, and audited milestone records.
                </p>
                <Link
                  href="/tools"
                  className="font-[Inter] text-sm font-semibold text-[#00490e] inline-flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Explore Energy Tools <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10. PROVEN AT SCALE / CASE STUDIES ──────────────────────── */}
        <section className="py-32 px-5 md:px-20 bg-[#F7F8F2] reveal-up">
          <div className="container mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-[Manrope] text-3xl md:text-5xl font-bold text-[#191c18]">
                  Engineering Archetypes &amp; Modeled Scenarios
                </h2>
                <p className="font-[Inter] text-base text-[#707a6c] mt-2">
                  Standardized solar engineering models and financial payback scenarios across Nigerian commercial and residential estates.
                </p>
              </div>
              <Link
                href="/testimonials"
                className="hidden md:inline-flex items-center gap-2 bg-[#edefe7] text-[#191c18] rounded-full px-6 py-3 font-[Inter] text-sm font-semibold hover:bg-[#e2e3dc] transition-colors"
              >
                View Modeled Scenarios <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-8 rounded-[24px] border border-[#c2c9bc]/30 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#00490e] bg-[#00490e]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    Modeled Industrial · Lagos
                  </span>
                  <h3 className="font-[Manrope] text-xl font-bold text-[#191c18] mb-2">TechPark Microgrid Scenario</h3>
                  <p className="font-[Inter] text-sm text-[#42493f] mb-4">1.2 MWp Solar + 2.5 MWh LiFePO4 Storage Baseline</p>
                </div>
                <div className="border-t border-[#c2c9bc]/20 pt-4 font-[Inter] text-xs font-semibold text-[#00490e]">
                  Up to 92% Modeled Generator Fuel Offset
                </div>
              </div>

              <div className="glass-panel p-8 rounded-[24px] border border-[#c2c9bc]/30 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#00490e] bg-[#00490e]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    Modeled Commercial · Abuja
                  </span>
                  <h3 className="font-[Manrope] text-xl font-bold text-[#191c18] mb-2">Retail Plaza Microgrid Scenario</h3>
                  <p className="font-[Inter] text-sm text-[#42493f] mb-4">850 kWp Synchronized Commercial Rooftop Baseline</p>
                </div>
                <div className="border-t border-[#c2c9bc]/20 pt-4 font-[Inter] text-xs font-semibold text-[#00490e]">
                  ₦8.4M Modeled Annual OPEX Savings
                </div>
              </div>

              <div className="glass-panel p-8 rounded-[24px] border border-[#c2c9bc]/30 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#00490e] bg-[#00490e]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    Modeled Agricultural · Ogun
                  </span>
                  <h3 className="font-[Manrope] text-xl font-bold text-[#191c18] mb-2">Agro-Processing Hybrid Scenario</h3>
                  <p className="font-[Inter] text-sm text-[#42493f] mb-4">400 kWp Ground Mount Hybrid Microgrid Baseline</p>
                </div>
                <div className="border-t border-[#c2c9bc]/20 pt-4 font-[Inter] text-xs font-semibold text-[#00490e]">
                  2.8-Year Modeled Capital Payback
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 11. ENTERPRISE TRUST LAYER ─────────────────────────────── */}
        <section className="py-32 px-5 md:px-20 bg-white reveal-up">
          <div className="container mx-auto text-center">
            <h2 className="font-[Manrope] text-3xl md:text-5xl font-bold text-[#191c18] mb-16">
              Enterprise Trust Layer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 glass-panel rounded-2xl border border-[#c2c9bc]/30">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#00490e]/10 flex items-center justify-center mb-6 text-[#00490e]">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="font-[Manrope] text-xl font-bold text-[#191c18] mb-3">Vetted EPC Contractors</h4>
                <p className="font-[Inter] text-sm text-[#42493f] leading-relaxed">
                  Every installer undergoes strict technical, legal, and financial verification before onboarding.
                </p>
              </div>

              <div className="p-8 glass-panel rounded-2xl border border-[#c2c9bc]/30">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#00490e]/10 flex items-center justify-center mb-6 text-[#00490e]">
                  <Lock size={28} />
                </div>
                <h4 className="font-[Manrope] text-xl font-bold text-[#191c18] mb-3">Milestone Escrow</h4>
                <p className="font-[Inter] text-sm text-[#42493f] leading-relaxed">
                  Capital is released in tranches only after mutual milestone verification and physical inspection.
                </p>
              </div>

              <div className="p-8 glass-panel rounded-2xl border border-[#c2c9bc]/30">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#00490e]/10 flex items-center justify-center mb-6 text-[#00490e]">
                  <FileCheck size={28} />
                </div>
                <h4 className="font-[Manrope] text-xl font-bold text-[#191c18] mb-3">Full Auditability</h4>
                <p className="font-[Inter] text-sm text-[#42493f] leading-relaxed">
                  Digital record of all CAD designs, warranties, electrical test reports, and maintenance logs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12. FINAL CONVERSION ───────────────────────────────────── */}
        <section className="py-32 px-5 md:px-20 bg-gradient-to-br from-[#001902] to-[#003006] text-white text-center reveal-up">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-[Manrope] text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 text-balance leading-tight">
              Ready to build the future of energy?
            </h2>
            <p className="font-[Inter] text-base sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with certified installers or join Nigeria&apos;s fastest growing clean energy infrastructure platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/request-quote"
                className="w-full sm:w-auto bg-white text-[#001902] rounded-full px-9 py-4 font-[Inter] text-sm font-bold tracking-wide hover:bg-[#F7F8F2] transition-all shadow-xl text-center"
              >
                Request Project Bids
              </Link>
              <Link
                href="/installers"
                className="w-full sm:w-auto border border-white/40 text-white bg-transparent rounded-full px-9 py-4 font-[Inter] text-sm font-bold tracking-wide hover:bg-white/10 transition-all text-center"
              >
                Join Installer Network
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer (Screenshot 3 Full Old Sunlit Structure & Colors) ── */}
      <MarketingFooter />
    </div>
  );
}
