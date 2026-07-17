import type { Metadata } from "next";
import { Poppins, Playfair_Display, Great_Vibes, Montserrat, Dancing_Script } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "A Magical 11:11 Wish | Ammuuuu 💙",
  description: "A beautiful, premium digital experience filled with floating tulips, blue butterflies, and a sky of stars spelling out a special wish at 11:11.",
  keywords: ["11:11", "Ammuuuu", "Tulips", "Wishes", "Stars", "Magic", "Blue Butterflies"],
  authors: [{ name: "Antigravity" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} ${greatVibes.variable} ${montserrat.variable} ${dancingScript.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans select-none">
        {children}
      </body>
    </html>
  );
}
