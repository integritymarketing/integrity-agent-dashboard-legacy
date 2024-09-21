const dialogStyles = {
    MuiDialog: {
        styleOverrides: {
            root: {
                backgroundColor: "rgba(5, 42, 99, 0.4)",
                "& .MuiBackdrop-root": {
                    backgroundColor: "transparent",
                },
                "& .MuiDialog-paper": {
                    borderRadius: "8px",
                    boxShadow: "none",
                },
            },
        },
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                backgroundColor: "var(--Integrity-Theme-primitive-white)",
                color: "var(--Integrity-Theme-Integrity-navy-default)",
                fontWeight: 400,
            },
        },
    },
};

export default dialogStyles;
