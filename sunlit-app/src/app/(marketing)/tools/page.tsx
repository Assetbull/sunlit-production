import { Metadata } from 'next';
import Link from 'next/link';
import { ALL_TOOLS } from '@/shared/components/tools/RelatedToolsList';
import { Cpu, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';

export const metadata: Metadata = {
  title: 'Solar Engineering Tools — Free System Sizing & Calculators | Sunlit Energy',
  description:
    'Free enterprise solar engineering calculators for Nigeria. Size solar panels, battery storage, inverters, cable gauges, PV string layouts, energy yield, and ROI.',
  keywords:
    'solar engineering tools nigeria, solar calculator lagos, battery sizing calculator, inverter sizing tool, cable sizing calculator, pv array layout',
  alternates: { canonical: 'https://sunlitenergy.com/tools' },
  openGraph: {
    title: 'Solar Engineering Tools — Sunlit Energy Nigeria',
    description: 'Free, validated solar engineering calculators built for Nigeria.',
    url: 'https://sunlitenergy.com/tools',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function ToolsIndexPage() {
  return (
    <main className="bg-surface min-h-screen pb-24">
      {/* Hero Header */}
      <header className="bg-surface-container-low border-b border-surface-container-highest py-16 px-margin-mobile md:px-margin-desktop text-center">
        <div className="max-w-container-max mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full mb-4">
            <Cpu size={16} className="text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Sunlit Public Engineering Suite
            </span>
          </div>
          <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-on-surface tracking-tight mb-4">
            Enterprise Solar Engineering Tools
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Free, deterministic calculation engines designed for homeowners, engineers, installers, and EPC contractors across Nigeria.
          </p>
        </div>
      </header>

      {/* Tools Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                  {tool.category}
                </div>
                <h2 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-emerald-950">
                  {tool.name}
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  {tool.description}
                </p>
              </div>

              <Link
                href={tool.path}
                className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md"
              >
                Launch Calculator <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Global Tools Waitlist */}
        <div className="mt-16">
          <PublicWaitlistForm
            title="Access Enterprise Engineering Reports"
            subtitle="Join the Sunlit Engineering Tools waitlist to unlock CAD downloads, automated single-line diagrams (SLD), and installer RFQ distribution."
          />
        </div>
      </section>
    </main>
  );
}
