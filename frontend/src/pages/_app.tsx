import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import type { AppProps } from "next/app";
import Head from "next/head";
import "modern-normalize/modern-normalize.css";

import darkTheme from "../themes/dark";
import Layout from "../components/layout/Layout";
import { colorGrey200, fontFamily } from "../themes/selectors";

const GlobalFontStyle = createGlobalStyle`
  * {
    font-family: ${fontFamily};
    color: ${colorGrey200};
  }
`;

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <ThemeProvider theme={darkTheme}>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
        rel="stylesheet"
      />
    </Head>

    <GlobalFontStyle />

    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ThemeProvider>
);

export default App;
