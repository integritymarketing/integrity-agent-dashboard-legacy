const newAlertStyles = {
  standardWarning: {
    color: "#F56600",
    background: "#FCF2E8",
  },
  standardError: {
    color: "#434A51",
    background: "#FBDEDE",
    borderRadius: "8px",
  },
  standardInfo: {
    color: "#1D3E71",
    background: "#F1FAFF",
  },
  standardSuccess: {
    background: "#E5FAEB",
    color: "#009E15",
  },
};

const alertStyles = {
  MuiAlert: {
    styleOverrides: {
      ...newAlertStyles,
    },
  },
};

export default alertStyles;
