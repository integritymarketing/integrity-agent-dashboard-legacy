const tableStyles = {
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: '24px 0 24px 15px',
        fontSize: '14px',
      },
      head: {
        fontSize: '16px',
        fontWeight: 600,
      },
      showMore: {
        cursor: 'pointer',
        color: 'var(--Integrity-Theme-Integrity-royal-default)',
        fontWeight: '600',
        borderBottom: 'none',
        fontSize: '16px',
      },
    },
  },
  MuiTableSortLabel: {
    styleOverrides: {
      root: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&.MuiTableRow-head:first-of-type': {
          backgroundColor: 'transparent',
          '& > *': {
            border: 0,
          },
        },
        '&:first-of-type td:first-of-type': {
          borderTopLeftRadius: '10px',
        },
        '&:first-of-type td:last-child': {
          borderTopRightRadius: '10px',
        },
        '&:last-child td:first-of-type': {
          borderBottomLeftRadius: '0px',
        },
        '&:last-child td:last-child': {
          borderBottomRightRadius: '0px',
        },
      },
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: {
        backgroundColor: 'white',
      },
    },
  },
};

export default tableStyles;
