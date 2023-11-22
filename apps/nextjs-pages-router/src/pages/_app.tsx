import { Storyless } from "@storyless/react";
import { type AppType } from "next/dist/shared/lib/utils";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
      <Storyless
        components={{
          Button: <button>Hello</button>,
        }}
      />
    </main>
  );
};

export default MyApp;
