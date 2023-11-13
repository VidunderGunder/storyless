import "./pico.min.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Storyless } from "@storyless/react";
import { type ComponentPropsWithoutRef } from "react";

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

const StorylessComponents: ComponentPropsWithoutRef<
  typeof Storyless
>["components"] = {
  hello: <span>Hello World!</span>,
  button: <button type="button">Button</button>,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Storyless components={StorylessComponents} />
    </html>
  );
}
