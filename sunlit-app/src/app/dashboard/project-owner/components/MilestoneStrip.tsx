import React from 'react';

const MilestoneStrip: React.FC = () => {
  const steps = [
    { id: '01', title: 'Site Survey', active: true },
    { id: '02', title: 'Procurement', active: false },
    { id: '03', title: 'Installation', active: false },
    { id: '04', title: 'Commissioning', active: false },
  ];

  return (
    <section className="mb-16">
      <h3 className="text-on-surface-variant font-label text-xs tracking-widest uppercase mb-8 ml-2">Pipeline Trajectory</h3>
      <div className="bg-surface-container-lowest rounded-full p-2 flex items-center justify-between shadow-sm relative">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex-1 flex items-center gap-4 px-6 py-3 rounded-full transition-all ${
              step.active 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'opacity-40'
            }`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step.active ? 'bg-primary text-white' : 'bg-on-surface-variant text-white'
            }`}>
              {step.id}
            </span>
            <span className="font-headline font-bold text-sm">{step.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MilestoneStrip;
