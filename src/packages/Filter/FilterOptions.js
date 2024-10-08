import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import FooterButtons from "packages/FooterButtons";
import CheckMark from "packages/ContactListFilterOptions/CheckMarkIcon/CheckMark";

export default function FilterOptions({ values, onApply, multiSelect = true, onReset, showOnlyFilterIcon }) {
    const [updatedValues, setUpdatedValues] = useState([]);

    useEffect(() => {
        if (values) {
            const parsedValues = JSON.parse(JSON.stringify(values));
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
        onReset();
    };

    const handleApply = () => {
        onApply(updatedValues);
    };

    const checkDisabled = () => {
        return updatedValues.filter((r) => r.selected).length === 0;
    };

    const BUTTONS = {
        reset: {
            text: "Reset",
            onClick: handleReset,
            disabled: false,
        },
        apply: {
            text: "Apply",
            onClick: handleApply,
            disabled: checkDisabled(),
        },
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "white",
                    borderRadius: 3,
                    marginTop: "18px",
                }}
            >
                {updatedValues.map((row, i) => {
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
                            onClick={(event) => handleListItemClick(event, i)}
                            key={row.name + i}
                        >
                            <div style={{ display: "flex", padding: "0 8px" }}>
                                <ActivitySubjectWithIcon
                                    activitySubject={row.name}
                                    showOnlyFilterIcon={showOnlyFilterIcon}
                                    iconURL={row?.icon}
                                />

                                <Typography
                                    sx={{
                                        color: "#434A51",
                                        fontSize: "16px",
                                        marginLeft: "18px",
                                    }}
                                    variant={"subtitle1"}
                                >
                                    {row.name}
                                </Typography>
                            </div>
                            <CheckMark show={row.selected} />
                        </Box>
                    );
                })}
            </Box>
            <FooterButtons buttonOne={BUTTONS.reset} buttonTwo={BUTTONS.apply} />
        </>
    );
}
