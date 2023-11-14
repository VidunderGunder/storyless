import "./pico.min.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MyStoryless } from "../components/my-storyless";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Storyless",
  description: "Where Your App is the Canvas",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <MyStoryless />
    </html>
  );
}
