import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";

import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import WithLoader from "components/ui/WithLoader";
import DateRangeSort from "components/DateRangeSort";
import enrollPlansService from "services/enrollPlansService";

import ErrorState from "components/ErrorState";
import NoUnlinkedPolicy from "images/no-unlinked-policies.svg";
import { TaskListCardContainer } from "../../Tasklist/TaskListCardContainer";
import usePreferences from "hooks/usePreferences";
import useToast from "hooks/useToast";

import moment from "moment";

import styles from "./PolicySnapShotMobileContainer.module.scss";
import UnlinkedPolicyMobileList from "../UnlinkedPoliciesMobileList/UnlinkedPoliciesMobileList";



export default function PolicySnapshotMobileLayout() {
    const { npn } = useParams();

    const [dRange] = usePreferences(0, "policySnapShot_sort");

    const [dateRange, setDateRange] = useState(dRange);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [policyList, setPolicyList] = useState([]);

    const WIDGET_NAME = "UnlinkedPolicies";


    const [widgetInfo, setWidgetInfo] = useState({
        count: 0,
        color: "",
    });

    // const navigate = useNavigate();
    const showToast = useToast();


    const fetchPolicySnapshotList = useCallback(
        async () => {
            setIsLoading(true);
            try {
                const items = await enrollPlansService.getPolicySnapShotList(npn, dateRange, WIDGET_NAME);
                const list = items[0]?.bookOfBusinessSummmaryRecords;
                setPolicyList(list || []);
            } catch (error) {
                setIsError(true);
                showToast({
                    type: "error",
                    message: "Failed to get Policy Snapshot List.",
                    time: 10000,
                });
            } finally {
                setIsLoading(false);
            }
        },
        [showToast, dateRange, npn,]
    );

    useEffect(() => {
        fetchPolicySnapshotList();
    }, [fetchPolicySnapshotList]);



    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const tabsData = await enrollPlansService.getPolicySnapShotCount(npn, dateRange);
                if (tabsData?.length > 0) {
                    const data = tabsData.find((tab) => tab.policyStatus === WIDGET_NAME);
                    setWidgetInfo({ count: data?.policyCount, color: data?.policyStatusColor });
                }
            } catch (error) {
                console.log("Error in fetch policy count: ", error);
                showToast({
                    type: "error",
                    message: "Failed to get Policy Snapshot Count.",
                    time: 10000,
                });
            }
        };
        fetchCounts();
    }, [showToast, dateRange, npn]);



    // const refreshData = (id) => {
    //     fetchCounts();
    //     if (id) {
    //         const list = fullList?.filter((task) => task.id !== id);
    //         setFullList([...list]);
    //     }
    // };


    const getErrorHeading = (status) => {
        switch (status) {
            case WIDGET_NAME: {
                return "There are no Unlinked Policies at this time.";
            }

            default:
                return `There is no policy information available for you at this time.`;
        }
    };

    const getIcon = (status) => {
        switch (status) {
            case WIDGET_NAME:
                return NoUnlinkedPolicy;
            default:
                return NoUnlinkedPolicy;
        }
    };

    const getMoreInfo = (status) => {
        switch (status) {
            case WIDGET_NAME: {
                return "about unlinked policies.";
            }
            default:
                return "New policies will be displayed here once they are submitted. Please contact your marketer for more information.";
        }
    };

    const getLink = (status) => {
        switch (status) {
            case WIDGET_NAME: {
                return "MedicareCENTER-Unlinked-Policies-Guide.pdf";
            }
            default:
                return null;
        }
    };


    return (
        <Box className={styles.policySnapshotMobileContainer}>
            <Helmet>
                <title>Integrity Clients - Dashboard</title>
            </Helmet>
            <GlobalNav page="taskListMobileLayout" title="Policy Snapshot" />

            <Box className={styles.mobileWidget}>
                <Box className={styles.policySnapshotColor} style={{ backgroundColor: widgetInfo?.color }}></Box>
                <Box className={styles.policySnapshotHeader}>
                    <div className={styles.policySnapshotTitle}>
                        Unlinked Policies
                    </div>
                    <div className={styles.policySnapshotCount}>{`(${widgetInfo?.count})`}</div>
                </Box>
            </Box>
            <Box className={styles.mobileDateRange}>
                <DateRangeSort
                    preferencesKey={"policySnapShot_sort"}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    page="taskListMobileLayout"
                />
            </Box>
            <TaskListCardContainer>
                {!isLoading && (isError || widgetInfo?.count === 0) ? (
                    <ErrorState
                        isError={isError}
                        emptyList={widgetInfo?.count === 0}
                        heading={getErrorHeading(WIDGET_NAME)}
                        content={getMoreInfo(WIDGET_NAME)}
                        icon={getIcon(WIDGET_NAME)}
                        link={getLink(WIDGET_NAME)}
                        iconPosition="left"
                    />
                ) : (

                    <>
                        <WithLoader isLoading={isLoading}>
                            <UnlinkedPolicyMobileList policyList={policyList} npn={npn} />
                        </WithLoader>
                    </>
                )}
            </TaskListCardContainer>

            <GlobalFooter />
        </Box >
    );
}
