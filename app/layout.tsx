import type { Metadata } from "next";
import { Caprasimo, Figtree } from "next/font/google";
import "./globals.css";

const caprasimo = Caprasimo({
  variable: "--font-caprasimo",
  weight: "400",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brexcel Joe M. Orias — Computer Engineering Student & Software Developer",
  description:
    "Building software to solve problems I actually encounter. Portfolio of Brexcel Joe M. Orias, a full-stack developer and Computer Engineering student.",
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("bjo-portfolio-theme");if(t)document.documentElement.setAttribute("data-theme",t);document.documentElement.style.setProperty("--icon-invert",document.documentElement.getAttribute("data-theme")==="dark"?"1":"0")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${caprasimo.variable} ${figtree.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
