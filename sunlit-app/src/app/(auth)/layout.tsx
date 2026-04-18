import { Navbar } from '@/shared/components/marketing/Navbar';
import { Footer } from '@/shared/components/marketing/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pt-[80px]" style={{ background: 'radial-gradient(circle at 50% 50%, #fcf9f4 0%, #f6f3ee 100%)' }}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Decorative glass elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        
        <div className="w-full max-w-[1280px] flex justify-center relative z-10">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
