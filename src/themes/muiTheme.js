import { createTheme } from "@mui/material/styles";

import designTokens from "../tokens/design-tokens";
import alertStyles from "./alertStyles";
import buttonConfig from "./buttonStyles";
import dialogStyles from "./dialogStyles";
import switchStyles from "./switchStyles";
import tabStyles from "./tabStyles";
import tableStyles from "./tableStyles";
import textInputStyles from "./textInputStyles";

const customTheme = createTheme({
  palette: designTokens.palette,
  typography: designTokens.typography,
  shape: designTokens.shape,
  components: {
    ...alertStyles,
    ...buttonConfig,
    ...switchStyles,
    ...tabStyles,
    ...tableStyles,
    ...dialogStyles,
    ...textInputStyles,
  },

  ...designTokens.components,
});

export default customTheme;
