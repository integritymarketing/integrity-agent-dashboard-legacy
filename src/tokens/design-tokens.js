export default {
  palette: {
    text: {
      primary: "#434A51",
      secondary: "#717171",
      hover: "rgba(0, 0, 0, 0.15)",
      selected: "rgba(0, 0, 0, 0.08)",
      focus: "rgba(0, 0, 0, 0.12)",
      focusVisible: "rgba(0, 0, 0, 0.3)",
    },
    primary: {
      main: "#4178FF",
      dark: "#1357FF",
      hover: "rgba(65, 120, 255, 0.15)",
      selected: "rgba(65, 120, 255, 0.08)",
      focus: "rgba(65, 120, 255, 0.12)",
      focusVisible: "rgba(65, 120, 255, 0.3)",
      outlinedBorder: "rgba(65, 120, 255, 0.5)",
    },
    secondary: {
      main: "#FFFFFF",
      dark: "#F6F6F6",
      light: "#FFFFFF",
      contrast: "#1357FF",
      hover: "rgba(255, 255, 255, 0.15)",
      selected: "rgba(255, 255, 255, 0.08)",
      focus: "rgba(255, 255, 255, 0.12)",
      focusVisible: "rgba(255, 255, 255, 0.3)",
      outlinedBorder: "rgba(255, 255, 255, 0.5)",
    },
    action: {
      hover: "rgba(0, 0, 0, 0.15)",
      selected: "#F1FAFF",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    error: {
      main: "#C81E27",
      dark: "#9F040C",
      light: "#FBDEDE",
      hover: "rgba(200, 30, 38, 0.15)",
      selected: "rgba(200, 30, 38, 0.08)",
      focusVisible: "rgba(200, 30, 38, 0.3)",
      outlinedBorder: "rgba(200, 30, 38, 0.5)",
    },
    warning: {
      main: "#F56600",
      dark: "#D03E00",
      light: "#FCF2E8",
      hover: "rgba(245, 102, 0, 0.15)",
      selected: "rgba(245, 102, 0, 0.08)",
      focusVisible: "rgba(245, 102, 0, 0.3)",
      outlinedBorder: "rgba(245, 102, 0, 0.5)",
    },
    info: {
      main: "#49648B",
      dark: "#1D3E71",
      light: "#7188A8",
      hover: "rgba(73, 100, 139, 0.15)",
      selected: "rgba(73, 100, 139, 0.08)",
      focusVisible: "rgba(73, 100, 139, 0.3)",
      outlinedBorder: "rgba(73, 100, 139, 0.5)",
    },
    success: {
      main: "#009E15",
      dark: "#008011",
      light: "#E5FAEB",
      hover: "rgba(0, 158, 21, 0.15)",
      selected: "rgba(0, 158, 21, 0.08)",
      focusVisible: "rgba(0, 158, 21, 0.3)",
      outlinedBorder: "rgba(0, 158, 21, 0.5)",
    },
    common: {
      black: {
        main: "#000000",
        hover: "rgba(0, 0, 0, 0.15)",
        selected: "rgba(0, 0, 0, 0.08)",
        focus: "rgba(0, 0, 0, 0.12)",
        focusVisible: "rgba(0, 0, 0, 0.3)",
        outlinedBorder: "rgba(0, 0, 0, 0.5)",
      },
      white: {
        main: "#FFFFFF",
        hover: "rgba(255, 255, 255, 0.15)",
        selected: "rgba(255, 255, 255, 0.08)",
        focus: "rgba(255, 255, 255, 0.12)",
        focusVisible: "rgba(255, 255, 255, 0.3)",
        outlinedBorder: "rgba(255, 255, 255, 0.5)",
      },
    },
    background: {
      default: "#F1F1F1",
    },
    components: {
      switch: {
        slideFill: "#7188A8",
        knobFillEnabled: "#FAFAFA",
        knowFillDisabled: "#F5F5F5",
      },
      avatar: {
        fill: "#BDBDBD",
      },
      input: {
        standard: {
          enabledBorder: "rgba(0, 0, 0, 0.42)",
          hoverBorder: "#000000",
        },
        outlined: {
          hoverBorder: "#052A63",
          enabledBorder: "rgba(0, 0, 0, 0.23)",
        },
        filled: {
          enabledFill: "rgba(0, 0, 0, 0.06)",
          hoverFill: "rgba(0, 0, 0, 0.09)",
        },
      },
      rating: {
        enabledBorder: "rgba(0, 0, 0, 0.23)",
        activeFill: "#FFB400",
      },
      snackbar: {
        fill: "#FFFFFF",
      },
      appBar: {
        defaultFill: "#F5F5F5",
      },
      stepper: {
        connector: "#BDBDBD",
      },
      chip: {
        defaultCloseFill: "#000000",
        defaultHoverFill: "rgba(0, 0, 0, 0.12)",
        defaultEnabledBorder: "#BDBDBD",
        defaultFocusFill: "rgba(0, 0, 0, 0.2)",
      },
      alert: {
        warning: {
          color: "#F56600",
          background: "#FCF2E8",
        },
        error: {
          color: "#C81E27",
          background: "#FBDEDE",
        },
        info: {
          color: "#1D3E71",
          background: "#F1FAFF",
        },
        success: {
          background: "#E5FAEB",
          color: "#009E15",
        },
      },
      breadcrumbs: {
        collapseFill: "#F5F5F5",
      },
      backdrop: {
        fill: "rgba(5, 42, 99, 0.7)",
      },
      tooltip: {
        fill: "rgba(97, 97, 97, 0.9)",
      },
    },
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      fontWeight: 400,
      lineHeight: "56px",
    },
    h2: {
      fontSize: "2rem",
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      fontWeight: 400,
      lineHeight: "40px",
    },
    h3: {
      fontSize: "1.5rem",
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      lineHeight: "32px",
    },
    h4: {
      fontSize: "1.25rem",
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      fontWeight: 500,
      lineHeight: "24px",
    },
    h5: {
      fontSize: "1rem",
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      fontWeight: 600,
      lineHeight: "20px",
    },
    h6: {
      fontSize: "0.875rem",
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      fontWeight: 700,
      lineHeight: "16px",
    },
    body1: {
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      lineHeight: "20px",
    },
    body2: {
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      lineHeight: "18px",
    },
    subtitle1: {
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      lineHeight: "auto",
    },
    subtitle2: {
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      lineHeight: "auto",
    },
    overline: {
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      lineHeight: "auto",
    },
    caption: {
      fontFamily: "Lato, Helvetica, Arial, sans-serif",
      lineHeight: "auto",
    },
  },
  shape: {
    "padding & gap-x-sm+ (6)": 6,
    "none (0)": 0,
  },
  spacing: [0],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-sizeLarge.MuiButton-containedPrimary": {
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              padding: "12px 8px",
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
              color: "var(--mui-palette-action-disabled)",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Lato, Helvetica, Arial, sans-serif",
              fontSize: "1.125rem",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "22px /* 122.222% */",
              textTransform: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              padding: "12px 0px",
              background: "var(--mui-palette-primary-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              padding: "12px 0px",
              background: "var(--mui-palette-primary-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              padding: "12px 0px",
              background: "#B3C9FF",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-containedInherit": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "#F5F5F5",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-containedInherit (white)": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "#F5F5F5",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-containedSecondary": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-secondary-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-secondary-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-secondary-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-containedError": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-error-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-error-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-error-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-containedWarning": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-warning-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-warning-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-warning-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-containedInfo": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-info-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-info-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-info-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-containedSuccess": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-success-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-success-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-success-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-containedPrimary": {
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              padding: "8px",
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
              color: "var(--mui-palette-action-disabled)",
              fontFamily: "Lato, Helvetica, Arial, sans-serif",
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "20px /* 125% */",
              textTransform: "none",
              display: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              padding: "8px 0px",
              background: "var(--mui-palette-primary-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              padding: "8px 0px",
              background: "#B3C9FF",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              padding: "8px 0px",
              background: "var(--mui-palette-primary-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-containedInherit": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "#F5F5F5",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-containedInherit (white)": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "#F5F5F5",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-containedSecondary": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-secondary-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-secondary-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-secondary-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-containedError": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-error-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-error-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-error-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-containedWarning": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-warning-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-warning-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-warning-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-containedInfo": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-info-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-info-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-info-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-containedSuccess": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-success-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-success-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-success-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-containedPrimary": {
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              padding: "4px 8px",
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              padding: "4px 0px",
              background: "var(--mui-palette-primary-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              padding: "4px 0px",
              background: "#B3C9FF",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              padding: "4px 0px",
              background: "var(--mui-palette-primary-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-containedInherit": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "#F5F5F5",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-containedInherit (white)": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "#E0E0E0",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "#F5F5F5",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-containedSecondary": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-secondary-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-secondary-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-secondary-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-containedError": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-error-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-error-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-error-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-containedWarning": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-warning-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-warning-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-warning-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-containedInfo": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-info-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-info-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-info-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-containedSuccess": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-success-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "var(--mui-palette-success-main)",
              boxShadow: "var(--mui-shadows-6)",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "var(--mui-palette-action-disabledBackground)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-success-dark)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-outlinedPrimary": {
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              padding: "12px 8px",
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
              color: "var(--mui-palette-action-disabled)",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Lato, Helvetica, Arial, sans-serif",
              fontSize: "1.125rem",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "22px /* 122.222% */",
              textTransform: "none",
              display: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              padding: "12px 0px",
              border: "1px solid var(--mui-palette-primary-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              padding: "12px 0px",
              border: "1px solid var(--mui-palette-primary-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              padding: "12px 0px",
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-outlinedInherit": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-text-primary)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-text-primary)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-text-primary)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-outlinedInherit (white)": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-common-white-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-common-white-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-common-white-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-outlinedSecondary": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-secondary-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-secondary-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-secondary-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-outlinedError": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-error-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-error-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-error-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-outlinedWarning": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-warning-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-warning-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-warning-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-outlinedInfo": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-info-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-info-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-info-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-outlinedSuccess": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-success-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-success-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-success-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-outlinedPrimary": {
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              padding: "8px",
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
              color: "var(--mui-palette-action-disabled)",
              fontFamily: "Lato, Helvetica, Arial, sans-serif",
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "20px /* 125% */",
              textTransform: "none",
              display: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              padding: "8px 0px",
              border: "1px solid var(--mui-palette-primary-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              padding: "8px 0px",
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              padding: "8px 0px",
              border: "1px solid var(--mui-palette-primary-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-outlinedInherit": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-text-primary)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-text-primary)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-text-primary)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-outlinedInherit (white)": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-common-white-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-common-white-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-common-white-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-outlinedSecondary": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-secondary-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-secondary-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-secondary-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-outlinedError": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-error-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-error-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-error-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-outlinedWarning": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-warning-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-warning-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-warning-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-outlinedInfo": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-info-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-info-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-info-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-outlinedSuccess": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-success-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-success-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-success-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-outlinedPrimary": {
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              padding: "4px 8px",
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              padding: "4px 0px",
              border: "1px solid var(--mui-palette-primary-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              padding: "4px 0px",
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              padding: "4px 0px",
              border: "1px solid var(--mui-palette-primary-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-outlinedInherit": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-text-primary)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-text-primary)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-text-primary)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-outlinedInherit (white)": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-common-white-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-common-white-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-common-white-main)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-outlinedSecondary": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-secondary-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-secondary-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-secondary-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-outlinedError": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-error-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-error-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-error-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-outlinedWarning": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-warning-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-warning-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-warning-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-outlinedInfo": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-info-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-info-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-info-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-outlinedSuccess": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-success-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              border: "1px solid var(--mui-palette-success-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              border: "1px solid var(--mui-palette-action-disabledBackground)",
              background: "#F1F1F1",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              border: "1px solid var(--mui-palette-success-outlinedBorder)",
              background: "var(--mui-palette-common-white-main)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-textPrimary": {
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              padding: "8px",
              background: "none",
              boxShadow: "none",
              color: "var(--mui-palette-action-disabled)",
              fontFamily: "Lato, Helvetica, Arial, sans-serif",
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "20px /* 125% */",
              textTransform: "none",
              display: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              padding: "8px 0px",
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              padding: "8px 0px",
              background: "var(--mui-palette-primary-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              padding: "8px 0px",
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-textInherit": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-action-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-textInherit (white)": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-action-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-textSecondary": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-secondary-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-textError": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-error-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-textWarning": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-warning-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-textInfo": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-info-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeMedium.MuiButton-textSuccess": {
            padding: "8px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-success-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-textPrimary": {
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              padding: "12px 8px",
              background: "none",
              boxShadow: "none",
              color: "var(--mui-palette-action-disabled)",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Lato, Helvetica, Arial, sans-serif",
              fontSize: "1.125rem",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "22px /* 122.222% */",
              textTransform: "none",
              display: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              padding: "12px 0px",
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              padding: "12px 0px",
              background: "var(--mui-palette-primary-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              padding: "12px 0px",
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-textInherit": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-action-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-textInherit (white)": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-action-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-textSecondary": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-secondary-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-textError": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-error-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-textWarning": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-warning-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-textInfo": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-info-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeLarge.MuiButton-textSuccess": {
            padding: "12px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-success-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-textPrimary": {
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              padding: "4px 8px",
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              padding: "4px 0px",
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              padding: "4px 0px",
              background: "var(--mui-palette-primary-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              padding: "4px 0px",
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-textInherit": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-action-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-textInherit (white)": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-action-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-textSecondary": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-secondary-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-textError": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-error-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-textWarning": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-warning-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-textInfo": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-info-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
          "&.MuiButton-sizeSmall.MuiButton-textSuccess": {
            padding: "4px 0px",
            borderRadius: "var(--mui-shape-border-radius-lg-24)",
            opacity: "1",
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              background: "none",
              boxShadow: "none",
              "& .MuiTouchRipple-root": {
                display: "none",
              },
            },
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "var(--mui-palette-success-hover)",
              boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.20);",
            },
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "none",
              boxShadow: "none",
            },
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "&.MuiSwitch-sizeMedium:has(.MuiSwitch-colorDefault)": {
            padding: "12px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                width: "34px",
                height: "14px",
                borderRadius: "100px",
                background: "var(--mui-palette-components-switch-slideFill)",
                padding: "0",
                opacity: "1",
                boxShadow: "none",
                transform: "translateX(0px) translateY(0px)",
              },
            },
          },
          "&.MuiSwitch-sizeMedium:has(.MuiSwitch-colorPrimary)": {
            padding: "12px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                opacity: "1",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeMedium:has(.MuiSwitch-colorError)": {
            padding: "12px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                opacity: "1",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeMedium:has(.MuiSwitch-colorWarning)": {
            padding: "12px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                opacity: "1",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeMedium:has(.MuiSwitch-colorInfo)": {
            padding: "12px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                opacity: "1",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeMedium:has(.MuiSwitch-colorSuccess)": {
            padding: "12px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                opacity: "1",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "34px",
                    height: "14px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeMedium:has(.MuiSwitch-colorSecondary)": {
            padding: "12px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                width: "34px",
                height: "14px",
                borderRadius: "100px",
                padding: "0",
                opacity: "1",
                boxShadow: "none",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:has(.Mui-checked):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border: "5px solid var(--mui-palette-primary-main)",
                    background: "var(--mui-palette-primary-main)",
                  },
                },
              },
            "&:has(.Mui-checked):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border: "5px solid var(--mui-palette-primary-main)",
                    background: "var(--mui-palette-primary-main)",
                  },
                },
              },
            "&:has(.Mui-checked):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border: "5px solid var(--mui-palette-primary-main)",
                    background: "var(--mui-palette-primary-main)",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border:
                      "5px solid var(--mui-palette-components-switch-slideFill)",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border:
                      "5px solid var(--mui-palette-components-switch-slideFill)",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border:
                      "5px solid var(--mui-palette-components-switch-slideFill)",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeSmall:has(.MuiSwitch-colorDefault)": {
            padding: "7px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                width: "26px",
                height: "10px",
                borderRadius: "100px",
                background: "var(--mui-palette-components-switch-slideFill)",
                padding: "0",
                opacity: "1",
                boxShadow: "none",
                transform: "translateX(0px) translateY(0px)",
              },
            },
          },
          "&.MuiSwitch-sizeSmall:has(.MuiSwitch-colorPrimary)": {
            padding: "7px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                opacity: "1",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeSmall:has(.MuiSwitch-colorError)": {
            padding: "7px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                opacity: "1",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeSmall:has(.MuiSwitch-colorWarning)": {
            padding: "7px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                opacity: "1",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeSmall:has(.MuiSwitch-colorInfo)": {
            padding: "7px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                opacity: "1",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeSmall:has(.MuiSwitch-colorSuccess)": {
            padding: "7px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                opacity: "1",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    width: "26px",
                    height: "10px",
                    borderRadius: "100px",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                    padding: "0",
                    boxShadow: "none",
                  },
                },
              },
          },
          "&.MuiSwitch-sizeSmall:has(.MuiSwitch-colorSecondary)": {
            padding: "7px",
            "& .MuiSwitch-switchBase": {
              "& + .MuiSwitch-track": {
                width: "26px",
                height: "10px",
                borderRadius: "100px",
                padding: "0",
                opacity: "1",
                boxShadow: "none",
                transform: "translateX(0px) translateY(0px)",
              },
            },
            "&:has(.Mui-checked):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border: "5px solid var(--mui-palette-primary-main)",
                    background: "var(--mui-palette-primary-main)",
                  },
                },
              },
            "&:has(.Mui-checked):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border: "5px solid var(--mui-palette-primary-main)",
                    background: "var(--mui-palette-primary-main)",
                  },
                },
              },
            "&:has(.Mui-checked):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border: "5px solid var(--mui-palette-primary-main)",
                    background: "var(--mui-palette-primary-main)",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border:
                      "5px solid var(--mui-palette-components-switch-slideFill)",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible)):hover":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border:
                      "5px solid var(--mui-palette-components-switch-slideFill)",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                  },
                },
              },
            "&:not(:has(.Mui-checked)):not(:has(.Mui-disabled)):has(.Mui-focusVisible)":
              {
                "& .MuiSwitch-switchBase": {
                  "& + .MuiSwitch-track": {
                    border:
                      "5px solid var(--mui-palette-components-switch-slideFill)",
                    background:
                      "var(--mui-palette-components-switch-slideFill)",
                  },
                },
              },
          },
        },
      },
    },
  },
};
