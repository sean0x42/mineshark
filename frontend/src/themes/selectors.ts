import { ThemeSchema } from "./types";

interface PropsWithTheme {
  theme: ThemeSchema;
}

const theme = (props: PropsWithTheme) => props.theme;
const colors = (props: PropsWithTheme) => theme(props).colors;

export const colorGrey900 = (props: PropsWithTheme) => colors(props).grey900;
export const colorGrey800 = (props: PropsWithTheme) => colors(props).grey800;
export const colorGrey700 = (props: PropsWithTheme) => colors(props).grey700;
