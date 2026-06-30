import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { I18nProvider } from "@/lib/I18nProvider";
import { TutorialProvider } from "@/components/TutorialEngine";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HalalChain",
  description: "Halal supply chain verification (prototype)",
  icons: {
    icon: "/logo-notext.png",
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <I18nProvider>
            <TutorialProvider>
              {children}
            </TutorialProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
