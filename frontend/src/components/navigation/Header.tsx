import React from "react";
import styled from "styled-components";
import { colorGrey700, colorGrey900 } from "../../themes/selectors";
import Tag from "../Tag";

const Container = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem;

  background: ${colorGrey900};
  border-bottom: 1px solid ${colorGrey700};
  grid-column: 1 / 3;
`;

const Heading = styled.h1`
  line-height: 100%;
  font-size: 18px;
  margin: 0;
  margin-right: 1rem;
`;

const Header: React.FunctionComponent = () => (
  <Container>
    <Heading>mineshark</Heading>
    <Tag>v0.1.0-alpha</Tag>
  </Container>
);

export default Header;
