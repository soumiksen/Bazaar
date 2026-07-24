import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import AuthHydrator from "./components/AuthHydrator";
import CartHydrator from "./components/CartHydrator";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Bazaar",
  description: "Bazaar application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="font-roboto min-h-full flex flex-col relative overflow-x-hidden">
        {/* --- FIXED BACKGROUND CANVAS --- */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-slate-50 bg-gradient-to-br from-sky-100 via-stone-50 to-cyan-100">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-100/30 blur-[140px] pointer-events-none" />
          <div className="absolute top-1/4 -left-60 h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-sky-100/40 blur-[140px] pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(30deg, #000 1px, transparent 1px), 
                linear-gradient(150deg, #000 1px, transparent 1px)
              `,
              backgroundSize: "1200px 1200px",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* --- INTERFACE LAYERS --- */}
        <AuthHydrator />
        <CartHydrator />
        <Navbar />
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}