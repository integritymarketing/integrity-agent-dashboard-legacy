import React, { useState, useEffect } from "react";
import moment from "moment";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "utils/phones";
import { formatDate } from "utils/dates";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import WithLoader from "components/ui/WithLoader";
import StageSelect from "pages/contacts/contactRecordInfo/StageSelect";
import "./style.scss";
import clientsService from "services/clientsService";

const PlanEnrollCard = ({ callData, refreshData }) => {
    const navigate = useNavigate();

    const leadFullName = `${callData?.firstName} ${callData?.lastName}`;

    const phonesData = callData?.phones?.filter((phone) => {
        return phone?.leadPhone && phone?.leadPhone !== "" ? phone : null;
    });

    const leadPhone = phonesData?.[0]?.leadPhone || null;
    const leadEmail = callData?.emails.length > 0 ? callData?.emails?.[0]?.leadEmail : null;

    const isPrimary = callData?.contactPreferences?.primary || null;

    const getDateTime = () => {
        const date = formatDate(callData?.createDate, "MM/dd/yyyy");
        const time = formatDate(callData?.createDate, "h:mm a").toLowerCase();
        return { date, time };
    };

    const primaryContact =
        isPrimary === "email" && leadEmail ? leadEmail : leadPhone ? formatPhoneNumber(leadPhone) : leadEmail;
    
    const handleContactClick = () => {
        if (leadEmail && isPrimary === "email") {
            window.location.href = `mailto:${leadEmail}`;
        } else if (leadPhone) {
            window.location.href = `tel:${leadPhone}`;
        }
    }

    return (
        <div className="plan-card">
            <Grid
                xs={6}
                md={4}
                sx={{
                    width: "25%",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                }}
            >
                <div className="plan-name-info">
                    <div>
                        <p className="plan-name">{leadFullName}</p>
                        <p className="plan-phone" onClick={handleContactClick} >{primaryContact || ""}</p>
                    </div>
                </div>
            </Grid>
            <Grid
                xs={6}
                md={2}
                alignSelf={"center"}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: "20%",
                }}
            >
                <div className="plan-date-label">Date Requested</div>
                <div className="plan-date">
                    {" "}
                    {getDateTime()?.date} <span className="plan-date-span">at</span> {getDateTime()?.time}{" "}
                </div>
            </Grid>
            <Grid
                xs={6}
                md={3}
                alignSelf={"center"}
                sx={{
                    textAlign: "right",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "30%",
                }}
            >
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
            </Grid>
            <Grid
                xs={6}
                md={3}
                alignSelf={"center"}
                sx={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "center",
                    width: "20%",
                }}
            >
                <Button
                    icon={<Person color="#ffffff" />}
                    label={"View Contact"}
                    className={"plan-card-link-btn"}
                    onClick={() => navigate(`/contact/${callData?.leadsId}`)}
                    type="tertiary"
                    iconPosition="right"
                />
            </Grid>
        </div>
    );
};

const PlanEnrollLeads = ({ dateRange }) => {
    const [page, setPage] = useState(1);
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
        const stage = [12];

        try {
            const response = await clientsService.getDashboardData(
                null,
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

    const sortedTasks = planEnrollData?.sort((a, b) =>
        moment(a?.createDate, "MM/DD/YYYY HH:mm:ss").diff(moment(b?.createDate, "MM/DD/YYYY HH:mm:ss"))
    );

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
