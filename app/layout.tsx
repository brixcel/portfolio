import type { Metadata, Viewport } from "next";
import { Caprasimo, Figtree } from "next/font/google";
import "./globals.css";

const caprasimo = Caprasimo({
  variable: "--font-caprasimo",
  weight: "400",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const TITLE = "Brexcel Joe M. Orias — Computer Engineering Student & Software Developer";
const DESCRIPTION =
  "Building software to solve problems I actually encounter. Portfolio of Brexcel Joe M. Orias, a full-stack developer and Computer Engineering student.";

export const metadata: Metadata = {
  metadataBase: new URL("https://brexcel.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Brexcel Joe M. Orias",
    type: "website",
  },
  twitter: {
    card: "summary",
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
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#201e1d" },
  ],
};

// Runs before first paint: restores the saved theme and flags that motion is
// allowed, so entrance states can be hidden in CSS without a flash.
const INIT_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("bjo-portfolio-theme");if(t)d.setAttribute("data-theme",t)}catch(e){}d.style.setProperty("--icon-invert",d.getAttribute("data-theme")==="dark"?"1":"0");if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)d.setAttribute("data-motion","on")})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${caprasimo.variable} ${figtree.variable}`}>
      <body suppressHydrationWarning>
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} suppressHydrationWarning />
        {children}
      </body>
    </html>
  );
}
