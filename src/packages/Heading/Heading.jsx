import * as React from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

export default function Heading({ heading, content }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h4" sx={{ p: 2 }}>
        {heading}
      </Typography>
      <Box sx={{ p: 2, display: "flex", alignItems: "end", cursor: "pointer" }}>
        {content}
      </Box>
    </Box>
  );
}
