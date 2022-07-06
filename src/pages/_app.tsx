import "../styles/app.scss";
import type { AppProps } from "next/app";
import Script from "next/script";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head >
        <title>Add-on Virtual Interface Mapping Signals</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
