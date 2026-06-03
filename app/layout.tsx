import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { MediaProvider } from "./context/MediaContext";

import CustomCursor from "./components/CustomCursor";
import { ThemeProvider } from "./components/ThemeProvider";
import WhatsAppButton from "./components/WhatsAppButton";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ShutterStory India — Premium Photography & Cinematography",
  description:
    "ShutterStory India — Where every frame tells a story. Award-winning photography and cinematography for weddings, portraits, editorials and commercial projects across India.",
  keywords: [
    "photography india",
    "wedding photography",
    "cinematography",
    "portrait photographer",
    "shutter story india",
  ],
  openGraph: {
    title: "ShutterStory India — Premium Photography & Cinematography",
    description:
      "Award-winning photography and cinematography. Every frame is a story.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <MediaProvider>
              <CustomCursor />
              <div id="scroll-progress" />
              {children}
              <WhatsAppButton />
            </MediaProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
