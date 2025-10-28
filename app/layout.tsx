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
      <body className="min-h-dvh bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-neutral-900 antialiased">
        <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-16 pt-8 sm:px-8 lg:px-14">
          {children}
        </div>
      </body>
    </html>
  );
}
