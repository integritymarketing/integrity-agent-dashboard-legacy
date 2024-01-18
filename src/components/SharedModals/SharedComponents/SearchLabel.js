import React from "react";
import { styled } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
const PREFIX = 'SearchLabel';

const classes = {
  searchTitle: `${PREFIX}-searchTitle`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.searchTitle}`]: {
    color: "#052A63",
    fontSize: 20,
    fontFamily: "Lato",
    letterSpacing: "0.2px",
    marginTop: 12,
  }
}));

export default function SearchLabel({ label }) {

  return (
    (<Root>
      <Typography className={classes.searchTitle}>{label}</Typography>
    </Root>)
  );
}
