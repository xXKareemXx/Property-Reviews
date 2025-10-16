import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Flex Living Dashboard</title>
        <link rel="icon" href="/flex_logo.png" />
        <meta name="description" content="Flex Living Dashboard" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
