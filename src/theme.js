import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "Lato",
  },
  palette: {
    primary: {
      main: "#0052CE",
      color: "#FFFFFF",
      border: "#CFD1D7",
      hover: "#2175F4",
      disabled: "#A0C4F8",
      disabledColor: "#FFFFFF",
    },
    secondary: {
      main: "#FFFFFF",
      color: "#0052CE",
      border: "#0052CE",
      hover: "#F1FAFF",
      disabled: "#FFFFFF",
      disabledColor: "#C5DAF3",
    },
    mainBackground: {
      main: "#F4F8FB",
    },
    highlight: {
      main: "#F1FAFF",
    },
    cardBackground: {
      main: "#FFFFFF",
    },
    table: {
      color: "#434A51",
      headerColor: "#000000",
    },
    dialog: {
      color: "#002D72",
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { size: "small" },
          style: {
            height: "24px",
            fontSize: "14px",
          },
        },
        {
          props: { size: "medium" },
          style: {
            height: "32px",
            fontSize: "16px",
          },
        },
        {
          props: { size: "large" },
          style: {
            height: "40px",
            fontSize: "16px",
          },
        },
      ],
    },
    MuiInputBase: {
      root: {
        input: {
          backgroundColor: "white",
        },
      },
    },
  },
});
