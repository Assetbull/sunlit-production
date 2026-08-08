import { UserCheck, Wrench, Lock, Cpu } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: UserCheck, label: 'Verified Professionals' },
  { icon: Wrench, label: 'Certified Engineers' },
  { icon: Lock, label: 'Secure Escrow Payments' },
  { icon: Cpu, label: 'AI Engineering' },
];

export function TrustBar() {
  return (
    <section className="py-8 bg-surface-container-lowest border-y border-surface-container-highest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-wrap justify-center gap-8 md:gap-16">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
              <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
