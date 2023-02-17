import React from "react";
import { styled } from "@mui/material";
import Box from "@mui/material/Box";

const StyledBox = styled(Box)({});
StyledBox.defaultProps = {
  borderRadius: 0,
  bgcolor: "#F4F8FB",
  boxShadow: "0",
  border: ".5px solid lightgrey",
};

export default function Container(props) {
  return <StyledBox {...props} />;
}
