import React, { useEffect, useState, useContext, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Media from "react-media";
import * as Sentry from "@sentry/react";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import clientsService from "services/clientsService";
import Info from "components/icons/info-blue";
import Popover from "components/ui/Popover";
import WithLoader from "components/ui/WithLoader";
import { greetings } from "utils/greetings";
import useToast from "hooks/useToast";
import stageSummaryContext from "contexts/stageSummary";
import "./index.scss";
import Morning from "./morning.svg";
import Afternoon from "./afternoon.svg";
import Evening from "./evening.svg";
import Arrow from "components/icons/down";
import DashboardActivityTable from "./DashboardActivityTable";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import AgentWelcomeDialog from "partials/agent-welcome-dialog";
import { welcomeModalOpenAtom } from "recoil/agent/atoms";
import { useRecoilState } from "recoil";
import FooterBanners from "packages/FooterBanners";
import PlanSnapShot from "components/PolicySnapShot";
import TaskList from "components/TaskList";
import useUserProfile from "hooks/useUserProfile";
import showMobileAppDeepLinking from "utilities/mobileDeepLinking";
import useDeviceInfo, { DEVICES } from "hooks/useDeviceInfo";

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
  const [isClientSnapshotOpen, setClientSnapshotOpen] = useState(false);

  const [welcomeModalOpen, setWelcomeModalOpen] =
    useRecoilState(welcomeModalOpenAtom);

  const { stageSummary, loadStageSummary } = useContext(stageSummaryContext);

  const { agentInformation } = useAgentInformationByID();
  const leadPreference = agentInformation?.leadPreference;
  const agentID = agentInformation?.agentID;

  useEffect(() => {
    console.log("SAB TESTING 4:  DEVICE", device);
    if (device === DEVICES.IPHONE) {
      showMobileAppDeepLinking(device);
    }
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
      const response = await clientsService.getDashboardData(
        sort,
        page,
        PAGESIZE,
        selectedFilterValues,
        false
      );
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
    navigate(`/contacts/list?Stage=${id}`);
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
        <title>MedicareCENTER - Dashboard</title>
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
                      {isMobile && (
                        <div
                          className={`arrowIcon ${
                            isClientSnapshotOpen ? "iconReverse" : ""
                          }`}
                          onClick={() => {
                            setClientSnapshotOpen(!isClientSnapshotOpen);
                          }}
                        >
                          <Arrow color={"#0052CE"} />
                        </div>
                      )}
                      Client Snapshot{" "}
                    </div>
                    <Popover
                      openOn="hover"
                      icon={<Info />}
                      title={"Client Snapshot"}
                      description="Client Snapshot shows the number of contacts that are in each stage for MedicareCENTER only."
                      positions={["right", "bottom"]}
                    >
                      <Info />
                    </Popover>
                  </div>
                  {((isClientSnapshotOpen && isMobile) || !isMobile) && (
                    <div className="snapshot-data">
                      {stageSummary &&
                        stageSummary.map((d, index) => (
                          <div
                            className={`snapshot-item ${
                              index > 0 ? "brTop" : ""
                            }`}
                            onClick={() =>
                              navigateToContactListPage(d.leadStatusId)
                            }
                            key={index}
                          >
                            <div className="snapshot-name">
                              {d?.statusName?.includes("Soa")
                                ? d.statusName.replace("Soa", "SOA ")
                                : d.statusName}
                            </div>
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
              <FooterBanners className="banners mt-350" type="column" />
            )}
          </section>

          <section
            className={`recent-activity-section ${
              isMobile && isClientSnapshotOpen ? "mt-350" : ""
            }`}
          >
            <PlanSnapShot isMobile={isMobile} npn={userProfile?.npn} />
            <TaskList isMobile={isMobile} npn={userProfile?.npn} />
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
            {isMobile && <FooterBanners className="banners" type="column" />}
          </section>
        </div>
        <AgentWelcomeDialog
          open={welcomeModalOpen}
          handleConfirm={handleConfirm}
          close={() => {
            setWelcomeModalOpen(false);
            setTimeout(() => (document.body.style.overflow = "auto"), 1000);
          }}
        />
      </WithLoader>
      <GlobalFooter />
    </>
  );
}
