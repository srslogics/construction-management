import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "./components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://construction-management-6vja.onrender.com"),
  title: "BuildCore",
  description: "Manage construction projects, workforce, materials, expenses and site reporting from one command center.",
  icons: {
    icon: "/buildcore-favicon.svg",
    shortcut: "/buildcore-favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  applicationName: "BuildCore",
  appleWebApp: { capable: true, title: "BuildCore", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "BuildCore",
    title: "BuildCore — Owner Command Centre",
    description: "Construction progress, money, materials and owner decisions in one command centre.",
    images: [
      {
        url: "/buildcore-whatsapp-preview-v2.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "BuildCore construction management command center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildCore — Owner Command Centre",
    description: "Construction progress, money, materials and owner decisions in one command centre.",
    images: ["/buildcore-whatsapp-preview-v2.jpg"],
  },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0b1728" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}<ServiceWorkerRegistration />
      </body>
    </html>
  );
}