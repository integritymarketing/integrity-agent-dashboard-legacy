import React, { useState } from "react";
import GlobalNav from "partials/global-nav-v2";
import { useParams } from "react-router-dom";
import NewBackButton from "images/new-back-btn.svg";
import { Button } from "components/ui/Button";
import Media from "react-media";
import {
  StyledPlanDetailsWrapper,
  StyledHeaderContainer,
  StyledHeaderTitle,
  StyledWrapper,
} from "./Components/StyledComponents";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import OptionsSideBar from "./Components/OptionsSideBar";

function PlanOptionsPage() {
  const { contactId } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const { leadDetails } = useContactDetails(contactId);
  const { firstName, middleName, lastName } = leadDetails;

  return (
    <StyledWrapper>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <GlobalNav />
      <StyledHeaderContainer>
        <StyledHeaderTitle>
          <Button
            icon={
              <img
                src={NewBackButton}
                alt="Back"
                style={{ marginRight: "5px" }}
              />
            }
            label={!isMobile && "Back to Contacts"}
            onClick={() => {
              window.location = `/contact/${contactId}/overview`;
            }}
            type="tertiary"
            style={{
              color: "#4178FF",
            }}
          />
          <div>{`${firstName}  ${
            middleName ? middleName + "." : ""
          } ${lastName}`}</div>
        </StyledHeaderTitle>
        <div style={{ position: "relative", top: "68px" }}>Life Policies</div>
      </StyledHeaderContainer>

      <StyledPlanDetailsWrapper>
        <OptionsSideBar contactId={contactId} />
      </StyledPlanDetailsWrapper>
    </StyledWrapper>
  );
}

export default PlanOptionsPage;
