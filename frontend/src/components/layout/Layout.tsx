import React from "react";
import styled from "styled-components";

import Header from "../navigation/Header";
import Sidebar from "../navigation/Sidebar";
import { colorGrey800 } from "../../themes/selectors";

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: ${colorGrey800};
`;

const Layout: React.FunctionComponent = (props) => (
  <PageContainer>
    <Header />

    <Sidebar />

    <main>{props.children}</main>
  </PageContainer>
);

export default Layout;
