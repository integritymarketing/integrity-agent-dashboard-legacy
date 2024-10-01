import * as Sentry from "@sentry/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";
import { useRecoilState } from "recoil";
import { welcomeModalOpenAtom, welcomeModalTempOpenAtom } from "recoil/agent/atoms";
import showMobileAppDeepLinking from "utilities/mobileDeepLinking";

import { greetings } from "utils/greetings";

import useAgentInformationByID from "hooks/useAgentInformationByID";
import useDeviceInfo, { DEVICES } from "hooks/useDeviceInfo";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import SupportLinksCard from "components/SupportLinksCard";

import PlanSnapShot from "components/PolicySnapShot";
import TaskList from "components/TaskList";
import Arrow from "components/icons/down";
import Info from "components/icons/info-blue";
import Popover from "components/ui/Popover";
import WithLoader from "components/ui/WithLoader";

import AgentWelcomeDialog from "partials/agent-welcome-dialog";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import stageSummaryContext from "contexts/stageSummary";

import { useClientServiceContext } from "services/clientServiceProvider";
import { useAgentPreferences } from "providers/AgentPreferencesProvider/AgentPreferencesProvider";
import DashboardActivityTable from "./DashboardActivityTable";
import Afternoon from "./afternoon.svg";
import Evening from "./evening.svg";
import "./index.scss";
import Morning from "./morning.svg";
import { ContactsListProvider } from "pages/ContactsList/providers/ContactsListProvider";

function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const PAGESIZE = 10;

