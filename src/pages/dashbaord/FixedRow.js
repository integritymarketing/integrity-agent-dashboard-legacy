import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import { dateFormatter } from "utils/dateFormatter";
import { formatPhoneNumber } from "utils/phones";
import IconWithText from "packages/IconWithText";
import DownloadCallRecording from "packages/DownloadCallRecording";
import InboundCall from "components/icons/activities/InboundCall";
import LinkToContact from "components/icons/LinkToContact";

const StyledTableCell = styled(TableCell)(() => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

export default function FixedRow({ callRecordings = [] }) {
  const history = useHistory();

  const inProgressRecord = useMemo(
    () => callRecordings.find((record) => record.callStatus === "in-progress"),
    [callRecordings]
  );

  const goTolinkToContact = () => {
    history.push("/link-to-contact");
  };

  return inProgressRecord ? (
    <>
      <TableCell>
        <Typography color="#434A51" fontSize="16px">
          {dateFormatter(inProgressRecord.callStartTime, "MM/DD")}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap fontWeight="bold" fontSize="16px" color="#0052CE">
          <strong>{formatPhoneNumber(inProgressRecord.from, true)}</strong>
        </Typography>
      </TableCell>
      <TableCell>
        {<IconWithText text="Inbound call" icon={<InboundCall />} />}
      </TableCell>
      <StyledTableCell onClick={goTolinkToContact}>
        {<IconWithText text="Link To Contact" icon={<LinkToContact />} />}
      </StyledTableCell>
      <StyledTableCell>
        {<DownloadCallRecording url={inProgressRecord.url} />}
      </StyledTableCell>
      <TableCell></TableCell>
    </>
  ) : null;
}
