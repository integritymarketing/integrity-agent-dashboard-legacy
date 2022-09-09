import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import CheckMark from "packages/ContactListFilterOptions/CheckMarkIcon/CheckMark";
import { SORT_OPTIONS } from "../../constants";

export default function SortList({ selected, setSelected }) {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 3,
        marginTop: "18px",
      }}
    >
      {SORT_OPTIONS.map((row, i) => {
        let label = row?.label.split(":");
        let labelOne = label[0];
        let labelTwo = label[1];
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "12px",
              cursor: "pointer",
              justifyContent: "space-between",
              borderBottom: "1px solid lightgrey",
              "&:last-child": { borderBottom: "unset" },
            }}
            onClick={() => {
              if (row?.value === selected) {
                setSelected("");
              } else setSelected(row?.value);
            }}
            key={row?.label + i}
          >
            <div style={{ display: "flex", padding: "0 8px" }}>
              <Typography
                sx={{ color: "#434A51", fontSize: "16px" }}
                variant={"subtitle1"}
              >
                {labelOne}:
              </Typography>
              <Typography
                sx={{ color: " #717171", fontSize: "16px", marginLeft: "10px" }}
                variant={"subtitle1"}
              >
                {labelTwo}
              </Typography>
            </div>
            <CheckMark show={selected === row?.value} />
          </Box>
        );
      })}
    </Box>
  );
}
