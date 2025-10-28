import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlantNamer — Funny names for your plants",
  description: "Give your plant a name it will actually respond to with a witty AI-generated pun."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="relative min-h-dvh bg-[#f5fff8] text-neutral-900 antialiased">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 top-[-220px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-emerald-200 via-emerald-100 to-transparent blur-3xl opacity-60" />
          <div className="absolute -right-24 top-16 h-[280px] w-[280px] rounded-full bg-gradient-to-br from-lime-200 via-white to-transparent blur-3xl opacity-70" />
          <div className="absolute bottom-[-200px] left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-gradient-to-tl from-emerald-100 via-white to-transparent blur-3xl opacity-60" />
        </div>
        <div className="relative mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 py-10 sm:px-8 lg:px-12">
          <div className="relative flex-1 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:p-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
