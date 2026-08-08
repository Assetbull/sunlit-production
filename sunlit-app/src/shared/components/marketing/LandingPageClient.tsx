'use client';

import { useWaitlist } from '@/shared/contexts/WaitlistContext';
import { HeroSection } from '@/shared/components/marketing/sections/HeroSection';
import { TrustBar } from '@/shared/components/marketing/sections/TrustBar';
import { WhatWeDo } from '@/shared/components/marketing/sections/WhatWeDo';
import { ServicesGrid } from '@/shared/components/marketing/sections/ServicesGrid';
import { WhySunlit } from '@/shared/components/marketing/sections/WhySunlit';
import { MapSection } from '@/shared/components/marketing/sections/MapSection';
import { HowItWorks } from '@/shared/components/marketing/sections/HowItWorks';
import { Benefits } from '@/shared/components/marketing/sections/Benefits';
import { CaseStudies } from '@/shared/components/marketing/sections/CaseStudies';
import { Testimonials } from '@/shared/components/marketing/sections/Testimonials';
import { LearningResources } from '@/shared/components/marketing/sections/LearningResources';
import { FAQPreview } from '@/shared/components/marketing/sections/FAQPreview';
import { AISummary } from '@/shared/components/marketing/sections/AISummary';
import { FinalCTA } from '@/shared/components/marketing/sections/FinalCTA';

export function LandingPageClient() {
  const { openWaitlist } = useWaitlist();

  return (
    <>
      <HeroSection onWaitlistOpen={openWaitlist} />
      <TrustBar />
      <WhatWeDo />
      <ServicesGrid onWaitlistOpen={openWaitlist} />
      <WhySunlit onWaitlistOpen={openWaitlist} />
      <MapSection onWaitlistOpen={openWaitlist} />
      <HowItWorks />
      <Benefits />
      <CaseStudies onWaitlistOpen={openWaitlist} />
      <Testimonials />
      <LearningResources />
      <AISummary />
      <FAQPreview />
      <FinalCTA onWaitlistOpen={openWaitlist} />
    </>
  );
}
