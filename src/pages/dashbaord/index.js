import React, { useEffect, useState, useContext, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import Media from "react-media";
import * as Sentry from "@sentry/react";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import clientService from "services/clientsService";
import Info from "components/icons/info-blue";
import Popover from "components/ui/Popover";
import WithLoader from "components/ui/WithLoader";
import { greetings } from "utils/greetings";
import AuthContext from "contexts/auth";
import useToast from "hooks/useToast";
import stageSummaryContext from "contexts/stageSummary";
import "./index.scss";
import Morning from "./morning.svg";
import Afternoon from "./afternoon.svg";
import Evening from "./evening.svg";

import DashboardActivityTable from "./DashboardActivityTable";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import AgentWelcomeDialog from "partials/agent-welcome-dialog";
import { welcomeModalOpenAtom } from "recoil/agent/atoms";
import { useRecoilState } from "recoil";
import FooterBanners from "packages/FooterBanners";
import PlanSnapShot from "components/PolicySnapShot";

function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const PAGESIZE = 10;

export default function Dashbaord() {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const addToast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [user, setUser] = useState({});
  const [page, setPage] = useState(1);
  const [totalPageSize, setTotalPageSize] = useState(1);
  const [filterValues, setFilterValues] = useState([]);
  const [fullResults, setFullResults] = useState([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState([]);
  const [sort, setSort] = useState("Activities.CreateDate:desc");

  const [welcomeModalOpen, setWelcomeModalOpen] =
    useRecoilState(welcomeModalOpenAtom);
  const { stageSummaryData, loadStageSummaryData } =
    useContext(stageSummaryContext);
  const {
    agentInfomration: { leadPreference, agentID },
  } = useAgentInformationByID();

  useEffect(() => {
    const loadAsyncData = async () => {
      try {
        const user = await auth.getUser();
        setUser(user.profile);
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    loadAsyncData();
  }, [auth, leadPreference]);

  useEffect(() => {
    const getFullData = async () => {
      const response = await clientService.getDashboardData(
        "Activities.CreateDate:desc",
        null,
        null,
        null,
        true
      );
      setFullResults(response.result);
      getFilterValues(response.result);
    };
    getFullData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadActivityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, page, selectedFilterValues]);

  const showMore = useMemo(() => {
    return page < totalPageSize;
  }, [page, totalPageSize]);

  useEffect(() => {
    const loadAsyncData = async () => {
      await loadStageSummaryData();
    };
    loadAsyncData();
    // ensure this only runs once.. adding a dependency w/ the stage summary data causes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadActivityData = async () => {
    let returnAll = false;
    if (activityData?.length === 0) {
      setIsLoading(true);
    }
    try {
      const response = await clientService.getDashboardData(
        sort,
        page,
        PAGESIZE,
        selectedFilterValues,
        returnAll
      );
      if (page > 1) {
        setActivityData([...activityData, ...response.result]);
      } else {
        setActivityData([...response.result]);
      }
      setTotalPageSize(response?.pageResult?.totalPages);
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to load data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFilterValues = (values) => {
    const allValues = (values || [])
      .filter((row) => {
        return row.activities && row.activities.length > 0;
      })
      .map((row) => {
        return row.activities[0]?.activitySubject;
      });

    let returnData = [...new Set(allValues)].map((name) => {
      return {
        name,
        selected: false,
      };
    });
    let sortedData = returnData?.sort((a, b) =>
      a?.name?.localeCompare(b?.name)
    );
    setFilterValues([...sortedData]);
  };

  const navigateToContactListPage = (id) => {
    history.push(`/contacts/list?Stage=${id}`);
  };

  const handleConfirm = async () => {
    try {
      const payload = {
        agentId: agentID,
        leadPreference: {
          ...leadPreference,
          isAgentMobilePopUpDismissed: true,
        },
      };
      await clientService.updateAgentPreferences(payload);
    } catch (error) {
      addToast({
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
                <div className="greet-name">{user.firstName}</div>
              </div>

              <div className="confirmed-applications-wrapper">
                <div className="snapshot-wrapper">
                  <div className="title">
                    <div className="titleText"> Client Snapshot </div>
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
                  <div className="snapshot-data">
                    {stageSummaryData &&
                      stageSummaryData.map((d, index) => (
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
                </div>
              </div>
            </div>

            {!isMobile && <FooterBanners className="banners" type="column" />}
          </section>

          <section className="recent-activity-section">
            <PlanSnapShot isMobile={isMobile} />
            <PlanSnapShot isMobile={isMobile} />

            <DashboardActivityTable
              realoadActivityData={loadActivityData}
              activityData={activityData}
              setPage={setPage}
              page={page}
              showMore={showMore}
              setSelectedFilterValues={setSelectedFilterValues}
              selectedFilterValues={selectedFilterValues}
              fullResults={fullResults}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
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
          }}
        />
      </WithLoader>
      <GlobalFooter />
    </>
  );
}
