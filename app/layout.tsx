import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import TopNav from "./topnav";

const inter = Inter({ subsets: ["latin"] });
const nunito = Nunito({ subsets: ["latin"]})

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
      <body className={nunito.className}>
        <TopNav />
        <div className="animate-fadeInBottom h-full">
          {children}
        </div>
        </body>
    </html>
  );
}
