import { styled } from "@mui/system";

export const StyledWrapper = styled("div")`
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;
`;

export const StyledHeaderContainer = styled("header")({
    backgroundColor: "#FFFFFF",
    height: "168px",
    width: "100%",
    padding: "1rem 5rem",
    fontSize: "20px",
});

export const StyledHeaderTitle = styled("h1")({
    margin: 0,
    padding: 0,
    width: "70%",
    color: "#052A63",
    fontSize: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
});

export const StyledPlanDetailsWrapper = styled("div")`
    background: #f1f1f1;
`;

export const StyledCTA = styled("div")`
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 5px;

    ${({ disabled }) =>
        disabled &&
        `
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  `}
`;

export const StyledPlanOptionsFilter = styled("div")`
    background: #ffffff;
    width: 100%;
    padding: 24px;
    border-radius: 8px;
`;

export const StyledCheckFilter = styled("div")`
    border-top: 1px solid #dddddd;
    padding: 26px 0;
    display: flex;
    align-items: center;
`;
export const H2Header = styled("header")`
    font-size: 24px;
    color: #052a63;
`;
export const H4HeaderBold = styled("header")`
    font-size: 16px;
    font-weight: bold;
    margin: 8px 0;
    color: #052a63;
`;
