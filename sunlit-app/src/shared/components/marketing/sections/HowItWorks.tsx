import { FileText, UserCheck, Compass, Lock, Wrench, Activity } from 'lucide-react';

const STEPS = [
  {
    icon: FileText,
    title: '1. Request a Quote',
    desc: 'Share your energy needs and location.',
  },
  {
    icon: UserCheck,
    title: '2. Compare Verified Installers',
    desc: 'Choose the best fit for your budget.',
  },
  {
    icon: Compass,
    title: '3. Proposal & Solar Design',
    desc: 'Custom AI engineering and 3D modeling.',
  },
  {
    icon: Lock,
    title: '4. Secure Escrow Payment',
    desc: 'Funds protected until milestones met.',
  },
  {
    icon: Wrench,
    title: '5. Professional Installation',
    desc: 'Track milestones and proof-of-work.',
  },
  {
    icon: Activity,
    title: '6. Monitoring & Support',
    desc: 'Live performance data and care.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-surface-container-lowest border-y border-surface-container-highest" id="how-it-works">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-display-lg-mobile md:text-display-lg font-headline-xl text-on-surface mb-4 font-extrabold tracking-tight">
            How It Works
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            A streamlined, transparent process from your first inquiry to full energy independence.
          </p>
        </div>

        {/* 6-step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="bg-surface rounded-2xl p-6 border border-surface-container-highest shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-on-surface mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
