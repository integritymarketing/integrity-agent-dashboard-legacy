import PropTypes from "prop-types";
import InboundMessage from "./InboundMessage";
import OutboundMessage from "./OutboundMessage";
import FreeFormMessage from "./FreeFormMessage";
import { convertAndFormatUTCDateToLocalDate } from "utils/dates";

const MessageCard = ({ smsType, data }) => {
    const { formattedDate, formattedTime } = convertAndFormatUTCDateToLocalDate(data.createdDateTime);
    if (!data.isFreeForm) {
        return (
            <FreeFormMessage
                formattedDate={formattedDate}
                formattedTime={formattedTime}
                hasViewed={data.hasViewed}
                campaignLogId={data?.campaignLogId}
                smsContent={data.smsContent}
            />
        );
    }
    switch (smsType) {
        case "outbound":
            return (
                <OutboundMessage
                    formattedDate={formattedDate}
                    formattedTime={formattedTime}
                    smsContent={data.smsContent}
                />
            );
        case "inbound":
            return (
                <InboundMessage
                    formattedDate={formattedDate}
                    formattedTime={formattedTime}
                    smsContent={data.smsContent}
                    hasViewed={data.hasViewed}
                />
            );
        default:
            return null;
    }
};

MessageCard.propTypes = {
    smsType: PropTypes.string.isRequired,
    data: PropTypes.shape({
        createdDateTime: PropTypes.string.isRequired,
        smsContent: PropTypes.string,
        hasViewed: PropTypes.bool,
        isFreeForm: PropTypes.bool,
        campaignLogId: PropTypes.string,
    }).isRequired,
};

export default MessageCard;