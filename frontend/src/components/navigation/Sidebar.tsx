import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { colorGrey700, colorGrey800 } from "../../themes/selectors";

const SidebarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  background: ${colorGrey800};
  border-right: 1px solid ${colorGrey700};
  padding: 0.5rem 0;
`;

const SidebarLink = styled.a`
  display: flex;
  padding: 0.5rem 1rem;
`;

const Sidebar: React.FunctionComponent = () => (
  <SidebarContainer>
    <Link href="/" passHref>
      <SidebarLink>Home</SidebarLink>
    </Link>

    <Link href="/packets" passHref>
      <SidebarLink>Packet Sniffer</SidebarLink>
    </Link>

    <Link href="/rules" passHref>
      <SidebarLink>Rule engine</SidebarLink>
    </Link>
  </SidebarContainer>
);

export default Sidebar;
