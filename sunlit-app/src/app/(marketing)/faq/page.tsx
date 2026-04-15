import Link from 'next/link';

export default function GenericFooterPage() {
  return (
    <div className="container py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
      <p className="text-muted max-w-lg mx-auto mb-8">
        This section of the Sunlit Energy Marketplace is currently under construction.
        Please check back later for updates.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Homepage
      </Link>
    </div>
  );
}
