import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "./components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "BuildCore — Site Command Center",
  description: "Construction operations, projects, workforce, materials and reporting in one command center.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  applicationName: "BuildCore",
  appleWebApp: { capable: true, title: "BuildCore", statusBarStyle: "default" },
  formatDetection: { telephone: false },
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
