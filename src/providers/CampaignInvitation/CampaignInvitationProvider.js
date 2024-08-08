import { createContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import useFetchTableData from "pages/ContactsList/hooks/useFetchTableData";

export const CampaignInvitationContext = createContext();

export const CampaignInvitationProvider = ({ children }) => {
    const [invitationSendType, setInvitationSendType] = useState("email");
    const [filteredContactsType, setFilteredContactsType] = useState("all my contacts");
    const [filteredContentStatus, setFilteredContentStatus] = useState("All Contacts");
    const [filteredCount, setFilteredCount] = useState(null);
    const [totalContactsCount, setTotalContactsCount] = useState(0);
    const [leadIdsList, setLeadIdsList] = useState([]);

    const [invitationName, setInvitationName] = useState("");
    const [invitationTemplateImage, setInvitationTemplateImage] = useState(null);

    const handleSummaryBarInfo = (total, result, label) => {
        setFilteredCount(result ? result?.length : 0);
        setFilteredContentStatus(label);
    };

    const handleInvitationName = (name) => {
        setInvitationName(name);
    };

    const handleInvitationTemplateImage = (image) => {
        setInvitationTemplateImage(image);
    };

    const handleInvitationSendType = (type) => {
        setInvitationSendType(type);
    };

    const handleFilteredContactsTypeChange = (type) => {
        setFilteredContactsType(type);
        if (type === "Filter my contacts") {
            setFilteredContentStatus("");
        } else {
            setFilteredContentStatus("All Contacts");
            setFilteredCount(null);
        }
    };

    const { fetchTableDataWithoutFilters } = useFetchTableData();

    const fetchAllListCount = useCallback(async () => {
        if (!totalContactsCount) {
            const response = await fetchTableDataWithoutFilters({
                pageIndex: 1,
                pageSize: 12,
                searchString: null,
                sort: ["createDate:desc"],
            });
            setTotalContactsCount(response?.total);
            setLeadIdsList(response?.leadIdsList);
        }
    }, [totalContactsCount, fetchTableDataWithoutFilters]);

    useEffect(() => {
        fetchAllListCount();
    }, [fetchAllListCount]);

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
            handleInvitationName,
            handleInvitationTemplateImage,
            invitationName,
            invitationTemplateImage,
            handleSendInvitation,
            handleCancel,
            handleSummaryBarInfo,
            leadIdsList,
        };
    }
};

CampaignInvitationProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
