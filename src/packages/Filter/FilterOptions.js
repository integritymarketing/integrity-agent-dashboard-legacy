import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import React, { useState, useEffect } from "react";
import { List, Typography } from "@mui/material";

export default function FilterOptions({ values, onApply, multiSelect = true }) {
  const [updatedValues, setUpdatedValues] = useState([]);

  useEffect(() => {
    if (values) {
      let parsedValues = JSON.parse(JSON.stringify(values));
      setUpdatedValues(parsedValues);
      if (!multiSelect) {
        parsedValues.forEach((v) => {
          v.selected = false;
        });
      }
      setUpdatedValues(parsedValues);
    }
  }, [multiSelect, values]);

  const handleListItemClick = (event, index) => {
    let newValues;
    if (multiSelect) {
      newValues = updatedValues.slice();
    } else {
      newValues = JSON.parse(JSON.stringify(values));
      newValues.forEach((v) => {
        v.selected = false;
      });
    }
    newValues[index].selected = !newValues[index].selected;
    setUpdatedValues(newValues);
  };
  const handleReset = () => {
    onApply([]);
  };
  const handleApply = (event) => {
    onApply(updatedValues);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "white",
          mr: 3,
          ml: 3,
          borderRadius: 3,
        }}
      >
        <List sx={{ py: 0 }}>
          {updatedValues.map((row, i) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  padding: "5px",
                  cursor: "pointer",
                  justifyContent: "space-between",
                  borderBottom: "1px solid lightgrey",
                  "&:last-child": { borderBottom: "unset" },
                }}
                onClick={(event) => handleListItemClick(event, i)}
                key={row.name + i}
              >
                <div style={{ display: "flex", padding: "0 8px" }}>
                  <ActivitySubjectWithIcon activitySubject={row.name} />
                  <Typography sx={{ color: "#72777C" }} variant={"subtitle1"}>
                    {row.name}
                  </Typography>
                </div>
                {row.selected && <DoneIcon sx={{ color: "#093577" }} />}
              </Box>
            );
          })}
        </List>
      </Box>
      <Box
        sx={{
          pt: 2,
          pb: 2,
          pl: 5,
          pr: 5,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            aria-describedby={"Reset"}
            sx={{ width: "40%" }}
            variant="outlined"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            aria-describedby={"Apply"}
            sx={{ width: "40%" }}
            variant="contained"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </Box>
    </>
  );
}
