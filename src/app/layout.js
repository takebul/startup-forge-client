import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "StartupForge — Build Great Startups Together",
    template: "%s | StartupForge",
  },
  description:
    "Connect visionary startup founders with world-class engineers, designers, and growth specialists to turn ambitious ideas into reality.",
  keywords: [
    "startups",
    "co-founders",
    "collaborators",
    "startup opportunities",
    "recruitment",
    "tech jobs",
    "early stage",
  ],
  authors: [{ name: "StartupForge" }],
  creator: "StartupForge Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "StartupForge",
    title: "StartupForge — Build Great Startups Together",
    description:
      "Connect visionary startup founders with world-class engineers, designers, and growth specialists.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StartupForge Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StartupForge — Build Great Startups Together",
    description:
      "Connect visionary startup founders with world-class talent to build high-growth ventures.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased min-h-screen flex flex-col font-sans transition-colors duration-200">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
