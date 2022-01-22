import React from "react";
import styled from "styled-components";
import { colorGrey900 } from "../../themes/selectors";

const Container = styled.header`
  background: ${colorGrey900};
  grid-column: 1 / 3;
`;

const Header: React.FunctionComponent = () => (
  <Container>
    <h1>Mineshark v0.1.0</h1>
  </Container>
);

export default Header;
