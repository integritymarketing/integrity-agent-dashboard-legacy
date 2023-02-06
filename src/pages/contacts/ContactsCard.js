import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import clientsService from "services/clientsService";
import Container from "components/ui/container";
import Pagination from "components/ui/Pagination/pagination";
import Card from "components/ui/card";

import Spinner from "components/ui/Spinner/index";
import StageSelect from "./contactRecordInfo/StageSelect";
import { getPrimaryContact } from "utils/primaryContact";
import { ShortReminder } from "./contactRecordInfo/reminder/Reminder";
import analyticsService from "services/analyticsService";
import styles from "./ContactsPage.module.scss";
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

const ClientCard = ({ client, onRefresh }) => {
  const { displayName, stage, reminders } = useClientCardInfo(client);

  const [showAddModal, setShowAddModal] = useState(null);
  const [showAddNewModal, setShowAddNewModal] = useState(false);

  const options = MORE_ACTIONS.slice(0);
  if (
    client?.addresses[0]?.postalCode &&
    client?.addresses[0]?.county &&
    client?.addresses[0]?.stateCode
  ) {
    options.splice(1, 0, PLAN_ACTION);
  }

  return (
    <Card className={styles.cardWrapper} data-gtm="card-view-contact-card">
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
        </div>
        <div className={`${styles.reminder} ${styles.cardReminder}`}>
          <ShortReminder
            leadId={client.leadsId}
            className={styles.shortReminder}
            reminders={reminders || []}
            onRefresh={onRefresh}
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
        <div className={styles.cardInfo}>
          <div>
            <StageSelect
              id={`stage-${client.leadsId}`}
              value={stage}
              original={client}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

function ContactsCard({ searchString, sort, isMobile, layout }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [applyFilters, setApplyFilters] = useState({});
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const returnAll = useMemo(() => {
    return isMobile && layout === "card";
  }, [layout, isMobile]);

  useEffect(() => {
    const stages = queryParams.get("Stage");
    const tags = queryParams.get("Tags");
    const contactRecordType = queryParams.get("ContactRecordType");
    const hasReminder = queryParams.get("HasReminder");
    const hasOverdueReminder = queryParams.get("HasOverdueReminder");

    const applyFilters = {
      contactRecordType,
      hasReminder,
      stages: stages ? stages.split(",") : [],
      tags: tags ? tags.split(",") : [],
      hasOverdueReminder,
    };
    setApplyFilters(applyFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchData = useCallback(
    ({ pageSize, pageIndex, searchString, sort, applyFilters, returnAll }) => {
      setLoading(true);
      clientsService
        .getList(
          pageIndex,
          pageSize,
          sort,
          searchString || null,
          null,
          applyFilters?.contactRecordType,
          applyFilters?.stages,
          applyFilters?.hasReminder,
          applyFilters.hasOverdueReminder,
          applyFilters.tags,
          returnAll
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
      applyFilters,
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
      applyFilters,
      returnAll,
    });
  }, [
    currentPage,
    fetchData,
    searchString,
    sort,
    applyFilters,
    pageSize,
    returnAll,
  ]);

  const onPageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(0);
  };

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
          onResetPageSize={true}
          setPageSize={(value) => onPageSizeChange(value)}
        />
      )}
    </Container>
  );
}

export default ContactsCard;
