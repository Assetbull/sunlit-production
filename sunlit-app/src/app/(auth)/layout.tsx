export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out" style={{ minHeight: '100dvh' }}>
      {children}
    </div>
  );
}
