interface CommonSchema {
  borderRadiusSmall: string;
  borderRadiusStandard: string;
}

interface FontSchema {
  family: string;
}

interface ColorsSchema {
  black: string;
  grey900: string;
  grey800: string;
  grey700: string;
  grey600: string;
  grey500: string;
  grey400: string;
  grey300: string;
  grey200: string;
  grey100: string;
  grey50: string;
  white: string;
  emerald600: string;
  emerald500: string;
  emerald400: string;
}

export interface ThemeSchema {
  common: CommonSchema;
  font: FontSchema;
  colors: ColorsSchema;
}
