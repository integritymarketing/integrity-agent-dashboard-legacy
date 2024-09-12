import { useState } from "react";
import { Switch, Typography, IconButton, Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RemoveIcon from "@mui/icons-material/Remove";

const AdvancedModeToggle = () => {
    const [checked, setChecked] = useState(false);

    const handleToggle = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Switch
                checked={checked}
                onChange={handleToggle}
                inputProps={{ "aria-label": "Toggle advanced mode" }}
                sx={{
                    "& .MuiSwitch-switchBase": {
                        color: "#b0bec5",
                        "&.Mui-checked": {
                            color: "#ffffff",
                        },
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#6C83A6",
                    },
                    "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                        backgroundColor: "#E0E0E0",
                    },
                    "& .MuiSwitch-thumb": {
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
                        backgroundColor: "#6C83A6",
                    },
                    "& .MuiSwitch-track": {
                        borderRadius: 20 / 2,
                    },
                }}
                icon={
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: "#b0bec5",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <RemoveIcon sx={{ fontSize: 16, color: "#ffffff" }} />
                    </Box>
                }
                checkedIcon={
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: "#6C83A6",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <RemoveIcon sx={{ fontSize: 16, color: "#ffffff" }} />
                    </Box>
                }
            />

            {/* Label */}
            <Typography variant="body1" color="textPrimary">
                Advanced Mode
            </Typography>

            {/* Info Icon */}
            <IconButton size="small" aria-label="information about advanced mode" color="primary">
                <InfoOutlinedIcon />
            </IconButton>
        </Box>
    );
};

export default AdvancedModeToggle;
