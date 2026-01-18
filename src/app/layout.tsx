import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZK Word Battles - Zero-Knowledge Word Game",
  description: "A daily head-to-head word game where players prove they solved a puzzle without revealing the answer. Zero-knowledge proofs attest to valid gameplay.",
  keywords: ["word game", "wordle", "zero-knowledge", "zk proofs", "blockchain", "gaming"],
  authors: [{ name: "ZK Word Battles" }],
  openGraph: {
    title: "ZK Word Battles",
    description: "Prove you solved the puzzle without revealing the answer!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121213] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
