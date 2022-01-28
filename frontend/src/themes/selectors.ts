import { ThemeSchema } from "./types";

interface PropsWithTheme {
  theme: ThemeSchema;
}

const theme = (props: PropsWithTheme) => props.theme;
const common = (props: PropsWithTheme) => theme(props).common;
const font = (props: PropsWithTheme) => theme(props).font;
const colors = (props: PropsWithTheme) => theme(props).colors;

export const borderRadiusSmall = (props: PropsWithTheme) =>
  common(props).borderRadiusSmall;
export const borderRadiusStandard = (props: PropsWithTheme) =>
  common(props).borderRadiusStandard;

export const fontFamily = (props: PropsWithTheme) => font(props).family;

export const colorGrey900 = (props: PropsWithTheme) => colors(props).grey900;
export const colorGrey800 = (props: PropsWithTheme) => colors(props).grey800;
export const colorGrey700 = (props: PropsWithTheme) => colors(props).grey700;
export const colorGrey200 = (props: PropsWithTheme) => colors(props).grey200;
export const colorGrey100 = (props: PropsWithTheme) => colors(props).grey100;

export const colorEmerald600 = (props: PropsWithTheme) =>
  colors(props).emerald600;
export const colorEmerald500 = (props: PropsWithTheme) =>
  colors(props).emerald500;
export const colorEmerald400 = (props: PropsWithTheme) =>
  colors(props).emerald400;
