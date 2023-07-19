import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { EnsureAsteroidDataLoaded } from "../providers/asteroid-provider";
import { CSSProperties } from "react";

const inter = Inter({ subsets: ["latin"] });

const forceLightTheme: CSSProperties = {
    backgroundColor: 'white',
    color: 'black',
}

export const metadata: Metadata = {
  title: "Placer.ai test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light only" />
        <link rel="stylesheet" href="/layout.css"></link>
        <link
          rel="stylesheet"
          href="https://nordcdn.net/ds/css/3.1.0/nord.min.css"
        />
      </head>
      <body className={inter.className} style={forceLightTheme}>
        <EnsureAsteroidDataLoaded>
          <div id="layout">
            <header>Placer.ai Asteroids Research Center</header>
            <nav>
              <Link className="nav-item" href="/overview">
                Overview
              </Link>
              <Link className="nav-item" href="/investigate">
                Investigate
              </Link>
            </nav>
            <main>{children}</main>
          </div>
        </EnsureAsteroidDataLoaded>
      </body>
    </html>
  );
}
