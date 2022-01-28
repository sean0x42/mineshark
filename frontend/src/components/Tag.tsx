import styled from "styled-components";
import {
  borderRadiusStandard,
  colorEmerald400,
  colorGrey700,
} from "../themes/selectors";

const Tag = styled.span`
  background: ${colorGrey700};
  color: ${colorEmerald400};
  border-radius: ${borderRadiusStandard};
  padding: 4px;
`;

export default Tag;
