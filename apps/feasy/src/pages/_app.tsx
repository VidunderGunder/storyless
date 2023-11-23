import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { FeasyStoryless } from "~/components/FeasyStoryless";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "~/styles/globals.css";
import "~/styles/styles.css";
import { Navigation } from "~/components/Navigation";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: "#1d253f",
          colorPrimary: "#4ba3e3",
          colorTextOnPrimaryBackground: "#fff",
          colorText: "#fff",
          colorTextSecondary: "#cccccc",
          colorAlphaShade: "rgba(255, 255, 255, 0.25)",
          colorShimmer: "#ffffff",
        },
      }}
      {...pageProps}
    >
      <Navigation />
      <Component {...pageProps} />
      <FeasyStoryless />
      <Analytics />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
