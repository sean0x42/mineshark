import React from "react";
import { ThemeProvider } from "styled-components";
import type { AppProps } from "next/app";
import "modern-normalize/modern-normalize.css";

import darkTheme from "../themes/dark";
import Layout from "../components/layout/Layout";

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <ThemeProvider theme={darkTheme}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ThemeProvider>
);

export default App;
