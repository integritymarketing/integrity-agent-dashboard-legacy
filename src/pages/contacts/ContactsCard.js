import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from "react";
import { Link } from "react-router-dom";

import clientsService from "services/clientsService";
import Container from "components/ui/container";
import Pagination from "components/ui/pagination";
import Card from "components/ui/card";
import PhoneIcon from "images/call-icon.svg";
import NavIcon from "images/nav-icon.svg";
import StageStatusContext from "contexts/stageStatus";
import Spinner from "components/ui/Spinner/index";
import StageSelect from "./contactRecordInfo/StageSelect";
import { getPrimaryContact } from "utils/primaryContact";
import { formatPhoneNumber } from "utils/phones";

import styles from "./ContactsPage.module.scss";
import { ShortReminder } from "./contactRecordInfo/reminder/Reminder";

const useClientCardInfo = (client) => {
  const { firstName, lastName, statusName } = client;
  const displayName = useMemo(() => {
    const namedClient = firstName || lastName;
    const displayName = namedClient ? `${firstName} ${lastName}`.trim() : "--";
    return displayName;
  }, [firstName, lastName]);

  return {
    displayName,
    stage: statusName,
    nextReminder: "mm/yy",
    address: client.postalCode,
    reminders: client.reminders,
  };
};

const ActionIcon = ({ icon }) => {
  return (
    <div className={styles.iconCircle}>
      <img src={icon} alt="" />
    </div>
  );
};

const ClientCard = ({ client }) => {
  const { statusOptions } = useContext(StageStatusContext);
  const { displayName, stage, phone, address, reminders } = useClientCardInfo(
    client
  );
  const primaryContact = getPrimaryContact(client);

  return (
    <Card>
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
              <Link
                to={`/contact/${client.leadsId}`}
                className={styles.viewLink}
              >
                {displayName}
              </Link>
            )}
          </div>
          <div className={styles.hideOnMobile}>
            <Link to={`/contact/${client.leadsId}`} className={styles.viewLink}>
              {" "}
              View{" "}
            </Link>
          </div>
          <div className={styles.mobileStage}>
            <span
              style={{
                background: statusOptions?.find((st) => st.value === stage)
                  ?.color,
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
              className={styles.shortReminder}
              reminder={(reminders || [])[0]}
            />
          </div>
        </div>
        <div className={styles.hideOnMobile}>
          <div className={styles.primaryContactHeader}>Primary Contact</div>
          <div className={styles.primaryContactInfo}>{primaryContact}</div>
        </div>
        <div className={styles.mobileActions}>
          {phone && (
            <a href={`tel:${formatPhoneNumber(phone)}`}>
              <ActionIcon icon={PhoneIcon} />
            </a>
          )}
          {address && (
            <a href={`https://maps.google.com/?q=${address}`}>
              <img src={NavIcon} alt="" />
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

  const fetchData = useCallback(
    ({ pageSize, pageIndex, searchString, sort }) => {
      setLoading(true);
      clientsService
        .getList(pageIndex, pageSize, sort, null, searchString || null)
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

  useEffect(() => {
    fetchData({
      pageSize,
      pageIndex: currentPage,
      searchString,
      sort,
    });
  }, [currentPage, fetchData, searchString, sort]);

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
          return <ClientCard key={client.leadsId} client={client} />;
        })}
      </div>
      {data.length > 0 && (
        <Pagination
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
