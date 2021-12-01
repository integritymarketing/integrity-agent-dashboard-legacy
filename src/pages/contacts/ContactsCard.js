import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import clientsService from "services/clientsService";
import Container from "components/ui/container";
import Pagination from "components/ui/Pagination/pagination";
import Card from "components/ui/card";
import PhoneIcon from "images/call-icon.svg";
import NavIcon from "images/nav-icon.svg";
import StageStatusContext from "contexts/stageStatus";
import ContactContext from "contexts/contacts";
import Spinner from "components/ui/Spinner/index";
import StageSelect from "./contactRecordInfo/StageSelect";
import { getPrimaryContact } from "utils/primaryContact";
import { formatAddress } from "utils/address";
import { ShortReminder } from "./contactRecordInfo/reminder/Reminder";
import analyticsService from "services/analyticsService";
import styles from "./ContactsPage.module.scss";
import More from "components/icons/more";
import ActionsDropdown from "components/ui/ActionsDropdown";
import { MORE_ACTIONS, PLAN_ACTION } from "../../utils/moreActions";

const useClientCardInfo = (client) => {
  const { firstName, middleName, lastName, statusName } = client;
  const primaryContact = getPrimaryContact(client);
  const displayName = useMemo(() => {
    const namedClient = firstName || lastName;
    const displayName = namedClient
      ? `${firstName} ${middleName || ""} ${lastName}`.trim()
      : "--";
    return displayName;
  }, [firstName, lastName, middleName]);

  return {
    displayName,
    stage: statusName,
    nextReminder: "mm/yy",
    reminders: client.reminders,
    primaryContact,
  };
};

const ActionIcon = ({ icon }) => {
  return (
    <div data-gtm="mobile-card-view-phone-button" className={styles.iconCircle}>
      <img src={icon} alt="phone" />
    </div>
  );
};

const getMapUrl = () => {
  if (
    navigator.platform.indexOf("iPhone") !== -1 ||
    navigator.platform.indexOf("iPod") !== -1 ||
    navigator.platform.indexOf("iPad") !== -1
  ) {
    return "maps://maps.google.com/maps";
  } else {
    return "https://maps.google.com/maps";
  }
};

