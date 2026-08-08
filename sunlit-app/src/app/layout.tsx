import type { Metadata } from "next";
import "./globals.css";

/**
 * Root Layout - Branding centralized here
 */

export const metadata: Metadata = {
  title: { default: 'Sunlit Energy', template: '%s | Sunlit Energy' },
  description:
    "Sunlit Energy — Nigeria's premier solar energy marketplace. Connect with verified installers, manage projects, and fund securely with milestone-based protection.",
  openGraph: {
    siteName: 'Sunlit Energy',
    title: 'Sunlit Energy',
    description:
      "Sunlit Energy — Nigeria's premier solar energy marketplace. Connect with verified installers, manage projects, and fund securely with milestone-based protection.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunlit Energy',
    description:
      "Sunlit Energy — Nigeria's premier solar energy marketplace. Connect with verified installers, manage projects, and fund securely with milestone-based protection.",
  },
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
