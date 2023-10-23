import { styled } from "@mui/system";

export const StyledWrapper = styled("div")`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

export const StyledContactDetailsWrapper = styled("div")`
  background: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledHeaderContainer = styled("header")({
  backgroundColor: "#FFFFFF",
  height: "100px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
});

export const StyledHeaderTitle = styled("h1")({
  margin: 0,
  padding: 0,
  color: "#052A63",
  fontSize: "32px",
});

export const StyledFormWrapper = styled("div")`
  background: white;
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 30px 68px;
  gap: 8px;
  flex-direction: column;
  margin: 20px 0;

  @media (max-width: 600px) {
    padding: 10px;
    max-width: 360px;
  }
`;

export const StyledForm = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  width: 100%;
`;

export const StyledTitle = styled("div")`
  color: #052a63;
  font-size: 32px;
`;

export const StyledDescription = styled("div")`
  color: #434a51;
  font-size: 16px;
`;

export const StyledElementName = styled("div")`
  color: #052a63;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  gap: 5px;
`;

export const StyledFormRow = styled("div")`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const StyledFormItem = styled("div")`
  width: 360px;
  @media (max-width: 600px) {
    max-width: 340px;
  }
`;

export const StyledButton = styled("div")`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4178ff;
  border-radius: 50px;
  padding: 10px 14px;
  width: 98%;
  color: white;
  margin-top: 30px;
  transition: 0.3s;
  opacity: ${({ disabled }) => disabled && "0.5"};
  cursor: ${({ disabled }) => !disabled && "pointer"};
  pointer-events: ${({ disabled }) => disabled && "none"};

  &:hover {
    width: 100%;
  }
`;

export const StyledGenderFormElements = styled("div")`
  display: flex;
  gap: 24px;
`;

export const StyledButtonFormElement = styled("div")`
  background: ${({ selected }) => (selected ? "#F1FAFF" : "#FFFFFF")};
  width: 168px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #dddddd;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #434a51;
  padding-left: 16px;
  cursor: pointer;
`;

export const StyledHeightFormContainer = styled("div")`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const StyledCaption = styled("div")`
  color: #777;
  font-size: 14px;
  white-space: noWrap;
`;

export const StyledSubText = styled("div")`
  color: #777;
  font-size: 14px;
`;

export const StyledErrorText = styled("div")`
  color: red;
  font-size: 14px;
`;

// Define styled components
export const StyledNumberInputContainer = styled("div")({
  position: "relative",
  width: "200px",
});

export const StyledNumberInputField = styled("input")({
  width: "100%",
  paddingRight: "20px",
  paddingLeft: "15px",
  height: "40px",
  border: "1px solid #c7ccd1",
  borderRadius: "4px",
  "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "-moz-appearance": "textfield",
});

export const StyledUnitSpan = styled("span")({
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#777",
});

export const StyledDatePicker = styled("div")`
  input {
    padding: 9px !important;
  }
`;
