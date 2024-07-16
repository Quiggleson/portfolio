import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "./topnav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quigley Portfolio",
  description: "A collection of cool things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNav />
        {children}
        </body>
    </html>
  );
}
