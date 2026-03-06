import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
