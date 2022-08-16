import "@/styles/app.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "@/components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>DX Automation Apps</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
