import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { siteUrl } from "@/lib/content";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yasamin Soraghi — Developer & Visual Creator",
    template: "%s | Yasamin Soraghi",
  },
  description:
    "Frontend-focused full-stack developer and visual creator in Tehran. Explore React projects, illustration, motion and video.",
  icons: { icon: "/media/ys-icon.png", apple: "/media/ys-icon.png" },
  openGraph: {
    type: "website",
    siteName: "Yasamin Soraghi",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Yasamin Soraghi — Full-stack Developer & Visual Creator",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ed" },
    { media: "(prefers-color-scheme: dark)", color: "#101522" },
  ],
};
const initialize = `(function(){try{var t=localStorage.getItem('ys-theme');document.documentElement.dataset.theme=t||((matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light')}catch(e){}})()`;
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const locale = h.get("x-portfolio-locale") === "fa" ? "fa" : "en";
  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: initialize }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
