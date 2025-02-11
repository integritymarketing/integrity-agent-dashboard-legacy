import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import { useNavigate } from "react-router-dom";
import { formatDate, sortListByDate, convertToLocalDateTime } from "utils/dates";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import WithLoader from "components/ui/WithLoader";
import StageSelect from "pages/contacts/contactRecordInfo/StageSelect";
import PrimaryContactPhone from "pages/contacts/PrimaryContactPhone";
import { useClientServiceContext } from "services/clientServiceProvider";

import "./style.scss";

const PlanEnrollCard = ({ callData, refreshData }) => {
    const navigate = useNavigate();

    const leadFullName = `${callData?.firstName} ${callData?.lastName}`;

    const phonesData = callData?.phones?.filter((phone) => {
        return phone?.leadPhone && phone?.leadPhone !== "" ? phone : null;
    });

    const leadPhone = phonesData?.[0]?.leadPhone || null;
    const leadEmail = callData?.emails.length > 0 ? callData?.emails?.[0]?.leadEmail : null;
    const addresses = callData?.addresses || null;

    const isPrimary = callData?.primaryCommunication || null;

    const getDateTime = () => {
        const localDateTime = convertToLocalDateTime(callData?.createDate);
        const date = formatDate(localDateTime, "MM/dd/yyyy");
        const time = formatDate(localDateTime, "h:mm a").toLowerCase();
        return { date, time };
    };

    const handleEmailClick = () => {
        window.location.href = `mailto:${leadEmail}`;
    };

    return (
        <div className="plan-enroll-card">
            <Box className="plan-name-info" width={"20%"}>
                <div className="plan-name">{leadFullName}</div>
                {leadEmail && isPrimary === "email" && (
                    <div className="plan-phone" onClick={handleEmailClick}>
                        {leadEmail}
                    </div>
                )}
                {leadPhone && isPrimary === "phone" && (
                    <div className="plan-phone">
                        <PrimaryContactPhone
                            countyFips={addresses?.[0]?.countyFips}
                            postalCode={addresses?.[0]?.postalCode}
                            phone={leadPhone}
                            leadsId={callData?.leadsId}
                        />
                    </div>
                )}
            </Box>
            <Box className="plan-name-info">
                <div className="plan-date-label">Date Requested</div>
                <div className="plan-date">
                    {getDateTime()?.date} <span className="plan-date-span">at</span> {getDateTime()?.time}{" "}
                </div>
            </Box>
            <Box className="plan-name-info">
                <div className="plan-stage">
                    <div className="plan-stage-text">Stage</div>
                    <div className="plan-stage-select">
                        <StageSelect
                            initialValue={callData?.statusName}
                            originalData={callData}
                            refreshData={() => refreshData(callData?.leadsId)}
                        />
                    </div>
                </div>
            </Box>
            <Box className="plan-name-info">
                <Button
                    icon={<Person color="#ffffff" />}
                    label={"View Contact"}
                    className={"plan-card-link-btn"}
                    onClick={() => navigate(`/contact/${callData?.leadsId}`)}
                    type="tertiary"
                    iconPosition="right"
                />
            </Box>
        </div>
    );
};

const PlanEnrollLeads = ({ dateRange }) => {
    const [page, setPage] = useState(1);
    const { clientsService } = useClientServiceContext();
    const [totalPageSize, setTotalPageSize] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [planEnrollData, setPlanEnrollData] = useState([]);

    const showToast = useToast();

    const showMore = page < totalPageSize;

    useEffect(() => {
        getPlanEnrollData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, dateRange]);

    const getPlanEnrollData = async () => {
        if (planEnrollData?.length === 0) {
            setIsLoading(true);
        }
        const stage = [33];

        try {
            const response = await clientsService.getDashboardData(
                "createDate:desc",
                page,
                5,
                null,
                false,
                null,
                null,
                null,
                stage,
                null,
                dateRange,
                "planenroll"
            );

            if (page > 1) {
                setPlanEnrollData([...planEnrollData, ...response.result]);
            } else {
                setPlanEnrollData([...response.result]);
            }
            setTotalPageSize(response?.pageResult?.totalPages);
        } catch (err) {
            Sentry.captureException(err);
            showToast({
                type: "error",
                message: "Failed to load data",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = (id) => {
        if (id) {
            const list = planEnrollData?.filter((data) => data.leadsId !== id);
            setPlanEnrollData([...list]);
        }
    };

    const sortedTasks = sortListByDate(planEnrollData, "createDate", false);

    return (
        <WithLoader isLoading={isLoading}>
            <div className="plan-card-container">
                {sortedTasks?.length > 0 &&
                    sortedTasks?.map((data) => {
                        return <PlanEnrollCard callData={data} refreshData={refreshData} />;
                    })}
            </div>
            {showMore && (
                <div className="jumpList-card">
                    <Button
                        type="tertiary"
                        onClick={() => setPage(page + 1)}
                        label="Show More"
                        className="jumpList-btn"
                    />
                </div>
            )}
        </WithLoader>
    );
};

export default PlanEnrollLeads;
