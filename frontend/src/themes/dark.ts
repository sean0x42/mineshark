import { ThemeSchema } from "./types";

const darkTheme: ThemeSchema = {
  common: {
    borderRadiusSmall: "2px",
    borderRadiusStandard: "4px",
  },
  font: {
    family: "'Inter', sans-serif",
  },
  colors: {
    black: "#000",
    grey900: "#090E19",
    grey800: "#161E2B",
    grey700: "#283343",
    grey600: "#425062",
    grey500: "#64748B",
    grey400: "#94A3B8",
    grey300: "#CBD5E1",
    grey200: "#E2E8F0",
    grey100: "#F1F5F9",
    grey50: "#F8FAFC",
    white: "#fff",
    emerald600: "#059669",
    emerald500: "#10B981",
    emerald400: "#34D399",
  },
};

export default darkTheme;
