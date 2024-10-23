import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import { dateFormatter } from "utils/dateFormatter";
import { formatPhoneNumber } from "utils/phones";
import IconWithText from "packages/IconWithText";
import DownloadCallRecording from "packages/DownloadCallRecording";
import InboundCall from "components/icons/activities/InboundCall";
import Link from "images/link-svg.svg";
import { convertUTCDateToLocalDate } from "utils/dates";
import { callDuration } from "utils/dates";

const StyledTableCell = styled(TableCell)(() => ({
    "&:hover": {
        cursor: "pointer",
    },
}));

export default function FixedRow({ unAssosiatedCallRecord, onSelect }) {
    const navigate = useNavigate();

    const { callLogId, from, callStartTime, recordingStartTime, callEndTime } = unAssosiatedCallRecord;

    const date = convertUTCDateToLocalDate(callStartTime);

    const goTolinkToContact = () => {
        let duration = callDuration(recordingStartTime, callEndTime);

        const queryParams = new URLSearchParams({
            id: callLogId,
            phoneNumber: from,
            duration: duration,
            date: date,
        }).toString();

        navigate(`/link-to-contact?${queryParams}`);
    };

    const isIncommingCall = unAssosiatedCallRecord.callStatus === "in-progress";

    return (
        <>
            <TableCell>
                <Typography color="#434A51" fontSize="16px">
                    {dateFormatter(date, "MM/DD/yyyy")}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography noWrap fontWeight="bold" fontSize="16px" color="#0052CE">
                    <strong>{formatPhoneNumber(from, true)}</strong>
                </Typography>
            </TableCell>
            <TableCell onClick={() => onSelect(unAssosiatedCallRecord)}>
                {<IconWithText text={isIncommingCall ? "Incoming Call" : "Inbound Call"} icon={<InboundCall />} />}
            </TableCell>
            <StyledTableCell onClick={() => goTolinkToContact()}>
                {<IconWithText text="Link to Contact" icon={<img src={Link} alt="Link to Contact" />} />}
            </StyledTableCell>
            <StyledTableCell>{<DownloadCallRecording url={unAssosiatedCallRecord.url} />}</StyledTableCell>
            <TableCell></TableCell>
        </>
    );
}
