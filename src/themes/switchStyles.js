const switchStyles = {
  MuiSwitch: {
    variants: [
      {
        props: { variant: "availability" },
        style: {
          width: 48,
          height: 26,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 2,
            transitionDuration: "300ms",
            "&.Mui-checked": {
              transform: "translateX(22px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: "#4178FF",
                opacity: 1,
                border: 0,
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
              },
              "& .MuiSwitch-thumb:before": {
                backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g id="Group_8881" data-name="Group 8881" transform="translate(-4131 197)"><g id="toggle" transform="translate(4131 -197)" fill="%23fff"><path d="M 12 23 C 9.061790466308594 23 6.299449920654297 21.85580062866211 4.221819877624512 19.77817916870117 C 2.144200086593628 17.7005500793457 1 14.93820953369141 1 12 C 1 9.061790466308594 2.144200086593628 6.299449920654297 4.221819877624512 4.221819877624512 C 6.299449920654297 2.144200086593628 9.061790466308594 1 12 1 C 14.93820953369141 1 17.7005500793457 2.144200086593628 19.77817916870117 4.221819877624512 C 21.85580062866211 6.299449920654297 23 9.061790466308594 23 12 C 23 14.93820953369141 21.85580062866211 17.7005500793457 19.77817916870117 19.77817916870117 C 17.7005500793457 21.85580062866211 14.93820953369141 23 12 23 Z" stroke="none"/><path d="M 12 2 C 6.485979080200195 2 2 6.485979080200195 2 12 C 2 17.51401901245117 6.485979080200195 22 12 22 C 17.51401901245117 22 22 17.51401901245117 22 12 C 22 6.485979080200195 17.51401901245117 2 12 2 M 12 0 C 18.62742042541504 0 24 5.372579574584961 24 12 C 24 18.62742042541504 18.62742042541504 24 12 24 C 5.372579574584961 24 0 18.62742042541504 0 12 C 0 5.372579574584961 5.372579574584961 0 12 0 Z" stroke="none" fill="current"/></g><path id="Path_22061" data-name="Path 22061" d="M.054,8.41l3.014,3.58L8.3,6l1.663-1.9" transform="translate(4138.5 -192.5)" fill="none" stroke="%234178ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/></g></svg>')`,
              },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              color: "#33cf4d",
              border: "6px solid #fff",
            },
            "& .MuiSwitch-thumb": {
              backgroundColor: "#fff",
              "&:before": {
                content: "''",
                position: "absolute",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g id="Group_8882" data-name="Group 8882" transform="translate(-4243 199)"><g id="toggle" transform="translate(4243 -199)" fill="%23fff"><path d="M 12 23 C 9.061790466308594 23 6.299449920654297 21.85580062866211 4.221819877624512 19.77817916870117 C 2.144200086593628 17.7005500793457 1 14.93820953369141 1 12 C 1 9.061790466308594 2.144200086593628 6.299449920654297 4.221819877624512 4.221819877624512 C 6.299449920654297 2.144200086593628 9.061790466308594 1 12 1 C 14.93820953369141 1 17.7005500793457 2.144200086593628 19.77817916870117 4.221819877624512 C 21.85580062866211 6.299449920654297 23 9.061790466308594 23 12 C 23 14.93820953369141 21.85580062866211 17.7005500793457 19.77817916870117 19.77817916870117 C 17.7005500793457 21.85580062866211 14.93820953369141 23 12 23 Z" stroke="none"/><path d="M 12 2 C 6.485979080200195 2 2 6.485979080200195 2 12 C 2 17.51401901245117 6.485979080200195 22 12 22 C 17.51401901245117 22 22 17.51401901245117 22 12 C 22 6.485979080200195 17.51401901245117 2 12 2 M 12 0 C 18.62742042541504 0 24 5.372579574584961 24 12 C 24 18.62742042541504 18.62742042541504 24 12 24 C 5.372579574584961 24 0 18.62742042541504 0 12 C 0 5.372579574584961 5.372579574584961 0 12 0 Z" stroke="none" fill="current"/></g><path id="Path_22062" data-name="Path 22062" d="M.5,8h9" transform="translate(4250 -194.5)" fill="none" stroke="%237188a8" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/></g></svg>')`,
              },
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: "#fff",
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: 0.3,
              cursor: "not-allowed",
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 22,
            height: 22,
          },
          "& .MuiSwitch-track": {
            borderRadius: 26 / 2,
            backgroundColor: "#7188A8",
            opacity: 1,
          },
        },
      },
    ],
  },
};

export default switchStyles;
