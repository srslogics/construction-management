import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "./components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://construction-management-izrm.onrender.com"),
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
    title: "BuildCore — Construction Management",
    description: "Projects, workforce, materials and site reporting under complete control.",
    images: [
      {
        url: "/buildcore-preview.png",
        width: 1200,
        height: 630,
        alt: "BuildCore construction management command center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildCore — Construction Management",
    description: "Projects, workforce, materials and site reporting under complete control.",
    images: ["/buildcore-preview.png"],
  },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#176b4d" };

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
