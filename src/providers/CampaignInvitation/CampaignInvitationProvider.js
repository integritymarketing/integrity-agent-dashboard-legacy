import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const CampaignInvitationContext = createContext();

export const CampaignInvitationProvider = ({ children }) => {
    const [invitationSendType, setInvitationSendType] = useState("email");
    const [filteredContactsType, setFilteredContactsType] = useState("all my contacts");
    const [filteredContentStatus, setFilteredContentStatus] = useState("Product is Active");
    const [filteredCount, setFilteredCount] = useState(null);
    const [totalContactsCount, setTotalContactsCount] = useState(0);

    const [invitationName, setInvitationName] = useState("");
    const [invitationTemplateImage, setInvitationTemplateImage] = useState(null);

    const handleInvitationName = (name) => {
        setInvitationName(name);
    };

    const handleInvitationTemplateImage = (image) => {
        setInvitationTemplateImage(image);
    };

    const handleInvitationSendType = (type) => {
        setInvitationSendType(type);
    };

    const handleTotalContactsCount = (count) => {
        setTotalContactsCount(count);
    };

    const handleFilteredContactsTypeChange = (type) => {
        setFilteredContactsType(type);
        if (type === "Filter my contacts") {
            setFilteredContentStatus("Product is Active");
            setFilteredCount(20);
        } else {
            setFilteredContentStatus("All Contacts");
            setFilteredCount(null);
        }
    };

    const handleSendInvitation = () => {
        // Send invitation logic
    };

    const handleCancel = () => {
        // Cancel invitation logic
    };

    return (
        <CampaignInvitationContext.Provider value={getContextValue()}>{children}</CampaignInvitationContext.Provider>
    );

    function getContextValue() {
        return {
            invitationSendType,
            filteredContactsType,
            filteredContentStatus,
            filteredCount,
            totalContactsCount,
            handleInvitationSendType,
            handleFilteredContactsTypeChange,
            handleTotalContactsCount,
            handleInvitationName,
            handleInvitationTemplateImage,
            invitationName,
            invitationTemplateImage,
            handleSendInvitation,
            handleCancel,
        };
    }
};

CampaignInvitationProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
