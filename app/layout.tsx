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
      <body className="min-h-dvh bg-white text-neutral-900 antialiased">
        <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
