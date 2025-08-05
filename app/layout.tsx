import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import TopNav from "./topnav";

const inter = Inter({ subsets: ["latin"] });
const nunito = Nunito({ subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Robert Quigley's Portfolio",
  description: "A collection of cool things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className + ' ' + 'flex flex-col h-screen max-h-screen overflow-hidden'}>
        <TopNav />
        <div className="animate-fadeInBottom size-full overflow-y-scroll overflow-x-hidden">
          {children}
        </div>
        </body>
    </html>
  );
}
