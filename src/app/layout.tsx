import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter, Noto_Sans_Tamil } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tamil",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#001B44",
};

export const metadata: Metadata = {
  title: "11:11 — For Ammuuu ❤️",
  description:
    "A luxury digital experience crafted with love. Every 11:11, a wish is made — and it's always you.",
  keywords: ["11:11", "love", "Ammuuu", "wish", "digital experience"],
  authors: [{ name: "With Love" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "11:11 — A Wish for You",
    description: "Every 11:11, my wish is the same. It's you. Forever.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${notoTamil.variable} antialiased`}
    >
      <body className="min-h-screen min-h-dvh bg-deep-navy text-white font-[family-name:var(--font-inter)] select-none overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
