import React from "react";
import { useNavigate } from "react-router-dom";

import Help from "pages/dashbaord/Help";
import ContactSupport from "pages/dashbaord/contact-support.png";
import LearningCenter from "pages/dashbaord/learning-center.png";

import "./index.scss";

export default function ResourceSection() {
    const navigate = useNavigate();

    const handleLearningCenter = () => {
        navigate(`/learning-center`);
    };

    const navigateToHelp = () => {
        navigate(`/help`);
    };

    return (
        <div className="resource-card-wrapper">
            <Help
                icon={LearningCenter}
                text="For the latest resources and news from Integrity visit the"
                labelName="Learning Center"
                handleClick={handleLearningCenter}
            />
            <Help
                icon={ContactSupport}
                text="Need Help? Visit the help center for professional"
                labelName="Professional Assistance"
                handleClick={navigateToHelp}
            />
        </div>
    );
}
