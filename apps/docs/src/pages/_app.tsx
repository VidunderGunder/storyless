import { type AppType } from "next/dist/shared/lib/utils";
import { StorylessExample } from "~/components/StorylessExample";

import "~/styles/globals.css";
import "~/styles/styles.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <StorylessExample />
    </>
  );
};

export default MyApp;
