import type { Metadata, Viewport } from "next";
import { Anton, Archivo_Black, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/data/content";
import Providers from "@/components/Providers";
import IntroCurtain from "@/components/IntroCurtain";
import "./globals.css";

const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    "Sahil Kumar",
    "Full Stack Developer",
    "Software Engineer",
    "ASP.NET",
    "React",
    "Flutter",
    "FastAPI",
    "Portfolio",
  ],
  authors: [{ name: "Sahil Kumar" }],
  creator: "Sahil Kumar",
  openGraph: {
    type: "website",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: "Sahil Kumar — Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f1e1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${archivo.variable} ${anton.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        <Providers>
          <IntroCurtain />
          {children}
        </Providers>
      </body>
    </html>
  );
}
