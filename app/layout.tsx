import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/src/contexts/AuthContext';

export const metadata: Metadata = {
  title: "Billing App Dashboard",
  description: "Comprehensive billing management application",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