export default function Dashbaord() {
    const navigate = useNavigate();
    const showToast = useToast();
    const device = useDeviceInfo();
    const userProfile = useUserProfile();
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activityData, setActivityData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPageSize, setTotalPageSize] = useState(1);
    const [selectedFilterValues, setSelectedFilterValues] = useState([]);
    const [sort, setSort] = useState("Activities.CreateDate:desc");
    const [isClientSnapshotOpen, setClientSnapshotOpen] = useState(true);

    const [welcomeModalOpen, setWelcomeModalOpen] = useRecoilState(welcomeModalOpenAtom);
    const [, setWelcomeModalTempOpen] = useRecoilState(welcomeModalTempOpenAtom);

    const { stageSummary, loadStageSummary } = useContext(stageSummaryContext);
    const { trackAgentPreferencesEvents } = useAgentPreferences();
    const { clientsService } = useClientServiceContext();

    const { agentInformation } = useAgentInformationByID();
    const leadPreference = agentInformation?.leadPreference;
    const agentID = agentInformation?.agentID;

    useEffect(() => {
        trackAgentPreferencesEvents();
    }, [trackAgentPreferencesEvents]);

    useEffect(() => {
        const performAsyncTask = async () => {
            if (device === DEVICES.IPHONE) {
                await showMobileAppDeepLinking();
            }
        };

        setTimeout(() => {
            performAsyncTask();
        }, 100);
    }, [device]);

    useEffect(() => {
        loadActivityData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, page, selectedFilterValues]);

    const showMore = useMemo(() => {
        return page < totalPageSize;
    }, [page, totalPageSize]);

    useEffect(() => {
        const loadAsyncData = async () => {
            await loadStageSummary();
        };
        loadAsyncData();
        // ensure this only runs once.. adding a dependency w/ the stage summary data causes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadActivityData = async () => {
        if (activityData?.length === 0) {
            setIsLoading(true);
        }
        try {
            const response = await clientsService.getDashboardData(sort, page, PAGESIZE, selectedFilterValues, false);
            if (page > 1) {
                setActivityData([...activityData, ...response.result]);
            } else {
                setActivityData([...response.result]);
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

    const navigateToContactListPage = (id) => {
        const filters = [
            {
                sectionId: "stage",
                selectedFilterOption: id,
                isFilterSelectOpen: false,
            },
        ];
        localStorage.setItem("contactList_selectedFilterSections", JSON.stringify(filters));

        navigate(`/contacts/list`);
    };

    const handleConfirm = async () => {
        try {
            const payload = {
                agentId: agentID || userProfile?.agentId,
                leadPreference: {
                    ...leadPreference,
                    isAgentMobilePopUpDismissed: true,
                },
            };
            await clientsService.updateAgentPreferences(payload);
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to update the Preferences.",
                time: 10000,
            });
            Sentry.captureException(error);
        } finally {
            setWelcomeModalOpen(false);
        }
    };

    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <Helmet>
                <title>Integrity - Dashboard</title>
            </Helmet>
            <GlobalNav page="dashboard" />
            <WithLoader isLoading={isLoading}>
                <div className="dashbaord-page">
                    <section className="details-section">
                        <div className="greeting">
                            <img
                                src={
                                    greetings() === "Evening"
                                        ? Evening
                                        : greetings() === "Morning"
                                        ? Morning
                                        : Afternoon
                                }
                                alt="Greeting"
                            />
                            <div className="greet-user">
                                <div className="greet-session">Good {greetings()},</div>
                                <div className="greet-name">{userProfile.firstName}</div>
                            </div>

                            <div className="confirmed-applications-wrapper">
                                <div className="snapshot-wrapper">
                                    <div className="title">
                                        <div className="titleText">
                                            <div
                                                className={`arrowIcon ${isClientSnapshotOpen ? "iconReverse" : ""}`}
                                                onClick={() => {
                                                    setClientSnapshotOpen(!isClientSnapshotOpen);
                                                }}
                                            >
                                                <Arrow color={"#0052CE"} />
                                            </div>
                                            Client Snapshot{" "}
                                        </div>
                                        <Popover
                                            openOn="hover"
                                            icon={<Info />}
                                            title={"Client Snapshot"}
                                            description="Client Snapshot shows the number of contacts that are in each stage for Integrity only."
                                            positions={["right", "bottom"]}
                                        >
                                            <Info />
                                        </Popover>
                                    </div>
                                    {isClientSnapshotOpen && (
                                        <div className="snapshot-data">
                                            {stageSummary &&
                                                stageSummary.map((d, index) => (
                                                    <div
                                                        className={`snapshot-item ${index > 0 ? "brTop" : ""}`}
                                                        onClick={() => navigateToContactListPage(d.leadStatusId)}
                                                        key={index}
                                                    >
                                                        <Box display="flex" alignItems="center" gap="10px">
                                                            <span
                                                                className="dot"
                                                                style={{ backgroundColor: d.hexValue }}
                                                            ></span>
                                                            <Box>{d.statusName}</Box>
                                                        </Box>
                                                        <div className="snapshot-count">
                                                            {numberWithCommas(d.totalCount)}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isMobile && (
                            <Box
                                sx={{
                                    marginTop: "304px",
                                    width: "85%",
                                    marginLeft: "8%",
                                }}
                            >
                                <SupportLinksCard position="column" />
                            </Box>
                        )}
                    </section>

                    <section className={`recent-activity-section ${isClientSnapshotOpen ? "mt-400" : ""}`}>
                        <TaskList isMobile={isMobile} npn={userProfile?.npn} />
                        <ContactsListProvider>
                            <PlanSnapShot isMobile={isMobile} npn={userProfile?.npn} />
                        </ContactsListProvider>
                        <DashboardActivityTable
                            realoadActivityData={loadActivityData}
                            activityData={activityData}
                            setPage={setPage}
                            page={page}
                            showMore={showMore}
                            setSelectedFilterValues={setSelectedFilterValues}
                            selectedFilterValues={selectedFilterValues}
                            setSort={(value) => {
                                setSort(value);
                                setPage(1);
                            }}
                            sort={sort}
                        />
                        {isMobile && (
                            <Box>
                                <SupportLinksCard />
                            </Box>
                        )}
                    </section>
                </div>

                <AgentWelcomeDialog
                    open={welcomeModalOpen}
                    handleConfirm={handleConfirm}
                    close={() => {
                        setWelcomeModalOpen(false);
                        setWelcomeModalTempOpen(true);
                    }}
                />
            </WithLoader>
            <GlobalFooter />
        </>
    );
}
