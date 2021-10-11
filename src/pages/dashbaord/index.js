import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import Media from "react-media";
import * as Sentry from "@sentry/react";
import moment from 'moment';
import GlobalNav from "partials/global-nav-v2";
import clientService from "services/clientsService";
import Info from "components/icons/info-blue";
import Modal from "components/ui/modal";
import { Select } from "components/ui/Select";
import LastUpdatedIcon from "components/icons/last-updated";
import WithLoader from "components/ui/WithLoader";
import { greetings } from "utils/greetings";
import AuthContext from "contexts/auth";
import useToast from "hooks/useToast";
import ContactInfo from "partials/contact-info";
import { DASHBOARD_SORT_OPTIONS } from "../../constants";
import ActivityTable from "./ActivityTable";
import Help from "./Help";
import "./index.scss";
import Morning from "./morning.svg";
import Afternoon from "./afternoon.svg";
import Evening from "./evening.svg";
import LearningCenter from "./learning-center.png";
import ContactSupport from "./contact-support.png";

const ActionButton = ({ row, onClick }) => {
  return (
    <button className="action-button" onClick={() => onClick(row)}>
      View Contact
    </button>
  );
};

function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const useHelpButtonWithModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const testId = "header-support-modal";

  return [
    () => {
      setModalOpen(true);
    },
    () => (
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        labeledById="dialog_help_label"
        descById="dialog_help_desc"
        testId={testId}
      >
        <ContactInfo testId={testId} />
      </Modal>
    ),
  ];
};

export default function Dashbaord() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [snapshotData, setSnapshotData] = useState([]);
  const [activityData, setActivityData] = useState({
    pageResult: {
      total: 0,
      pageSize: 10,
    },
    result: [],
  });
  const [user, setUser] = useState({});
  const [sortByRange, setSortByRange] = useState("current-year-to-date");

  const addToast = useToast();
  const auth = useContext(AuthContext);
  const [openHelpModal, HelpButtonModal] = useHelpButtonWithModal();

  useEffect(() => {
    const getData = async () => {
      const user = await auth.getUser();
      setUser(user.profile);
    };
    getData();
  }, [auth]);

  const onLoadMore = async () => {
    const pageSize = activityData?.pageResult?.pageSize;
    const nextPage =
      1 + Math.floor((activityData?.result?.length ?? 0) / pageSize);
    const response = await clientService.getList(nextPage, pageSize, "Activities.CreateDate:desc");
    setActivityData((data) => {
      return {
        ...response,
        result: [...data.result, ...response.result],
      };
    });
  };

  useEffect(() => {
    const getDashboardData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          clientService.getDashbaordSummary().then(setSnapshotData),
          clientService.getApplicationCount(sortByRange).then(setDashboardData),
          onLoadMore(),
        ]);
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
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast, sortByRange]);

  const headers = [
    {
      title: "Contact",
      cell: ({ row }) => (
        <span>
          {row.firstName} {row.lastName}
        </span>
      ),
      className: "contact",
    },
    {
      title: "Activity",
      className: "activity",
      accessor: "activities.0.activitySubject",
    },
    {
      title: "Last Updated",
      className: "updated",
      cell: ({ row }) => (
          <>
          {row?.activities?.length > 0 &&
            <span>
          <LastUpdatedIcon />
          &nbsp;
          {moment((row?.activities || [])[0]?.createDate).format("MM/DD")}
          </span>
        }
        </>
      ),
    },
    {
      title: "Action",
      className: "action",
      cell: ({ row }) => <ActionButton row={row} onClick={handleViewContact} />,
    },
  ];

  const handleLearningCenter = () => {
    history.push(`/learning-center`);
  };

  const handleViewContact = (row) => {
    history.push(`/contact/${row?.leadsId}`);
  };

  const handleSortDateRange = (value) => {
    if (value !== sortByRange) {
      setSortByRange(value);
      clientService.getApplicationCount(value).then(setDashboardData);
    }
  }

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
      <GlobalNav />
      <HelpButtonModal />
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
            </div>
            <div className="greet-user">
              <div className="greet-session">Good {greetings()},</div>
              <div className="greet-name">{user.firstName}</div>
            </div>
            <div className="confirmed-applications-wrapper">
              <div className="wrapper-body">
                <div className="header-text">Confirmed Applications*</div>
                <div className="application-count">
                  {dashboardData?.applicationCount} Applied
                </div>
                <div className={"application-sort"}>
                  <Select
                    initialValue={DASHBOARD_SORT_OPTIONS[0].value}
                    onChange={handleSortDateRange}
                    options={DASHBOARD_SORT_OPTIONS}
                    prefix="Range: "
                    showValueAlways={true}
                  />
                </div>
              </div>
            </div>
            <div className="application-form-text">
              Includes applications from MedicareCenter, Medicare App, and
              Medicare Link.
            </div>
            <div className="snapshot-wrapper">
              <div className="title">
                Client Snapshot&nbsp;&nbsp;
                <Info />
              </div>

              <div className="snapshot-data">
                {snapshotData.map((d) => (
                  <div className="snapshot-item">
                    <div className="snapshot-name">{d.statusName}</div>
                    <div className="snapshot-count">
                      {numberWithCommas(d.totalCount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {!isMobile && 
            <>
            <div className="resources">Resources</div>
            <Help
              icon={LearningCenter}
              text="For the lastest resources and news from Integrity visit the"
              labelName="Learning Center"
              handleClick={handleLearningCenter}
            />
            <Help
              icon={ContactSupport}
              text="For a professional assistance"
              labelName="Contact Support"
              handleClick={openHelpModal}
            />
            </>
            }
          </section>
          <section className="recent-activity-section">
            <ActivityTable
              caption="Recent Activty"
              rows={activityData?.result}
              headers={headers}
              totalRecords={activityData?.pageResult?.total ?? 0}
              onLoadMore={onLoadMore}
            />
            {isMobile && 
            <>
            <div className="resources">Resources</div>
            <Help
              icon={LearningCenter}
              text="For the lastest resources and news from Integrity visit the"
              labelName="Learning Center"
              handleClick={handleLearningCenter}
            />
            <Help
              icon={ContactSupport}
              text="For a professional assistance"
              labelName="Contact Support"
              handleClick={openHelpModal}
            />
            </>
            }
          </section>
        </div>
      </WithLoader>
    </>
  );
}
