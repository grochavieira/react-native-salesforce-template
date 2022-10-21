import "styled-components";
import theme from "./theme";

// aqui é definido automaticamente o tipo das cores/fontes (theme.ts)
// para que fique mais fácil acessá-los no styled components
declare module "styled-components" {
  type ThemeType = typeof theme;

  export interface DefaultTheme extends ThemeType {}
}
