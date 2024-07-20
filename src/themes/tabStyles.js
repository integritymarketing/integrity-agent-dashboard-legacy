const tabStyles = {
  MuiTab: {
    styleOverrides: {
      root: {
        color: "var(--Integrity-Theme-Integrity-gray-dark-4)",
        textTransform: "capitalize",
        minHeight: "0px",
        fontWeight: 700,
        fontSize: "16px",
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        overflow: "visible",
        "& .MuiTabs-scroller": {
          overflow: "visible !important",
          borderBottom: "2px solid #CCCCCC",
        },
      },
      indicator: {
        bottom: "-2px",
        overflow: "visible",
        height: "4px",        
      },
    },
  },
};

export default tabStyles;
