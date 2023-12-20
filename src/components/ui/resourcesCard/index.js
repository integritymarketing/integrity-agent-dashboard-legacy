import React from "react";
import { useNavigate } from "react-router-dom";
import Help from "pages/dashbaord/Help";
import "./index.scss";
import LearningCenter from "pages/dashbaord/learning-center.png";
import ContactSupport from "pages/dashbaord/contact-support.png";

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
        text="For the latest resources and news from Integrity Clients visit the"
        labelName="Knowledge Center"
        handleClick={handleLearningCenter}
      />
      <Help
        icon={ContactSupport}
        text="Need Help? Visit the help center for 24/7 professional"
        labelName="Zendesk Assistance"
        handleClick={navigateToHelp}
      />
    </div>
  );
}
