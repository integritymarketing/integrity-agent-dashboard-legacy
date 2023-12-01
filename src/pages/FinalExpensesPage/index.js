import React, { useState } from "react";
import GlobalNav from "partials/global-nav-v2";
import { useParams } from "react-router-dom";
import NewBackButton from "images/new-back-btn.svg";
import { Button } from "components/ui/Button";
import ContactDetailsForm from "./Components/ContactDetailsForm";
import Media from "react-media";
import {
  StyledContactDetailsWrapper,
  StyledHeaderContainer,
  StyledHeaderTitle,
  StyledWrapper,
} from "./Components/StyledComponents";

function FinalExpensesPage() {
  const { contactId } = useParams();
  const [isMobile, setIsMobile] = useState(false);

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
        <Button
          icon={
            <img
              src={NewBackButton}
              alt="Back"
              style={{ marginRight: "5px" }}
            />
          }
          label={!isMobile && "Back to Contact"}
          onClick={() => {
            window.location = `/contact/${contactId}/overview`;
          }}
          type="tertiary"
          style={{
            color: "#4178FF",
            position: "absolute",
            left: isMobile ? "5%" : "15%",
          }}
        />
        <StyledHeaderTitle>Contact Details</StyledHeaderTitle>
      </StyledHeaderContainer>

      <StyledContactDetailsWrapper>
        <ContactDetailsForm />
      </StyledContactDetailsWrapper>
    </StyledWrapper>
  );
}

export default FinalExpensesPage;
