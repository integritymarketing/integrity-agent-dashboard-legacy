import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import { Box, Avatar, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { handleCSGSSO } from "auth/handleCSGSSO";
import WithLoader from "components/ui/WithLoader";
import { useProfessionalProfileContext } from "providers/ProfessionalProfileProvider";
import useUserProfile from "hooks/useUserProfile";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { Contacts, Account, Dashboard, SignOut, MenuOpen, IntegrityHeader, Marketing, LearningCenter } from "./icons";

import PropTypes from "prop-types";

import styles from "./styles.module.scss";

const MobileMenu = ({ onClose }) => {
    const { profileInfo, fetchAgentProfileDataLoading, getAgentProfileData } = useProfessionalProfileContext();
    const { logout, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const { npn, email } = useUserProfile();
    const menuRef = useRef(null);

    const [image, setImage] = useState(null);
    const [profileImageApprovalStatus, setProfileImageApprovalStatus] = useState("");

    useEffect(() => {
        getAgentProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (profileInfo) {
            setImage(profileInfo?.profileImageUrl);
            setProfileImageApprovalStatus(profileInfo?.profileImageApprovalStatus);
        }
    }, [profileInfo]);

    useOnClickOutside(menuRef, onClose);

    const menuOptionsWithIcon = [
        {
            label: "Dashboard",
            action: () => {
                navigate("/dashboard");
                onClose();
            },
            icon: <Dashboard />,
        },
        {
            label: "Contacts",
            action: () => {
                navigate("/contacts");
                onClose();
            },
            icon: <Contacts />,
        },
        {
            label: "Marketing",
            action: () => {
                navigate("/marketing/campaign-dashboard");
                onClose();
            },
            icon: <Marketing />,
        },
        {
            label: "LearningCENTER",
            action: () => {
                navigate("/learning-center");
                onClose();
            },
            icon: <LearningCenter />,
        },
        {
            label: "Account",
            action: () => {
                window.location.href = `${process.env.REACT_APP_AUTH_PAW_REDIRECT_URI}`;
                onClose();
            },
            icon: <Account />,
        },
    ];

    const menuOptionsWithOutIcon = [
        {
            label: "Lead Center",
            action: () => {
                window.open(`${process.env.REACT_APP_AUTH0_LEADS_REDIRECT_URI}/LeadCenterSSO`, "_blank");
                onClose();
            },
        },
        {
            label: "CSG App",
            action: () => {
                getAccessTokenSilently().then((token) => {
                    handleCSGSSO(navigate, token, npn, email);
                    onClose();
                });
            },
        },
        {
            label: "Need Help?",
            action: () => {
                navigate("/help");
                onClose();
            },
        },
    ];

    const signOutOption = [
        {
            label: "Sign Out",
            action: () => {
                logout({
                    logoutParams: {
                        returnTo: window.location.origin,
                    },
                }),
                    onClose();
            },
            icon: <SignOut />,
        },
    ];

    return (
        <WithLoader isLoading={fetchAgentProfileDataLoading}>
            <Box className={styles.innerContainer}>
                <Box className={styles.closeButton}>
                    <Box onClick={onClose}>
                        <MenuOpen />
                    </Box>
                </Box>
                <Box className={styles.header}>
                    <Avatar
                        src={profileImageApprovalStatus === "Approved" ? image : null}
                        sx={{ width: "50px", height: "50px" }}
                    />
                    <Box marginLeft="8px">
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontSize: "20px",
                                    fontWeight: 500,
                                }}
                            >
                                {profileInfo?.agentFirstName} {profileInfo?.agentLastName}{" "}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex" }}>
                            <Box>
                                <Typography className={styles.npnLabel}>NPN: </Typography>
                            </Box>
                            <Box marginLeft="2px">
                                <Typography variant="body1"> {npn}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Divider className={styles.divider} />
                <Box>
                    <List>
                        {menuOptionsWithIcon?.map((option, index) => (
                            <ListItem key={index} onClick={option.action} sx={{ minWidth: "unset" }}>
                                {option.icon && (
                                    <ListItemIcon sx={{ minWidth: "unset", marginRight: "8px" }}>
                                        {option.icon}
                                    </ListItemIcon>
                                )}
                                <ListItemText primary={option.label} className={styles.menuText} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider className={styles.divider} />
                    <List>
                        {menuOptionsWithOutIcon.map((option, index) => (
                            <ListItem key={index} onClick={option.action} className={styles.menuItem}>
                                <ListItemText primary={option.label} className={styles.menuText} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider className={styles.divider} />
                    <List>
                        {signOutOption.map((option, index) => (
                            <ListItem key={index} onClick={option.action} className={styles.menuItem}>
                                {option.icon && (
                                    <ListItemIcon sx={{ minWidth: "unset", marginRight: "8px" }}>
                                        {option.icon}
                                    </ListItemIcon>
                                )}
                                <ListItemText primary={option.label} className={styles.menuText} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider className={styles.divider} />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "16px",
                            alignItems: "center",
                        }}
                    >
                        <IntegrityHeader />
                    </Box>
                </Box>
            </Box>
        </WithLoader>
    );
};

MobileMenu.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.string,
};

export default MobileMenu;
