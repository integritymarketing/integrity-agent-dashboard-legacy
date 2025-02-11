import { useState, useEffect } from "react";

import { Avatar } from "@mui/material";
import PropTypes from "prop-types";
import useUserProfile from "hooks/useUserProfile";

import { useProfessionalProfileContext } from "providers/ProfessionalProfileProvider";

const ProfilePicture = ({ bordered = false }) => {
    const { profileInfo, getAgentProfileData } = useProfessionalProfileContext();
    const { firstName, lastName } = useUserProfile();

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

    const getInitialAvatarValue = () => {
        if (!firstName && !lastName) return "";
        return (firstName[0] + lastName[0]).toUpperCase();
    };

    const initialAvatarValue = getInitialAvatarValue();

    return (
        <Avatar
            src={profileImageApprovalStatus === "Approved" ? image : null}
            sx={{
                width: "50px",
                height: "50px",
                backgroundColor: "#052a63",
                border: "1px solid #FFFFFF",
                ...(bordered && {
                    "&:hover": {
                        backgroundColor: "#375582",
                        opacity: 0.5,
                    },
                }),
            }}
        >
            {initialAvatarValue}
        </Avatar>
    );
};

ProfilePicture.propTypes = {
    bordered: PropTypes.bool,
};

export default ProfilePicture;
