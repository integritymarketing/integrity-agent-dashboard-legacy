import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import clientsService from "services/clientsService";
import { ColorOptionRender } from "./../../utils/shared-utils/sharedUtility";
import { Select } from "components/ui/Select";
import ReminderIcon from "components/icons/search";
import Container from "components/ui/container";
import Textfield from "components/ui/textfield";
import Pagination from "components/ui/pagination";
import Card from "components/ui/card";
import useToast from "./../../hooks/useToast";

import styles from "./ContactsPage.module.scss";
import Spinner from './../../components/ui/Spinner/index';

const colorCodes = {
  New: "#2082F5",
  Quoted: "#EDB72C",
  Lost: "#565656",
  Enrolled: "#565656",
  Open: "Orange",
  Applied: "#65C15D",
};

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

const ClientCard = ({ client, statusOptions, onStageChange }) => {
  const {
    displayName,
    primaryContact,
    stage,
    nextReminder,
  } = useClientCardInfo(client);

  const handleChangeStatus = (val) => {
    onStageChange && onStageChange(client, val);
  };
  return (
    <Card>
      <div>
        <div className={styles.cardHeader}>
          <div
            className={`pt-1 pb-1 hdg hdg--4 text-truncate ${
              styles.contactName
            } ${displayName !== "Unnamed Contact" ? "" : "text-muted"}`}
          >
            {displayName}
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
            <Select
              id={`stage-${client.leadsId}`}
              Option={ColorOptionRender}
              initialValue={stage}
              options={statusOptions}
              onChange={handleChangeStatus}
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
  const [allStatuses, setAllStatuses] = useState([]);

  const pageSize = 12;
  const addToast = useToast();

  useEffect(() => {
    const doFetch = async () => {
      const statuses = await clientsService.getStatuses();
      setAllStatuses(statuses);
    };

    doFetch();
  }, []);

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

  const handleChangeStage = async (client, val) => {
    try {
      await clientsService.updateClient(client, {
        ...client,
        leadStatusId: allStatuses.find((status) => status.statusName === val)
          ?.leadStatusId,
      });
      fetchData({
        pageSize,
        pageIndex: currentPage,
        searchString,
        sort,
      });
      addToast({
        type: "success",
        message: "Contact successfully updated.",
        time: 3000,
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchData({
      pageSize,
      pageIndex: currentPage,
      searchString,
      sort,
    });
  }, [currentPage, fetchData,searchString,sort]);

  const statusOptions = React.useMemo(() => {
    return allStatuses.map((status) => ({
      value: status.statusName,
      label: status.statusName,
      color: status.colorCode || colorCodes[status.statusName] || "#EDB72C",
    }));
  }, [allStatuses]);

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
              statusOptions={statusOptions}
              onStageChange={handleChangeStage}
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
