import { Navbar } from '@/shared/components/marketing/Navbar';
import { Footer } from '@/shared/components/marketing/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pt-[80px] bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
