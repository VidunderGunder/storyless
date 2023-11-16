import "./pico.min.css";
import "./globals.css";
import type { Metadata } from "next";
import { MyStoryless } from "../components/my-storyless";

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
      <body>
        {children}
        <MyStoryless />
      </body>
    </html>
  );
}
