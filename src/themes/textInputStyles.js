const textInputStyles = {
  MuiInputBase: {
    styleOverrides: {
      root: {
        "&.Mui-disabled": {
          backgroundColor: "var(--Integrity-Theme-Integrity-gray-light-1)", // Set your desired background color here
        },
      },
    },
  },
};

export default textInputStyles;
