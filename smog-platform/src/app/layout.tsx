import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";

export const metadata: Metadata = {
  title: "SmogIQ — Photochemical Smog Intelligence Platform",
  description: "Real-time air quality monitoring, smog simulation, and intelligent solutions for photochemical smog pollution.",
  keywords: ["air quality", "smog", "AQI", "pollution", "photochemical", "ozone", "NOx", "VOC"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-[72px] lg:ml-[260px] transition-all duration-300">
            <div className="gradient-mesh min-h-screen">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
