import { Box, Typography } from "@mui/material";

import useUserProfile from "hooks/useUserProfile";

import ProfilePicture from "../ProfilePicture";
import styles from "./styles.module.scss";

const ProfileNameAndProfile = ({ withBackGround = false }) => {
    const { npn, firstName, lastName } = useUserProfile();

    return (
        <Box
            className={styles.header}
            sx={{
                backgroundColor: withBackGround ? "#edecec" : "",
                fontSize: "20px",
                fontWeight: 500,
                color: withBackGround ? "#052a63" : "",
            }}
        >
            <ProfilePicture />
            <Box marginLeft="8px">
                <Box>
                    <Typography variant="h4">
                        {firstName} {lastName}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex" }}>
                    <Box>
                        <Typography>NPN: </Typography>
                    </Box>
                    <Box marginLeft="2px">
                        <Typography variant="body1"> {npn}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ProfileNameAndProfile;
