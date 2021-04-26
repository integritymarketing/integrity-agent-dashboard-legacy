import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import clientsService from "services/clientsService";
import ReminderIcon from "components/icons/search";
import Container from "components/ui/container";
import Textfield from "components/ui/textfield";
import Pagination from "components/ui/pagination";
import Card from "components/ui/card";
import Spinner from 'components/ui/Spinner/index';
import StageSelect from "./contactRecordInfo/StageSelect";

import styles from "./ContactsPage.module.scss";

const useClientCardInfo = (client) => {
  const { firstName, lastName, phone, email, statusName } = client;
  const displayName = useMemo(() => {
    const namedClient = firstName !== "" || lastName !== "";
    const displayName = namedClient
      ? `${firstName} ${lastName}`.trim()
      : "Unnamed Contact";
    return displayName;
  }, [firstName, lastName]);

  return {
    displayName,
    primaryContact: phone || email,
    stage: statusName,
    nextReminder: "mm/yy",
  };
};

const ClientCard = ({ client }) => {
  const {
    displayName,
    primaryContact,
    stage,
    nextReminder,
  } = useClientCardInfo(client);

  return (
    <Card>
      <div>
        <div className={styles.cardHeader}>
          <div
            className={`pt-1 pb-1 hdg hdg--4 text-truncate ${styles.contactName
              } ${displayName !== "Unnamed Contact" ? "" : "text-muted"}`}
          >
            <Link to={`/contact/${client.leadsId}`} className={styles.viewLink}>
              {displayName}
            </Link>
          </div>
          <div>
            <Link to={`/contact/${client.leadsId}`} className={styles.viewLink}>
              {" "}
              View{" "}
            </Link>
          </div>
        </div>
        <div className={styles.cardInfo}>
          <div>
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
              Reminder
            </label>
            <Textfield
              id={`reminder-${client.leadsId}`}
              defaultValue={nextReminder}
              icon={<ReminderIcon />}
              name="reminder"
              className="bar__item-small"
              readOnly
            />
          </div>
        </div>
        <div className={styles.primaryContactHeader}>Primary Contact</div>
        <div className={styles.primaryContactInfo}>{primaryContact}</div>
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
              reminderNotes: "3/15 Call on Wednesday. Email quotes out.",
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
    <Container className="mt-scale-3" style={{ paddingLeft: 0 }}>
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
            />
          );
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
