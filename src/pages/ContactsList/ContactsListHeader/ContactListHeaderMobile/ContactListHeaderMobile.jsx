import { memo } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";

import AddWhite from "components/icons/version-2/AddWhite";
import ImportBlue from "components/icons/version-2/ImportBlue";
import LeftCircleBlue from "components/icons/version-2/LeftCircleBlue";
import Container from "components/ui/container";

import styles from "./styles.module.scss";

function ContactListHeaderMobile() {
    const navigate = useNavigate();
    const shouldShowBackButton = history.length !== 1; // history.length === 1 meaning a new tab

    return (
        <>
            <Container className={styles.header}>
                {shouldShowBackButton && (
                    <Box className={styles.backButton}>
                        <Box className={styles.linkWhite} onClick={() => navigate(-1)}>
                            <LeftCircleBlue />
                            <Box>Back</Box>
                        </Box>
                    </Box>
                )}
                <Box className={styles.title}>Contacts</Box>
            </Container>
            <Box className={styles.lowerContainer}>
                <Box className={styles.linkWhite} onClick={() => navigate("/client-import")}>
                    <Box>Import</Box>
                    <ImportBlue />
                </Box>
                <Box className={styles.linkBlue} onClick={() => navigate("/contact/add-new")}>
                    <Box>Add New</Box>
                    <AddWhite />
                </Box>
            </Box>
        </>
    );
}

export default memo(ContactListHeaderMobile);
