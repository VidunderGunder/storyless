import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { FeasyStoryless } from "~/components/FeasyStoryless";
import { ClerkProvider } from "@clerk/nextjs";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
      <FeasyStoryless />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
