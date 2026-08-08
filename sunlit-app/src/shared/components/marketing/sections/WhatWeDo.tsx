'use client';

import { Home, Building2, Wrench, Factory, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function WhatWeDo() {
  const router = useRouter();

  const handleCalculateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/tools/solar-system-sizing');
  };

  return (
    <section className="py-24 bg-surface relative" id="built-for-everyone">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-6">
          <h2 className="text-display-lg-mobile md:text-display-lg font-headline-xl text-on-surface font-extrabold tracking-tight">
            A Platform Built for Everyone
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl">
            End-to-end renewable energy solutions for homes, businesses and industrial facilities across Nigeria.
          </p>

          <ul className="flex flex-col gap-6 mt-2">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Home size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface mb-1">Homeowners</h4>
                <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">
                  Design, compare and install trusted rooftop solar systems for homes, estates and apartments.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Building2 size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface mb-1">Businesses</h4>
                <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">
                  Deploy reliable commercial solar solutions that reduce electricity costs and improve operational efficiency.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Wrench size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface mb-1">Installers & EPC Contractors</h4>
                <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">
                  Receive qualified customer requests, manage projects and grow your renewable energy business.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Factory size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface mb-1">Industrial Clients</h4>
                <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">
                  Large-scale renewable energy infrastructure engineered for factories, warehouses and manufacturing facilities.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Content: Floating Conversion Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 w-full max-w-md shadow-xl border border-stone-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h3 className="text-2xl font-extrabold text-on-surface mb-2 relative z-10">
              Calculate Your Solar Cost
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 relative z-10">
              Join thousands powering their future with Sunlit Energy.
            </p>

            <form onSubmit={handleCalculateSubmit} className="flex flex-col gap-4 relative z-10">
              <div>
                <label className="sr-only" htmlFor="property-type">Property Type</label>
                <select
                  id="property-type"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  defaultValue=""
                >
                  <option value="" disabled>Select Property Type...</option>
                  <option value="home">Home / Residential</option>
                  <option value="business">Business / Commercial</option>
                  <option value="industrial">Industrial Facility</option>
                </select>
              </div>

              <div>
                <label className="sr-only" htmlFor="electricity-bill">Monthly Electricity Bill</label>
                <input
                  id="electricity-bill"
                  type="text"
                  placeholder="Monthly Electricity Bill (₦)"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary px-6 py-4 rounded-xl text-label-sm font-bold hover:bg-primary-container hover:text-on-primary-container shadow-md transition-all flex justify-center items-center gap-2 mt-2 cursor-pointer"
              >
                Calculate Solar Cost
                <ArrowRight size={18} />
              </button>

              <p className="text-xs text-on-surface-variant text-center mt-1">
                Free estimate • No obligation • Instant engineering sizing
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
