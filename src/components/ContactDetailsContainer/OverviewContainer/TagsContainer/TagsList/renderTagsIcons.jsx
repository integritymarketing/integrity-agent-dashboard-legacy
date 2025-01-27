import TagIcon from "images/Tag.png";
import RecommendationIcon from "images/recommendation.png";
import { LifeIcon, CrossIcon, LeadCenter, PlanEnroll, DataCenter } from "../../Icons";

const renderTagsIcon = (label, itemLabel, metadata, customIconUrl) => {
    if (customIconUrl) {
        return <img alt="Custom Tag Icon" src={customIconUrl} />;
    }

    switch (label) {
        case "Products":
            if (itemLabel === "FE") {
                return <LifeIcon />;
            } else {
                return <CrossIcon />;
            }
        case "Campaigns":
            if (itemLabel === "LEADCENTER") {
                return <LeadCenter />;
            } else if (itemLabel?.includes("PE") || metadata?.includes("PlanEnroll")) {
                return <PlanEnroll />;
            } else if (itemLabel === "DATA LEAD") {
                return <DataCenter />;
            } else {
                return <img alt="TagIcon" src={TagIcon} />;
            }
        case "Ask Integrity Recommendations":
            return <img alt="RecommendationIcon" src={RecommendationIcon} />;

        default:
            return <img alt="TagIcon" src={TagIcon} />;
    }
};

export default renderTagsIcon;
