import type { Metadata } from "next";
import { Inter_Tight, Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";

const sans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bizroast - Analyse claire de ton idee business",
  description:
    "Un analyste IA exigeant qui teste la solidite de ton idee business : risques, marche, concurrence, monetisation, plan de validation, Go/No-Go.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="bg-paper text-ink antialiased">
        <TopNav />
        <main className="min-h-[calc(100dvh-64px)]">{children}</main>
      </body>
    </html>
  );
}
