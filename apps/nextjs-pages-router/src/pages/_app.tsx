import { Storyless } from "@storyless/react";
import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <Storyless components={{}} />
    </>
  );
};

export default MyApp;
