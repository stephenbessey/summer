import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "SureFire Seller - Real Estate CRM",
  description: "Simple real estate lead management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${playfair.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}