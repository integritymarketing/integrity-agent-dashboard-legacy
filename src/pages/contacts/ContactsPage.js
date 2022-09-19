import React, { useCallback, useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import Media from "react-media";
import * as Sentry from "@sentry/react";
import { debounce } from "debounce";
import Import from "components/icons/import";
import Add from "components/icons/add";
import CardView from "components/icons/card-view";
import SearchIcon from "components/icons/search";
import RoundCloseIcon from "components/icons/round-close";
import TableView from "components/icons/table-view";
import Delete from "components/icons/trashbin";
import Export from "components/icons/export";
import DeleteContactsModal from "./DeleteContactsModal";
import ExportContactsModal from "./ExportContactsModal";
import { Button } from "components/ui/Button";
import Container from "components/ui/container";
import Textfield from "components/ui/textfield";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import BackNavContext from "contexts/backNavProvider";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import ContactsCard from "./ContactsCard";
import styles from "./ContactsPage.module.scss";
import clientsService from "services/clientsService";
import ContactsTable from "./ContactsTable";
import analyticsService from "services/analyticsService";
import useToast from "hooks/useToast";
import { StageStatusProvider } from "contexts/stageStatus";
import FooterBanners from "packages/FooterBanners";
import Filter from "packages/Filter/Filter";
import ContactListFilterOptions from "packages/ContactListFilterOptions";
import ContactListSort from "packages/ContactListSort";
import FilterIcon from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import ContactSort from "components/icons/contact-sort";

const listViewLayoutPath = "/contacts/list";
const cardViewLayoutPath = "/contacts/card";

const geItemFromLocalStorage = (key, initialValue) => {
  try {
    const item = window.localStorage.getItem(key);
    const val = item ? JSON.parse(item) : initialValue;
    return val;
  } catch (error) {
    Sentry.captureException(error);
    window.localStorage.removeItem(key);
    return initialValue;
  }
};

export default () => {
  const [searchString, setSearchString] = useState(null);
  const [searchStringNew, setSearchStringNew] = useState(searchString);
  const [sort, setSort] = useState(null);
  const [layout, setLayout] = useState();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const location = useLocation();
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(false);
  const [deleteCounter, setDeleteCounter] = useState(0);
  const [duplicateIds, setDuplicateLeadIds] = useState(
    geItemFromLocalStorage("duplicateLeadIds")
  );
  const [isOpenDeleteContactsIdModal, setIsOpenDeleteContactsModal] = useState(
    false
  );
  const [isOpenExportContactsIdModal, setIsOpenExportContactsModal] = useState(
    false
  );
  const [filterToggle, setFilterToggle] = useState(false);
  const [sortToggle, setSortToggle] = useState(false);
  const [filtered, setFiltered] = useState(false);

  const { setCurrentPage } = useContext(BackNavContext);
  const addToast = useToast();

  const duplicateIdsLength = duplicateIds?.length;

  useEffect(() => {
    setCurrentPage("Contacts Page");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLayout(() =>
      location.pathname === cardViewLayoutPath ? "card" : "list"
    );
    if (isMobile && location.pathname !== cardViewLayoutPath) {
      switchLayout();
    }
  }, [location, isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedSetSearchString = useCallback(
    debounce(setSearchStringNew, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearchString(searchString);
  }, [searchString, debouncedSetSearchString]);

  const switchLayout = () => {
    const switchToLayoutPath =
      layout === "list" ? cardViewLayoutPath : listViewLayoutPath;
    history.push(switchToLayoutPath);
    setLayout((layout) => (layout === "list" ? "card" : "list"));
  };

  const goToImportPage = () => {
    history.push("/client-import");
  };

  const goToAddNewContactPage = () => {
    history.push("/contact/add-new");
  };

  const clearDuplicateList = () => {
    window.localStorage.removeItem("duplicateLeadIds");
    setDuplicateLeadIds([]);
  };

  const handleRowSelected = useCallback(
    (data) => {
      setSelectedContacts(data?.map((contact) => contact.original.leadsId));
    },
    [setSelectedContacts]
  );

  const handleGetAllLeadIds = useCallback(
    (data) => {
      setAllLeads(data?.map((contact) => contact.leadsId));
    },
    [setAllLeads]
  );

  const handleDeleteContacts = async () => {
    await clientsService.deleteContactLeads(selectedContacts);
    setDeleteCounter((deleteCounter) => deleteCounter + 1);

    const undoDelete = async () => {
      let response = await clientsService.reActivateClients(selectedContacts);
      if (response.ok) {
        setDeleteCounter((deleteCounter) => deleteCounter + 1);
        addToast({
          type: "success",
          message: `contacts reactivated successfully`,
        });
      } else if (response.status === 400) {
        addToast({
          type: "error",
          message: "Error while reactivating contacts",
        });
      }
    };
    addToast({
      type: "success",
      message: `${selectedContacts.length} contacts deleted`,
      time: 10000,
      link: "UNDO",
      onClickHandler: undoDelete,
      closeToastRequired: true,
    });
    setIsOpenDeleteContactsModal(false);
  };

  const showDeleteContactsModal = () => {
    setIsOpenDeleteContactsModal(true);
  };

  const onCloseDeleteContactsModal = () => {
    setIsOpenDeleteContactsModal(false);
  };

  const showExportContactsModal = () => {
    setIsOpenExportContactsModal(true);
  };

  const onCloseExportContactsModal = () => {
    setIsOpenExportContactsModal(false);
  };

  return (
    <React.Fragment>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <StageStatusProvider>
        <ToastContextProvider>
          <Helmet>
            <title>MedicareCENTER - Contacts</title>
          </Helmet>
          <GlobalNav />
          <DeleteContactsModal
            open={isOpenDeleteContactsIdModal}
            count={selectedContacts.length}
            close={onCloseDeleteContactsModal}
            onConfirm={handleDeleteContacts}
          />
          <ExportContactsModal
            open={isOpenExportContactsIdModal}
            close={onCloseExportContactsModal}
            contacts={selectedContacts}
            allLeads={allLeads}
          />
          <div className={styles.header}>
            <Container>
              <div className={styles.headerText}>Contacts</div>
              <div className={`${styles.buttonGroup} ${styles.hideOnMobile}`}>
                <Button
                  className="mr-2"
                  data-gtm="contacts-import"
                  icon={<Import />}
                  label="Import"
                  type="secondary"
                  onClick={goToImportPage}
                />
                <Button
                  data-gtm="contacts-add-new"
                  icon={<Add />}
                  label="Add New"
                  type="primary"
                  onClick={goToAddNewContactPage}
                />
              </div>
            </Container>
          </div>
          <Container>
            <div
              className={`bar bar--repel bar--collapse-mobile ${styles["contacts-search-input-wrapper"]}`}
              style={{
                "--bar-spacing-vert": 0,
                "--bar-spacing-horiz": "2.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Textfield
                  id="contacts-search"
                  type={isMobile ? "text" : "search"}
                  defaultValue={searchString}
                  icon={<SearchIcon />}
                  placeholder="Search "
                  name="search"
                  className="bar__item-small"
                  onChange={(event) => {
                    setSearchString(event.currentTarget.value || null);
                  }}
                  onBlur={() => {
                    analyticsService.fireEvent("event-search");
                    return null;
                  }}
                  isMobile={isMobile}
                  onClear={(e) => {
                    setSearchString("");
                    document.getElementById("contacts-search").focus();
                  }}
                  onReset={() => {
                    setSearchString("");
                    document.activeElement.blur();
                  }}
                />
                {duplicateIdsLength > 0 && (
                  <div className={`pl-2 ${styles["reset-partial-duplicates"]}`}>
                    <div className={styles["duplicate-found"]}>
                      {duplicateIdsLength} duplicates found
                    </div>
                    <button
                      onClick={clearDuplicateList}
                      className={styles["reset-close"]}
                    >
                      <RoundCloseIcon />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`bar bar--repel bar--collapse-mobile ${styles["contacts-search-input-wrapper"]}`}
              style={{
                "--bar-spacing-vert": 0,
                "--bar-spacing-horiz": "2.5rem",
              }}
            >
              <div className={`${styles.contactsGridActions} mt-2`}>
                {selectedContacts.length > 0 && (
                  <>
                    <button
                      className={styles["drop-bg"]}
                      onClick={showDeleteContactsModal}
                    >
                      <Delete />
                    </button>
                    <button
                      className={styles["drop-bg"]}
                      onClick={showExportContactsModal}
                    >
                      <Export />
                    </button>
                  </>
                )}
              </div>
              <div className="bar">
                {isMobile ? null : (
                  <div className={styles["switch-view"]}>
                    {layout === "list" ? (
                      <Button
                        data-gtm="contacts-slide-view"
                        icon={<CardView />}
                        iconOnly
                        label="Button"
                        type="secondary"
                        onClick={switchLayout}
                      />
                    ) : (
                      <Button
                        data-gtm="contacts-slide-view"
                        icon={<TableView />}
                        iconOnly
                        label="Button"
                        type="secondary"
                        onClick={switchLayout}
                      />
                    )}
                  </div>
                )}

                <Filter
                  Icon={ContactSort}
                  ActiveIcon={ContactSort}
                  heading={"Sort by "}
                  open={sortToggle}
                  onToggle={setSortToggle}
                  content={
                    <ContactListSort
                      close={setSortToggle}
                      sort={sort}
                      setSort={setSort}
                    />
                  }
                />
                <Filter
                  Icon={FilterIcon}
                  ActiveIcon={ActiveFilter}
                  heading={"Filter by "}
                  open={filterToggle}
                  onToggle={setFilterToggle}
                  filtered={filtered}
                  content={
                    <ContactListFilterOptions
                      setFiltered={(value) => setFiltered(value)}
                      close={setFilterToggle}
                    />
                  }
                />
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <Switch>
                <Route exact path="/contacts">
                  <Redirect to="/contacts/list" />
                </Route>
                <Route path="/contacts/list">
                  <ContactsTable
                    duplicateIdsLength={duplicateIdsLength}
                    searchString={searchStringNew}
                    sort={sort}
                    handleRowSelected={handleRowSelected}
                    handleGetAllLeadIds={handleGetAllLeadIds}
                    deleteCounter={deleteCounter}
                  />
                </Route>
                <Route path="/contacts/card">
                  <ContactsCard searchString={searchStringNew} sort={sort} />
                </Route>
              </Switch>
            </div>
            <div className={styles.footerContainer}>
              <FooterBanners
                className={styles.footerBanners}
                type={isMobile ? "column" : "row"}
              />
            </div>
          </Container>
          <GlobalFooter />
        </ToastContextProvider>
      </StageStatusProvider>
    </React.Fragment>
  );
};
