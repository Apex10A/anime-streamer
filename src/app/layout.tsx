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
  title: "Luffy - Anime Universe | Watch Anime Online",
  description: "Discover and watch your favorite anime series and movies. Explore trending, popular, and latest anime content in our vast anime universe.",
  keywords: "anime, watch anime, anime streaming, manga, otaku, anime series, anime movies",
  authors: [{ name: "Luffy Anime" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#9333ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
