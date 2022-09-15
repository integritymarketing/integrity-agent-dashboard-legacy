import React from "react";
import { useHistory } from "react-router-dom";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import { dateFormatter } from "utils/dateFormatter";
import { formatPhoneNumber } from "utils/phones";
import IconWithText from "packages/IconWithText";
import DownloadCallRecording from "packages/DownloadCallRecording";
import InboundCall from "components/icons/activities/InboundCall";
import Link from "images/link-svg.svg";

const StyledTableCell = styled(TableCell)(() => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

export default function FixedRow({ unAssosiatedCallRecord }) {
  const history = useHistory();

  const goTolinkToContact = (callLogId, callFrom) => {
    history.push(`/link-to-contact/${callLogId}/${callFrom}`);
  };

  const isIncommingCall = unAssosiatedCallRecord.callStatus === "in-progress";

  return (
    <>
      <TableCell>
        <Typography color="#434A51" fontSize="16px">
          {dateFormatter(unAssosiatedCallRecord.callStartTime, "MM/DD")}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap fontWeight="bold" fontSize="16px" color="#0052CE">
          <strong>
            {formatPhoneNumber(unAssosiatedCallRecord.from, true)}
          </strong>
        </Typography>
      </TableCell>
      <TableCell>
        {
          <IconWithText
            text={isIncommingCall ? "Incoming Call" : "Inbound Call"}
            icon={<InboundCall />}
          />
        }
      </TableCell>
      <StyledTableCell
        onClick={() =>
          goTolinkToContact(
            unAssosiatedCallRecord.callLogId,
            unAssosiatedCallRecord.from
          )
        }
      >
        {
          <IconWithText
            text="Link to Contact"
            icon={<img src={Link} alt="Link to Contact" />}
          />
        }
      </StyledTableCell>
      <StyledTableCell>
        {<DownloadCallRecording url={unAssosiatedCallRecord.url} />}
      </StyledTableCell>
      <TableCell></TableCell>
    </>
  );
}
