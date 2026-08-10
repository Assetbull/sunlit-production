'use client';

/**
 * RefinedLandingPageClient — 12-Section Enterprise Public Platform
 * 
 * EXACT REPRODUCTION of the supplied HTML source of truth:
 * - TopNavBar with dynamic scroll blur effect
 * - 01 Hero with real Three.js 3D solar assembly & particle energy flow
 * - 02 Ecosystem
 * - 03 Capabilities
 * - 04 Engineering Tools with floating metrics
 * - 05 For Business (C&I Enterprise)
 * - 06 Verified Installer Network with dynamic hub counts & network canvas
 * - 07 Intelligent Execution (5-step workflow)
 * - 08 Energy Intelligence live generation telemetry
 * - 09 Projects / Proof
 * - 10 Africa / Locations
 * - 11 Trust Foundation (Escrow & Verification)
 * - 12 Final Conversion
 * - Advanced Enterprise Footer
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

export function RefinedLandingPageClient() {
  const threeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Navigation Scroll Effect
    const nav = document.getElementById('main-nav');
    const handleScroll = () => {
      if (!nav) return;
      if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);

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

    // Clean up any existing canvas children
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);

    // System Group
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);

    // 1. Modern Roof (Structure)
    const roofGeo = new THREE.BoxGeometry(12, 0.4, 12);
    const roofMat = new THREE.MeshPhongMaterial({ color: 0xe2d8d2 }); // warm cream
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
      systemGroup.rotation.y += delta * 0.15;

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
        particles.rotation.y += delta * 0.5;
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
    <div className="bg-[#F7F8F2] text-[#191c18] font-[Inter] antialiased overflow-x-hidden selection:bg-[#001902] selection:text-white min-h-screen">
      {/* Styles required for exact fidelity */}
      <style jsx global>{`
        .glass-panel {
          background: rgba(247, 248, 242, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .text-balance {
          text-wrap: balance;
        }
        .nav-scrolled {
          background: rgba(247, 248, 242, 0.95) !important;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid rgba(0, 48, 6, 0.05);
          backdrop-filter: blur(24px);
        }
        .reveal-up {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.2, 0, 0, 1);
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

      {/* TopNavBar */}
      <nav
        aria-label="Main Navigation"
        className="bg-transparent fixed top-0 w-full z-50 flex justify-between items-center h-20 px-5 md:px-20 max-w-full mx-auto transition-all duration-300"
        id="main-nav"
      >
        <div className="flex items-center gap-4 w-1/4">
          <span className="font-[Manrope] text-2xl tracking-tight font-bold text-[#191c18] uppercase">
            Sunlit Energy
          </span>
        </div>
        <div className="hidden md:flex items-center justify-center gap-8 w-2/4">
          <a
            className="text-[#42493f] hover:text-[#001902] transition-colors font-[Inter] text-sm font-semibold tracking-wide"
            href="/services"
          >
            Services
          </a>
          <a
            className="text-[#42493f] hover:text-[#001902] transition-colors font-[Inter] text-sm font-semibold tracking-wide"
            href="/solutions"
          >
            Solutions
          </a>
          <a
            className="text-[#42493f] hover:text-[#001902] transition-colors font-[Inter] text-sm font-semibold tracking-wide"
            href="/projects"
          >
            Projects
          </a>
          <a
            className="text-[#42493f] hover:text-[#001902] transition-colors font-[Inter] text-sm font-semibold tracking-wide"
            href="/installers"
          >
            Network
          </a>
          <a
            className="text-[#42493f] hover:text-[#001902] transition-colors font-[Inter] text-sm font-semibold tracking-wide"
            href="/resources"
          >
            Resources
          </a>
        </div>
        <div className="flex items-center justify-end gap-4 w-1/4">
          <a
            href="/installers"
            className="hidden md:flex items-center justify-center bg-[#001902] text-white rounded-[999px] px-6 py-2.5 font-[Inter] text-sm font-semibold hover:bg-[#003006] transition-all duration-200 ease-in-out"
          >
            Get Started
          </a>
          <button className="md:hidden text-[#191c18]" aria-label="Toggle Navigation">
            <SunlitIcon name="menu" size={24} />
          </button>
        </div>
      </nav>

      <main>
        {/* 01 HERO */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden reveal-up active">
          <div className="absolute inset-0 z-0">
            <img
              alt="Real Nigerian solar installation, Lagos architecture, realistic African technicians, tropical vegetation"
              className="w-full h-full object-cover object-center brightness-75"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbZM0GZx4Syut1TCS_pUlIU1hAGfZP9ZYIRBzWpMfCxWMaAGgNWfhV2igBDLh695ijk3Z_Bf91EvdSDCVSzSEUxHEcD1XNjHtheURqjXQqvqa70HxLq5WWSpcnDnAJ15iDU12vq4MfZsXboJOEgZ_lAtaKXaRLHhsorzTJFQ3wA7Rgf6i7MBbQvyVm89HY-ZNfsHJtU7vYI2g2KMXLTP1ZaDKzuT0YPE1L11IXIh4tjLTWACxyL1Q"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F8F2] via-[#F7F8F2]/40 to-transparent z-10"></div>
          <div className="relative z-20 container mx-auto px-5 md:px-20 text-center flex flex-col items-center justify-center pt-10 pb-20">
            <div className="glass-panel p-8 md:p-12 rounded-[20px] max-w-5xl mx-auto shadow-2xl mb-8">
              <h1 className="font-[Manrope] text-4xl md:text-7xl text-[#001902] font-bold mb-6 text-balance leading-tight">
                Powering Africa&apos;s next energy infrastructure.
              </h1>
              <p className="font-[Inter] text-lg md:text-xl text-[#42493f] mb-10 max-w-3xl mx-auto text-balance">
                Sunlit Energy connects energy projects, engineering, installers, infrastructure, and intelligence into one operating ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/installers"
                  className="w-full sm:w-auto bg-[#001902] text-white rounded-[999px] px-8 py-4 font-[Inter] text-sm font-semibold tracking-wider hover:bg-[#003006] transition-all shadow-md text-center"
                >
                  Hire an Installer
                </a>
                <a
                  href="/tools"
                  className="w-full sm:w-auto border-2 border-[#001902] text-[#001902] bg-transparent rounded-[999px] px-8 py-4 font-[Inter] text-sm font-semibold tracking-wider hover:bg-[#001902] hover:text-white transition-all glass-panel text-center"
                >
                  Calculate Your Solar System
                </a>
              </div>
            </div>
            {/* 3D Integration Container */}
            <div
              ref={threeContainerRef}
              className="threejs-container w-full max-w-4xl h-[300px] md:h-[400px] relative z-30 rounded-[20px] overflow-hidden border border-[#c2c9bc]/30 glass-panel shadow-[0_8px_40px_rgba(0,25,2,0.1)]"
              id="threejs-container-ANIMATION_INSTALL"
            ></div>
          </div>
        </section>

        {/* 02 ECOSYSTEM */}
        <section className="py-40 px-5 md:px-20 relative overflow-hidden bg-white reveal-up">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 lg:col-start-1 mb-12 lg:mb-0">
                <h2 className="font-[Manrope] text-3xl md:text-5xl font-semibold text-[#191c18] mb-6 text-balance">
                  Everything required to move an energy project from idea to operation.
                </h2>
                <p className="font-[Inter] text-lg text-[#42493f]">
                  A fully integrated platform harmonizing the complex lifecycle of enterprise and regional energy deployments. Buyers, Installers, EPCs, and Financing interconnected seamlessly.
                </p>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 relative">
                <div className="relative w-full aspect-square md:aspect-video rounded-[20px] overflow-hidden glass-panel shadow-[0_8px_40px_rgba(0,25,2,0.04)] flex items-center justify-center bg-[#f3f4ed] border border-[#c2c9bc]/30 p-8">
                  <img
                    className="w-full h-full object-contain opacity-90 mix-blend-multiply"
                    alt="A highly sophisticated, abstract asymmetric diagram illustrating an interconnected energy ecosystem."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH2m_5yO_BhdKWToaBqELMt3g3ZZvNioqTXwZbPb1sTWDMmG7HZp1eThTzGV-8jKYcVwh8x4UTWBk71dsBfHCQZFHS_nBTEBmPTeqpqYFODxvO8OgkLSFFcBeRqq068QoCNkUwkQ9Lhw0e-g8HaYlnu87JwoHVipf38hFJDJOMj9SzFUWzzRDcNR4Uv1KH9DLzXy8xdIZ7vIHc9_D9mbRhEx9_4Gu7Ow_i0GyWMNej-dnpZz6oabU"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 CAPABILITIES */}
        <section className="py-40 px-5 md:px-20 bg-[#F7F8F2] reveal-up">
          <div className="container mx-auto">
            <div className="mb-16 md:w-7/12">
              <h2 className="font-[Manrope] text-3xl md:text-5xl font-semibold text-[#191c18] mb-4">
                Core Capabilities
              </h2>
              <p className="font-[Inter] text-lg text-[#42493f]">
                The tools and physical infrastructure needed for modern resilience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 glass-panel rounded-[20px] p-8 shadow-[0_8px_40px_rgba(0,25,2,0.04)] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-[20px] bg-[#cceb91] text-[#516b20] flex items-center justify-center mb-6">
                    <SunlitIcon name="solar_power" size={32} />
                  </div>
                  <h3 className="font-[Manrope] text-2xl font-semibold text-[#191c18] mb-3">Solar Generation</h3>
                  <p className="font-[Inter] text-base text-[#42493f]">
                    High-yield photovoltaic solutions engineered for extreme environmental durability.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-7 glass-panel rounded-[20px] p-8 shadow-[0_8px_40px_rgba(0,25,2,0.04)] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 bg-gradient-to-br from-[#F7F8F2] to-[#edefe7]">
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-[20px] bg-[#003006] text-[#6b9b65] flex items-center justify-center mb-6">
                    <SunlitIcon name="battery_charging_full" size={32} />
                  </div>
                  <h3 className="font-[Manrope] text-2xl font-semibold text-[#191c18] mb-3">Energy Storage</h3>
                  <p className="font-[Inter] text-base text-[#42493f]">
                    Advanced utility-scale and commercial storage systems ensuring 24/7 power availability and grid stability.
                  </p>
                </div>
                <div className="h-48 rounded-[20px] overflow-hidden mt-6 relative">
                  <img
                    className="w-full h-full object-cover"
                    alt="A macro shot of a sleek, modern industrial battery storage unit"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDttncirWo4T3UnvJnTao0lGVs7CYDP5gTyAqXAB2kRM3s11B-x1vQn9aKf0SnJQOrfpOrkyYl_c4x5Nd7Y0dE57kQVWohKDYKcu2nBKes-8MdnJ1-4l5Q6hgqWLQuSjSXjP64SPv4ECTpYtY0GUBLiIhEhOsGTyQMhPEGjpPgGYYP3bejrUEqpg_CANYJ7xDDlugkwYvU2ICbmAGn13-Siw6nvQr9mPIlXytmCffjX-RE5dA-1eMA"
                  />
                </div>
              </div>
              <div className="lg:col-span-4 glass-panel rounded-[20px] p-8 shadow-[0_8px_40px_rgba(0,25,2,0.04)] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 mt-0 lg:-mt-12 z-10 relative">
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-[20px] bg-[#49142f] text-[#c27998] flex items-center justify-center mb-6">
                    <SunlitIcon name="architecture" size={32} />
                  </div>
                  <h3 className="font-[Manrope] text-2xl font-semibold text-[#191c18] mb-3">Digital Tools</h3>
                  <p className="font-[Inter] text-base text-[#42493f]">
                    Precision software for system sizing, layout planning, and financial modeling.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-8 glass-panel rounded-[20px] p-8 shadow-[0_8px_40px_rgba(0,25,2,0.04)] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-[20px] bg-[#e2e3dc] text-[#42493f] flex items-center justify-center mb-6">
                    <SunlitIcon name="construction" size={32} />
                  </div>
                  <h3 className="font-[Manrope] text-2xl font-semibold text-[#191c18] mb-3">EPC Execution</h3>
                  <p className="font-[Inter] text-base text-[#42493f]">
                    End-to-end engineering, procurement, and construction management for flawless deployment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 ENGINEERING TOOLS */}
        <section className="py-40 px-5 md:px-20 bg-white relative overflow-hidden reveal-up">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative h-[600px] w-full">
                {/* Floating UI Cards */}
                <div className="absolute top-10 left-0 w-3/4 glass-panel rounded-[20px] p-6 shadow-2xl z-20 border border-[#c2c9bc]/40 bg-[#F7F8F2]/90">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-[Inter] text-sm text-[#42493f]">Yield Projection</span>
                    <SunlitIcon name="trending_up" size={20} className="text-[#4d661c]" />
                  </div>
                  <div className="h-24 bg-[#e2e3dc] rounded-lg mb-4 w-full relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 h-1/2 w-1/4 bg-[#bcf0b2] rounded-t"></div>
                    <div className="absolute bottom-0 left-1/4 h-3/4 w-1/4 bg-[#cfee94] rounded-t"></div>
                    <div className="absolute bottom-0 left-2/4 h-full w-1/4 bg-[#003006] rounded-t"></div>
                    <div className="absolute bottom-0 left-3/4 h-2/3 w-1/4 bg-[#ffd8e5] rounded-t"></div>
                  </div>
                  <div className="flex justify-between font-[Inter] text-xs text-[#42493f]">
                    <span>Q1</span>
                    <span>Q2</span>
                    <span>Q3</span>
                    <span>Q4</span>
                  </div>
                </div>
                <div className="absolute top-48 right-0 w-2/3 glass-panel rounded-[20px] p-6 shadow-2xl z-30 border border-[#c2c9bc]/40 bg-[#F7F8F2]/90">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#001902] text-white rounded-full flex items-center justify-center">
                      <SunlitIcon name="calculate" size={24} />
                    </div>
                    <div>
                      <h4 className="font-[Inter] text-sm font-semibold text-[#191c18]">System Sizing</h4>
                      <p className="text-xs text-[#42493f]">ROI Optimization</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-[#c2c9bc]/20 pb-2">
                      <span className="text-sm text-[#42493f]">Capacity</span>
                      <span className="font-bold text-[#191c18]">500 kWp</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#c2c9bc]/20 pb-2">
                      <span className="text-sm text-[#42493f]">Storage</span>
                      <span className="font-bold text-[#191c18]">1.2 MWh</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="font-[Manrope] text-3xl md:text-5xl font-semibold text-[#191c18] mb-6">
                  Professional Engineering Tools
                </h2>
                <p className="font-[Inter] text-lg text-[#42493f] mb-8">
                  Access institutional-grade software for accurate system sizing, yield forecasting, and ROI calculations. Make data-driven decisions before a single panel is installed.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-4">
                    <SunlitIcon name="check_circle" size={20} className="text-[#003006]" />
                    <span className="font-[Inter] text-base text-[#191c18]">Advanced irradiance modeling</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <SunlitIcon name="check_circle" size={20} className="text-[#003006]" />
                    <span className="font-[Inter] text-base text-[#191c18]">Financial structuring &amp; payback analysis</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <SunlitIcon name="check_circle" size={20} className="text-[#003006]" />
                    <span className="font-[Inter] text-base text-[#191c18]">Automated BOM (Bill of Materials) generation</span>
                  </li>
                </ul>
                <a
                  href="/tools"
                  className="inline-block bg-[#001902] text-white rounded-[999px] px-8 py-4 font-[Inter] text-sm font-semibold hover:bg-[#003006] transition-all"
                >
                  Explore Tools
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 05 FOR BUSINESS */}
        <section className="py-40 px-5 md:px-20 bg-[#002203] text-white reveal-up">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="font-[Inter] text-sm text-[#a0d498] uppercase tracking-wider block mb-4">
                Commercial &amp; Industrial
              </span>
              <h2 className="font-[Manrope] text-3xl md:text-5xl font-semibold mb-6 text-white">
                Powering Modern Enterprise
              </h2>
              <p className="font-[Inter] text-lg text-white/80">
                Scalable, reliable energy solutions designed to protect your bottom line from grid volatility and rising tariffs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel rounded-[20px] p-8 border border-[#c2c9bc]/30 flex flex-col bg-[#003006] text-[#6b9b65]">
                <span className="text-5xl font-[Manrope] font-bold text-[#bcf0b2] mb-4">40%</span>
                <h4 className="font-[Manrope] text-xl font-semibold text-white mb-4">Cost Reduction</h4>
                <p className="font-[Inter] text-base text-white/90 mt-auto">
                  Average energy cost savings for heavy industrial clients within the first year of operation.
                </p>
              </div>
              <div className="glass-panel rounded-[20px] p-8 border border-[#c2c9bc]/30 flex flex-col bg-[#003006] text-[#6b9b65]">
                <span className="text-5xl font-[Manrope] font-bold mb-4 text-[#bcf0b2]">99.9%</span>
                <h4 className="font-[Manrope] text-xl font-semibold text-white mb-4">Uptime Guarantee</h4>
                <p className="font-[Inter] text-base text-white/90 mt-auto">
                  Mission-critical reliability supported by redundant storage and intelligent load shedding.
                </p>
              </div>
              <div className="glass-panel rounded-[20px] p-8 border border-[#c2c9bc]/30 flex flex-col bg-[#003006] text-[#6b9b65]">
                <span className="text-5xl font-[Manrope] font-bold text-[#bcf0b2] mb-4">0</span>
                <h4 className="font-[Manrope] text-xl font-semibold text-white mb-4">CapEx Options</h4>
                <p className="font-[Inter] text-base text-white/90 mt-auto">
                  Flexible PPA and lease-to-own financing models available for qualifying enterprises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 06 INSTALLER NETWORK */}
        <section className="py-40 px-5 md:px-20 bg-white reveal-up">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5">
                <h2 className="font-[Manrope] text-3xl md:text-5xl font-semibold text-[#191c18] mb-6">
                  Verified Installer Network
                </h2>
                <p className="font-[Inter] text-lg text-[#42493f] mb-8">
                  Our rigorous vetting process ensures you only work with the top tier of engineering and construction partners across Nigeria.
                </p>
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between items-center border-b border-[#c2c9bc]/30 pb-4">
                    <span className="font-[Inter] text-lg text-[#191c18]">Lagos Hub</span>
                    <span className="font-[Inter] text-sm font-semibold text-[#003006] bg-[#bcf0b2]/30 px-3 py-1 rounded-full">
                      142 Certified EPCs
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#c2c9bc]/30 pb-4">
                    <span className="font-[Inter] text-lg text-[#191c18]">Abuja Hub</span>
                    <span className="font-[Inter] text-sm font-semibold text-[#003006] bg-[#bcf0b2]/30 px-3 py-1 rounded-full">
                      87 Certified EPCs
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#c2c9bc]/30 pb-4">
                    <span className="font-[Inter] text-lg text-[#191c18]">Ogun Hub</span>
                    <span className="font-[Inter] text-sm font-semibold text-[#003006] bg-[#bcf0b2]/30 px-3 py-1 rounded-full">
                      54 Certified EPCs
                    </span>
                  </div>
                </div>
                <a
                  href="/installers"
                  className="inline-block border-2 border-[#001902] text-[#001902] bg-transparent rounded-[999px] px-8 py-4 font-[Inter] text-sm font-semibold hover:bg-[#001902] hover:text-white transition-all"
                >
                  Join the Network
                </a>
              </div>
              <div className="lg:col-span-7">
                <div className="w-full aspect-square md:aspect-video rounded-[20px] bg-[#edefe7] overflow-hidden relative shadow-lg">
                  {/* Abstract Map Representation */}
                  <div className="absolute inset-0 bg-[#F7F8F2] flex items-center justify-center p-8">
                    <div className="w-full h-full border-2 border-dashed border-[#c2c9bc]/40 rounded-[20px] relative">
                      {/* Nodes */}
                      <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-[#001902] rounded-full animate-pulse shadow-[0_0_15px_rgba(0,48,6,0.6)]"></div>
                      <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-[#4d661c] rounded-full shadow-[0_0_10px_rgba(77,102,28,0.5)]"></div>
                      <div className="absolute top-2/3 left-1/2 w-8 h-8 bg-[#003006] rounded-full animate-pulse shadow-[0_0_20px_rgba(0,48,6,0.4)] flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#bcf0b2] rounded-full"></div>
                      </div>
                      <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-[#49142f] rounded-full shadow-[0_0_10px_rgba(73,20,47,0.4)]"></div>
                      {/* Connections */}
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

        {/* 07 INTELLIGENT PROJECT EXECUTION */}
        <section className="py-40 px-5 md:px-20 bg-[#F7F8F2] reveal-up">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-[Manrope] text-3xl md:text-5xl font-semibold text-[#191c18] mb-6">
                Intelligent Execution
              </h2>
              <p className="font-[Inter] text-lg text-[#42493f]">
                A streamlined, transparent workflow that removes friction from procurement to commissioning.
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-8 md:gap-0">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-[#e2e3dc] -translate-y-1/2 z-0"></div>
              {/* Steps */}
              <div className="relative z-10 flex flex-col items-center text-center w-full md:w-auto">
                <div className="w-16 h-16 rounded-full bg-[#001902] text-white flex items-center justify-center mb-4 shadow-lg">
                  <SunlitIcon name="assignment" size={26} />
                </div>
                <h4 className="font-[Inter] text-sm font-semibold text-[#191c18] mb-2">1. DISCOVER</h4>
                <p className="text-xs text-[#42493f] max-w-[120px]">Define needs &amp; specs</p>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center w-full md:w-auto">
                <div className="w-16 h-16 rounded-full bg-[#e7e9e2] border-2 border-[#001902] text-[#001902] flex items-center justify-center mb-4 shadow-sm">
                  <SunlitIcon name="architecture" size={26} />
                </div>
                <h4 className="font-[Inter] text-sm font-semibold text-[#191c18] mb-2">2. DESIGN</h4>
                <p className="text-xs text-[#42493f] max-w-[120px]">System sizing &amp; layout</p>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center w-full md:w-auto">
                <div className="w-16 h-16 rounded-full bg-[#e7e9e2] border-2 border-[#001902] text-[#001902] flex items-center justify-center mb-4 shadow-sm">
                  <SunlitIcon name="group_add" size={26} />
                </div>
                <h4 className="font-[Inter] text-sm font-semibold text-[#191c18] mb-2">3. MATCH</h4>
                <p className="text-xs text-[#42493f] max-w-[120px]">Algorithmic EPC pairing</p>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center w-full md:w-auto">
                <div className="w-16 h-16 rounded-full bg-[#e7e9e2] border-2 border-[#001902] text-[#001902] flex items-center justify-center mb-4 shadow-sm">
                  <SunlitIcon name="bolt" size={26} />
                </div>
                <h4 className="font-[Inter] text-sm font-semibold text-[#191c18] mb-2">4. EXECUTE</h4>
                <p className="text-xs text-[#42493f] max-w-[120px]">Managed deployment</p>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center w-full md:w-auto">
                <div className="w-16 h-16 rounded-full bg-[#4d661c] text-white flex items-center justify-center mb-4 shadow-lg">
                  <SunlitIcon name="monitor" size={26} />
                </div>
                <h4 className="font-[Inter] text-sm font-semibold text-[#191c18] mb-2">5. MONITOR</h4>
                <p className="text-xs text-[#42493f] max-w-[120px]">Live generation data</p>
              </div>
            </div>
          </div>
        </section>

        {/* 08 ENERGY INTELLIGENCE */}
        <section className="py-40 px-5 md:px-20 bg-[#e2e3dc] reveal-up">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-6 relative">
                <div className="glass-panel rounded-[20px] p-8 shadow-2xl bg-[#F7F8F2] border border-[#c2c9bc]/50">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h4 className="font-[Inter] text-sm font-semibold text-[#42493f] mb-1">Live Generation</h4>
                      <span className="font-[Manrope] font-bold text-4xl text-[#001902] block">482.5 kW</span>
                    </div>
                    <div className="bg-[#bcf0b2]/20 text-[#001902] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#001902] animate-pulse"></span> Online
                    </div>
                  </div>
                  {/* Chart Placeholder */}
                  <div className="h-48 w-full border-b border-l border-[#c2c9bc]/30 relative mb-6">
                    {/* Bars */}
                    <div className="absolute bottom-0 left-[10%] w-[8%] h-[30%] bg-[#e2e3dc] rounded-t"></div>
                    <div className="absolute bottom-0 left-[20%] w-[8%] h-[50%] bg-[#e2e3dc] rounded-t"></div>
                    <div className="absolute bottom-0 left-[30%] w-[8%] h-[40%] bg-[#e2e3dc] rounded-t"></div>
                    <div className="absolute bottom-0 left-[40%] w-[8%] h-[70%] bg-[#bcf0b2] rounded-t"></div>
                    <div className="absolute bottom-0 left-[50%] w-[8%] h-[85%] bg-[#001902] rounded-t"></div>
                    <div className="absolute bottom-0 left-[60%] w-[8%] h-[60%] bg-[#003006] rounded-t"></div>
                    <div className="absolute bottom-0 left-[70%] w-[8%] h-[45%] bg-[#e2e3dc] rounded-t"></div>
                    <div className="absolute bottom-0 left-[80%] w-[8%] h-[20%] bg-[#e2e3dc] rounded-t"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <span className="text-xs text-[#42493f] block mb-1">Grid</span>
                      <span className="font-[Inter] text-sm font-semibold text-[#191c18]">12%</span>
                    </div>
                    <div className="border-l border-r border-[#c2c9bc]/30">
                      <span className="text-xs text-[#42493f] block mb-1">Solar</span>
                      <span className="font-[Inter] text-sm font-semibold text-[#001902]">68%</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#42493f] block mb-1">Battery</span>
                      <span className="font-[Inter] text-sm font-semibold text-[#4d661c]">20%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6">
                <h2 className="font-[Manrope] text-3xl md:text-5xl font-semibold text-[#191c18] mb-6">
                  Energy Intelligence
                </h2>
                <p className="font-[Inter] text-lg text-[#42493f] mb-6">
                  Monitor your entire portfolio across multiple sites from a single pane of glass. Real-time telemetry, predictive maintenance alerts, and automated ESG reporting.
                </p>
                <a
                  className="font-[Inter] text-sm font-semibold text-[#001902] inline-flex items-center gap-2 hover:gap-3 transition-all"
                  href="/dashboard"
                >
                  View Demo Dashboard <SunlitIcon name="arrow_forward" size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 09 PROJECTS / PROOF */}
        <section className="py-40 px-5 md:px-20 bg-[#F7F8F2] reveal-up">
          <div className="container mx-auto">
            <div className="flex justify-between items-end mb-12">
              <h2 className="font-[Manrope] text-3xl md:text-5xl font-semibold text-[#191c18] max-w-xl">
                Proven at Scale. Built for Impact.
              </h2>
              <a
                href="/projects"
                className="hidden md:inline-block bg-[#edefe7] text-[#191c18] rounded-[999px] px-6 py-3 font-[Inter] text-sm font-semibold hover:bg-[#e2e3dc] transition-colors"
              >
                View All Projects
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Project 1 */}
              <div className="group relative rounded-[20px] overflow-hidden aspect-[4/5] cursor-pointer">
                <div className="absolute inset-0 bg-[#e2e3dc]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#001902]/90 via-[#001902]/40 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <span className="text-xs font-bold text-[#bcf0b2] tracking-wider uppercase mb-2 block">
                    Industrial • Lagos
                  </span>
                  <h3 className="font-[Manrope] text-2xl font-bold text-white mb-2">TechPark Microgrid</h3>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    1.2 MWp + 2.5 MWh Storage
                  </p>
                </div>
              </div>
              {/* Project 2 */}
              <div className="group relative rounded-[20px] overflow-hidden aspect-[4/5] cursor-pointer">
                <div className="absolute inset-0 bg-[#e2e3dc]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#001902]/90 via-[#001902]/40 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <span className="text-xs font-bold text-[#bcf0b2] tracking-wider uppercase mb-2 block">
                    Commercial • Abuja
                  </span>
                  <h3 className="font-[Manrope] text-2xl font-bold text-white mb-2">Retail Plaza Array</h3>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    850 kWp Roof Mount
                  </p>
                </div>
              </div>
              {/* Project 3 */}
              <div className="group relative rounded-[20px] overflow-hidden aspect-[4/5] cursor-pointer hidden lg:block">
                <div className="absolute inset-0 bg-[#e2e3dc]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#001902]/90 via-[#001902]/40 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <span className="text-xs font-bold text-[#bcf0b2] tracking-wider uppercase mb-2 block">
                    Agricultural • Ogun
                  </span>
                  <h3 className="font-[Manrope] text-2xl font-bold text-white mb-2">Agro-Processing Off-grid</h3>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    400 kWp Ground Mount
                  </p>
                </div>
              </div>
            </div>
            <a
              href="/projects"
              className="md:hidden block text-center w-full mt-8 bg-[#edefe7] text-[#191c18] rounded-[999px] px-6 py-4 font-[Inter] text-sm font-semibold hover:bg-[#e2e3dc] transition-colors"
            >
              View All Projects
            </a>
          </div>
        </section>

        {/* 10 AFRICA / LOCATIONS */}
        <section className="py-40 px-5 md:px-20 bg-white reveal-up">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-[Manrope] text-3xl md:text-5xl font-semibold mb-6 text-[#191c18]">
                  Rooted in Nigeria. Built for Africa.
                </h2>
                <p className="font-[Inter] text-lg text-[#42493f] mb-8">
                  We don&apos;t just supply equipment; we engineer solutions specifically adapted for weak grids, extreme temperatures, and challenging logistics across the continent.
                </p>
                <div className="flex gap-4">
                  <div className="bg-[#edefe7] p-6 rounded-[20px] flex-1 border border-[#c2c9bc]/30">
                    <span className="font-[Manrope] text-3xl font-bold block mb-2 text-[#001902]">15+</span>
                    <span className="font-[Inter] text-sm text-[#42493f]">States Covered</span>
                  </div>
                  <div className="bg-[#edefe7] p-6 rounded-[20px] flex-1 border border-[#c2c9bc]/30">
                    <span className="font-[Manrope] text-3xl font-bold block mb-2 text-[#001902]">24/7</span>
                    <span className="font-[Inter] text-sm text-[#42493f]">Local Support</span>
                  </div>
                </div>
              </div>
              <div className="relative h-64 lg:h-full min-h-[400px] w-full rounded-[20px] overflow-hidden glass-panel shadow-lg flex items-center justify-center bg-[#F7F8F2]">
                <SunlitIcon name="public" size={120} className="text-[#001902]/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-[Inter] text-sm font-semibold text-[#001902] tracking-widest uppercase opacity-70">
                    Local Context • Global Standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11 TRUST FOUNDATION */}
        <section className="py-40 px-5 md:px-20 bg-[#F7F8F2] reveal-up">
          <div className="container mx-auto text-center">
            <h2 className="font-[Manrope] text-3xl md:text-5xl font-semibold text-[#191c18] mb-16">
              Enterprise Trust Layer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#edefe7] flex items-center justify-center mb-6">
                  <SunlitIcon name="verified_user" size={28} className="text-[#4d661c]" />
                </div>
                <h4 className="font-[Manrope] text-xl font-semibold text-[#191c18] mb-4">Verified Installers</h4>
                <p className="font-[Inter] text-base text-[#42493f] text-balance">
                  Every EPC undergoes rigorous technical, financial, and legal due diligence before platform onboarding.
                </p>
              </div>
              <div className="p-8 border-t md:border-t-0 md:border-l border-[#c2c9bc]/30">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#edefe7] flex items-center justify-center mb-6">
                  <SunlitIcon name="lock" size={28} className="text-[#4d661c]" />
                </div>
                <h4 className="font-[Manrope] text-xl font-semibold text-[#191c18] mb-4">Secure Escrow</h4>
                <p className="font-[Inter] text-base text-[#42493f] text-balance">
                  Milestone-based payment releases protect capital and ensure project deliverables are met.
                </p>
              </div>
              <div className="p-8 border-t md:border-t-0 md:border-l border-[#c2c9bc]/30">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#edefe7] flex items-center justify-center mb-6">
                  <SunlitIcon name="fact_check" size={28} className="text-[#4d661c]" />
                </div>
                <h4 className="font-[Manrope] text-xl font-semibold text-[#191c18] mb-4">Full Auditability</h4>
                <p className="font-[Inter] text-base text-[#42493f] text-balance">
                  Comprehensive digital paper trail for all designs, contracts, warranties, and maintenance logs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 12 FINAL CONVERSION */}
        <section className="py-40 px-5 md:px-20 bg-white reveal-up border-t border-[#c2c9bc]/20">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="font-[Manrope] text-4xl md:text-7xl font-bold text-[#001902] mb-8 text-balance">
              Ready to build the future of energy?
            </h2>
            <p className="font-[Inter] text-lg text-[#42493f] mb-12 text-balance">
              Join leading enterprises and certified installers on the Sunlit Energy platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/installers"
                className="w-full sm:w-auto bg-[#001902] text-white rounded-[999px] px-8 py-4 font-[Inter] text-sm font-semibold tracking-wider hover:bg-[#003006] transition-all shadow-md text-center"
              >
                Hire an Installer
              </a>
              <a
                href="/installers"
                className="w-full sm:w-auto border-2 border-[#001902] text-[#001902] bg-transparent rounded-[999px] px-8 py-4 font-[Inter] text-sm font-semibold tracking-wider hover:bg-[#001902] hover:text-white transition-all text-center"
              >
                Join Sunlit Energy Network
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Advanced Footer */}
      <footer className="w-full pt-24 pb-8 bg-[#002203] text-[#F7F8F2] border-t border-[#bcf0b2]/20 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-[#bcf0b2]/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-5 md:px-20 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 mb-20">
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-2">
              <span className="font-[Manrope] text-2xl font-bold text-[#F7F8F2] block mb-6 uppercase">
                Sunlit Energy
              </span>
              <p className="font-[Inter] text-base text-[#c2c9bc] mb-8 max-w-sm">
                Connecting buyers, certified installers, and reliable financing to build resilient, sustainable energy systems across Africa.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <a
                  aria-label="Link"
                  className="w-10 h-10 rounded-full border border-[#c2c9bc]/30 flex items-center justify-center hover:bg-[#bcf0b2] hover:text-[#001902] hover:border-[#bcf0b2] transition-all"
                  href="#"
                >
                  <SunlitIcon name="link" size={18} />
                </a>
                <a
                  aria-label="Email"
                  className="w-10 h-10 rounded-full border border-[#c2c9bc]/30 flex items-center justify-center hover:bg-[#bcf0b2] hover:text-[#001902] hover:border-[#bcf0b2] transition-all"
                  href="mailto:contact@sunlit.energy"
                >
                  <SunlitIcon name="mail" size={18} />
                </a>
              </div>
            </div>
            {/* Links Columns */}
            <div className="flex flex-col gap-4">
              <h4 className="font-[Inter] text-sm font-semibold text-[#bcf0b2] uppercase tracking-wider mb-2">
                PLATFORM
              </h4>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/dashboard">
                Dashboard
              </a>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/tools">
                Tools
              </a>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/pricing">
                Pricing
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-[Inter] text-sm font-semibold text-[#bcf0b2] uppercase tracking-wider mb-2">
                SERVICES
              </h4>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/services">
                Solar Generation
              </a>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/services">
                Energy Storage
              </a>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/services">
                Microgrids
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-[Inter] text-sm font-semibold text-[#bcf0b2] uppercase tracking-wider mb-2">
                RESOURCES
              </h4>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/resources">
                Documentation
              </a>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/blog">
                Blog
              </a>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/projects">
                Case Studies
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-[Inter] text-sm font-semibold text-[#bcf0b2] uppercase tracking-wider mb-2">
                TRUST
              </h4>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/about">
                Security
              </a>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/privacy">
                Privacy Policy
              </a>
              <a className="font-[Inter] text-base text-[#c2c9bc] hover:text-[#F7F8F2] hover:translate-x-1 transition-all duration-300" href="/terms">
                Terms of Service
              </a>
            </div>
          </div>
          {/* Footer Status Layer */}
          <div className="pt-8 border-t border-[#c2c9bc]/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-[Inter] text-sm text-[#c2c9bc]">
              © 2026 Sunlit Energy. Resilience through ecological innovation.
            </p>
            <div className="flex items-center gap-2 bg-[#003006]/30 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#bcf0b2] animate-pulse"></span>
              <span className="font-[Inter] text-xs font-semibold text-[#bcf0b2] uppercase tracking-widest">
                Platform Operational • EN-NG
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