const ClientCard = ({ client, onRefresh }) => {
  const { statusOptions } = useContext(StageStatusContext);
  const { setNewSoaContactDetails } = useContext(ContactContext);
  const history = useHistory();
  const { displayName, stage, reminders, primaryContact } = useClientCardInfo(
    client
  );

  const [showAddModal, setShowAddModal] = useState(null);
  const [showAddNewModal, setShowAddNewModal] = useState(false);

  const navigateToPage = (leadId, page) => {
    history.push(`/${page}/${leadId}`);
  };
  const handleDropdownActions = (contact) => (value, leadId) => {
    switch (value) {
      case "addnewreminder":
        setShowAddModal(leadId);
        setShowAddNewModal(true);
        break;
      case "new-soa":
      case "plans":
        if (value === "new-soa") {
          setNewSoaContactDetails(contact);
        }
        navigateToPage(leadId, value);
        break;
      case "contact":
        navigateToPage(leadId, value);
        break;
      default:
        break;
    }
  };

  const options = MORE_ACTIONS.slice(0);
  if (
    client?.addresses[0]?.postalCode &&
    client?.addresses[0]?.county &&
    client?.addresses[0]?.stateCode
  ) {
    options.splice(1, 0, PLAN_ACTION);
  }

  return (
    <Card data-gtm="card-view-contact-card">
      <div>
        <div className={styles.cardHeader}>
          <div
            className={`pt-1 pb-1 hdg hdg--4 text-truncate ${
              styles.contactName
            } ${displayName !== "--" ? "" : "text-muted"}`}
          >
            {displayName === "--" ? (
              "--"
            ) : (
              <>
                <Link
                  to={`/contact/${client.leadsId}`}
                  className={styles.viewLink}
                >
                  {displayName}
                </Link>
                {client.leadSource === "Import" && (
                  <div className={`${styles.visualIndicator} ${styles.mt10}`}>
                    MARKETING LEAD
                  </div>
                )}
              </>
            )}
          </div>
          <div className={styles.hideOnMobile}>
            <ActionsDropdown
              className={styles["more-icon"]}
              options={options}
              id={client.leadsId}
              onClick={handleDropdownActions(client)}
            >
              <More />
            </ActionsDropdown>
          </div>
          <div className={styles.mobileStage}>
            <span
              style={{
                background: statusOptions?.find((st) => st.value === stage)
                  ?.color[0].bg,
                color: statusOptions?.find((st) => st.value === stage)?.color[0]
                  .color,
                fontWeight: "bold",
              }}
            >
              {stage}
            </span>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.cardInfo}>
          <div className={styles.hideOnMobile}>
            <label
              className={styles.cardInfoLabel}
              htmlFor={`stage-${client.leadsId}`}
            >
              Stage
            </label>
            <StageSelect
              id={`stage-${client.leadsId}`}
              value={stage}
              original={client}
            />
          </div>
          <div className={styles.reminder}>
            <label
              className={styles.cardInfoLabel}
              htmlFor={`reminder-${client.leadsId}`}
            >
              <span className={styles.hideOnMobile}>Reminder</span>
            </label>
            <ShortReminder
              leadId={client.leadsId}
              className={styles.shortReminder}
              reminders={reminders || []}
              onRefresh={onRefresh}
              isCardView={true}
              showAddModal={showAddModal === client.leadsId}
              setShowAddModal={(value) => {
                setShowAddModal(value ? client.leadsId : null);
                if (!value) {
                  setShowAddNewModal(false);
                }
              }}
              showAddNewModal={showAddNewModal}
            />
          </div>
        </div>
        <div className={styles.hideOnMobile}>
          <div className={styles.primaryContactHeader}>Primary Contact</div>
          <div className={styles.primaryContactInfo}>{primaryContact}</div>
        </div>
        <div className={styles.mobileActions}>
          {client.phones.length !== 0 && (
            <a href={`tel:${client.phones[0].leadPhone}`}>
              <ActionIcon icon={PhoneIcon} />
            </a>
          )}
          {client.addresses.length !== 0 && (
            <a
              data-gtm="mobile-card-view-location-button"
              href={`${getMapUrl()}?q=${formatAddress(client.addresses[0])}`}
            >
              <img src={NavIcon} alt="map" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

function ContactsCard({ searchString, sort }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [applyFilters, setApplyFilters] = useState({});
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const stages = queryParams.get("Stage");
    const contactRecordType = queryParams.get("ContactRecordType");
    const hasReminder = queryParams.get("HasReminder");
    const applyFilters = {
      contactRecordType,
      hasReminder,
      stages: stages ? stages.split(",") : [],
    };
    setApplyFilters(applyFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const {
    contactRecordType = "",
    stages = [],
    hasReminder = false,
  } = applyFilters;

  const fetchData = useCallback(
    ({
      pageSize,
      pageIndex,
      searchString,
      sort,
      contactRecordType,
      stages,
      hasReminder,
    }) => {
      setLoading(true);
      clientsService
        .getList(
          pageIndex,
          pageSize,
          sort,
          null,
          searchString || null,
          contactRecordType,
          stages,
          hasReminder
        )
        .then((list) => {
          setData(
            list.result.map((res) => ({
              ...res,
            }))
          );
          setPageCount(list.pageResult.totalPages);
          setTotalResults(list.pageResult.total);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    []
  );

  const handleRefresh = () => {
    fetchData({
      pageSize,
      pageIndex: currentPage,
      searchString,
      sort,
    });
  };

  useEffect(() => {
    if (window.innerWidth <= 480) {
      analyticsService.fireEvent("event-content-load", {
        pagePath: "/mobile-card-view/",
      });
    } else {
      analyticsService.fireEvent("event-content-load", {
        pagePath: "/card-view/",
      });
    }
    fetchData({
      pageSize,
      pageIndex: currentPage,
      searchString,
      sort,
      contactRecordType,
      stages,
      hasReminder,
    });
  }, [
    currentPage,
    fetchData,
    searchString,
    sort,
    contactRecordType,
    stages,
    hasReminder,
  ]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className="mt-scale-1 pl-0 pr-0">
      {data.length === 0 && (
        <div className="pt-5 pb-4 text-center">
          <div className="hdg hdg--2 mb-1">No Results</div>
          <p className="text-body">
            Adjust your search criteria to see more results
          </p>
        </div>
      )}
      <div className="card-grid mb-5 pt-1">
        {data.map((client, idx) => {
          return (
            <ClientCard
              key={client.leadsId}
              client={client}
              onRefresh={handleRefresh}
            />
          );
        })}
      </div>
      {data.length > 0 && (
        <Pagination
          contactsCardPage
          currentPage={currentPage}
          totalPages={pageCount}
          totalResults={totalResults}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </Container>
  );
}

export default ContactsCard;
