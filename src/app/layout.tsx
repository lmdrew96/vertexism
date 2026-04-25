import type { Metadata } from "next";
import { fraunces, spaceGrotesk, geistMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vertexism — The Edges Between",
  description:
    "An essay on relational theology — the divine is in the connection, not the thing.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
