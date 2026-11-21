import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const TITLE = "Brexcel Orias — Full-Stack Software Developer, Philippines";
const DESCRIPTION =
  "I build full-stack web apps and the pipelines that ship them. Computer Engineering, URS Antipolo, Class of 2027. Open to internships and freelance.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Brexcel Joe M. Orias",
  alternateName: "Brexcel Orias",
  url: "https://brexcel.vercel.app",
  jobTitle: "Software Engineer Intern",
  worksFor: { "@type": "Organization", name: "Egoist Labs" },
  address: { "@type": "PostalAddress", addressCountry: "PH" },
  sameAs: ["https://github.com/brixcel", "https://www.linkedin.com/in/brexcel-orias-6b2a28321"],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://brexcel.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Brexcel Joe M. Orias",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9e9e6" },
    { media: "(prefers-color-scheme: dark)", color: "#131312" },
  ],
};

// Runs before first paint: restores the saved theme and flags that motion is
// allowed, so entrance states can be hidden in CSS without a flash.
const INIT_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("bjo-portfolio-theme");if(t)d.setAttribute("data-theme",t)}catch(e){}d.style.setProperty("--icon-invert",d.getAttribute("data-theme")==="dark"?"1":"0");if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)d.setAttribute("data-motion","on");try{if(sessionStorage.getItem("bjo-portfolio-visited")==="1")d.setAttribute("data-intro-seen","")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning>
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} suppressHydrationWarning />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
