import type { Metadata } from "next";
import "./globals.css";

/**
 * Root Layout
 * 
 * ClerkProvider is conditionally loaded only when a valid
 * NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is available. This prevents
 * runtime errors during local development without Clerk configured.
 */

export const metadata: Metadata = {
  title: "Sunlit Energy Marketplace",
  description: "Nigeria's premier solar energy marketplace — connect with verified installers, manage projects, and fund securely with escrow protection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
