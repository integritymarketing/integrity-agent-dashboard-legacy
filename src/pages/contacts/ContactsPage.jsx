import * as Sentry from "@sentry/react";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import debounce from "debounce";

import { useActiveFilters } from "hooks/useActiveFilters";
import useToast from "hooks/useToast";

import ContactListFilterOptions from "packages/ContactListFilterOptions";
import ContactListSort from "packages/ContactListSort";
import Filter from "packages/Filter/Filter";
import FooterBanners from "packages/FooterBanners";

import GoBackNavbar from "components/BackButtonNavbar";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import FilterIcon from "components/icons/activities/Filter";
import Add from "components/icons/add";
import CardView from "components/icons/card-view";
import ContactSort from "components/icons/contact-sort";
import Export from "components/icons/export";
import Import from "components/icons/import";
import RoundCloseIcon from "components/icons/round-close";
import SearchIcon from "components/icons/search";
import TableView from "components/icons/table-view";
import Delete from "components/icons/trashbin";
import { Button } from "components/ui/Button";
import Container from "components/ui/container";
import Textfield from "components/ui/textfield";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import BackNavContext from "contexts/backNavProvider";
import { StageStatusProvider } from "contexts/stageStatus";

import analyticsService from "services/analyticsService";
import { useClientServiceContext } from "services/clientServiceProvider";

import ContactsCard from "./ContactsCard";
import styles from "./ContactsPage.module.scss";
import ContactsTable from "./ContactsTable";
import DeleteContactsModal from "./DeleteContactsModal";
import ExportContactsModal from "./ExportContactsModal";

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

const DEFAULT_SORT = ["Reminders%3Aasc&Sort=Reminders.ReminderDate%3Aasc", "createDate:desc"];

const ContactsPage = () => {
    const [searchString, setSearchString] = useState(null);
    const [searchStringNew, setSearchStringNew] = useState(searchString);
    const [sort, setSort] = useState(DEFAULT_SORT);
    const [layout, setLayout] = useState("");
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [allLeads, setAllLeads] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const [deleteCounter, setDeleteCounter] = useState(0);

    const [duplicateIds, setDuplicateLeadIds] = useState(geItemFromLocalStorage("duplicateLeadIds"));

    const [filterIds, setFilterLeadIds] = useState(geItemFromLocalStorage("filterLeadIds"));

    const [filterInfo, setFilterInfo] = useState(geItemFromLocalStorage("filterInfo"));
    const [isOpenDeleteContactsIdModal, setIsOpenDeleteContactsModal] = useState(false);
    const [isOpenExportContactsIdModal, setIsOpenExportContactsModal] = useState(false);
    const [filterToggle, setFilterToggle] = useState(false);
    const [sortToggle, setSortToggle] = useState(false);

    const { active = false } = useActiveFilters();
    const { clientsService } = useClientServiceContext();

    const { setCurrentPage } = useContext(BackNavContext);
    const showToast = useToast();

    const duplicateIdsLength = duplicateIds?.length;
    const filteredLeadIdsLength = filterIds?.length;

    useEffect(() => {
        setCurrentPage("Contacts Page");
    }, [setCurrentPage]);

    const debouncedSetSearchString = useRef(debounce(setSearchStringNew, 500)).current;

    useEffect(() => {
        debouncedSetSearchString(searchString);
    }, [searchString, debouncedSetSearchString]);

    const switchLayout = () => {
        const switchToLayoutPath = layout === "list" ? cardViewLayoutPath : listViewLayoutPath;
        navigate(switchToLayoutPath);
        setLayout((_layout) => (_layout === "list" ? "card" : "list"));
    };

    useEffect(() => {
        setLayout(() => (location.pathname === cardViewLayoutPath ? "card" : "list"));
    }, [location, isMobile]);

    const goToImportPage = () => {
        navigate("/client-import");
    };

    const goToAddNewContactPage = () => {
        navigate("/contact/add-new");
    };

    useEffect(() => {
        return () => {
            window.localStorage.removeItem("filterLeadIds");
            window.localStorage.removeItem("filterInfo");

            setFilterLeadIds([]);
            setFilterInfo(null);
        };
    }, []);

    const clearDuplicateLeadIds = () => {
        window.localStorage.removeItem("duplicateLeadIds");
        setDuplicateLeadIds([]);
        navigate("/contacts");
    };

    const clearFilteredLeadIds = () => {
        window.localStorage.removeItem("filterLeadIds");
        window.localStorage.removeItem("filterInfo");

        setFilterLeadIds([]);
        setFilterInfo(null);
        navigate("/contacts");
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
        setDeleteCounter((_deleteCounter) => _deleteCounter + 1);

        const undoDelete = async () => {
            const response = await clientsService.reActivateClients(selectedContacts);
            if (response.ok) {
                setDeleteCounter((_deleteCounter) => _deleteCounter + 1);
                showToast({
                    type: "success",
                    message: `contacts reactivated successfully`,
                });
            } else if (response.status === 400) {
                showToast({
                    type: "error",
                    message: "Error while reactivating contacts",
                });
            }
        };
        showToast({
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

    const handleContactSearch = (event) => {
        setSearchString(event.target.value);
    };

    return (
        <React.Fragment>
            <Media
                query={"(max-width: 500px)"}
                onChange={(_isMobile) => {
                    setIsMobile(_isMobile);
                }}
            />
            <StageStatusProvider>
                <Helmet>
                    <title>MedicareCENTER - Contacts</title>
                </Helmet>
                <GlobalNav />
                {filterInfo?.policyCount > 0 && <GoBackNavbar />}
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
                        {isMobile && (
                            <div className={styles.headerText} onClick={goToAddNewContactPage}>
                                + Add New
                            </div>
                        )}
                    </Container>
                </div>
                <div className={styles.contactBodyWrapper}>
                    <Container>
                        <div className={styles.searchContactInput}>
                            <Textfield
                                id="contacts-search"
                                type={isMobile ? "text" : "search"}
                                defaultValue={searchString}
                                icon={<SearchIcon />}
                                placeholder="Search "
                                name="search"
                                className={styles.searchInput}
                                onChange={handleContactSearch}
                                onBlur={() => {
                                    analyticsService.fireEvent("event-search");
                                    return null;
                                }}
                                isMobile={isMobile}
                                onClear={() => {
                                    setSearchString("");
                                    document.getElementById("contacts-search").focus();
                                }}
                            />
                            {!isMobile && filterInfo?.policyCount > 0 && (
                                <div className={`${styles["reset-partial-duplicates"]}`}>
                                    <div className={`${styles["colorAndCount"]}`}>
                                        <div
                                            style={{
                                                backgroundColor: filterInfo.policyStatusColor,
                                            }}
                                            className={styles["statusColor"]}
                                        ></div>
                                        <div className={styles["duplicate-found"]}>
                                            {`${filterInfo.policyCount}  ${filterInfo.status}
                      Policies `}
                                        </div>
                                    </div>
                                    <button onClick={clearFilteredLeadIds} className={styles["reset-close"]}>
                                        <RoundCloseIcon />
                                    </button>
                                </div>
                            )}
                            {duplicateIdsLength > 0 && (
                                <div className={`pl-2 ${styles["reset-partial-duplicates"]}`}>
                                    <div className={styles["duplicate-found"]}>
                                        {duplicateIdsLength}
                                        duplicates found
                                    </div>
                                    <button onClick={clearDuplicateLeadIds} className={styles["reset-close"]}>
                                        <RoundCloseIcon />
                                    </button>
                                </div>
                            )}
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
                                        <button className={styles["drop-bg"]} onClick={showDeleteContactsModal}>
                                            <Delete />
                                        </button>
                                        <button className={styles["drop-bg"]} onClick={showExportContactsModal}>
                                            <Export />
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="bar">
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
                                            setSort={(value) => setSort([value])}
                                        />
                                    }
                                />
                                <Filter
                                    Icon={FilterIcon}
                                    ActiveIcon={ActiveFilter}
                                    heading={"Filter by "}
                                    open={filterToggle}
                                    onToggle={setFilterToggle}
                                    filtered={active}
                                    content={<ContactListFilterOptions close={setFilterToggle} layout={layout} />}
                                />
                            </div>
                        </div>
                        {isMobile && filterInfo?.policyCount > 0 && (
                            <div className={`${styles["reset-partial-duplicates"]}`}>
                                <div className={`${styles["colorAndCount"]}`}>
                                    <div
                                        style={{ backgroundColor: filterInfo.policyStatusColor }}
                                        className={styles["statusColor"]}
                                    ></div>
                                    <div className={styles["duplicate-found"]}>
                                        {`${filterInfo.policyCount} ${filterInfo.status}
                      Policies `}
                                    </div>
                                </div>
                                <button onClick={clearFilteredLeadIds} className={styles["reset-close"]}>
                                    <RoundCloseIcon />
                                </button>
                            </div>
                        )}
                        <div className={styles.tableWrapper}>
                            <Routes>
                                <Route path="/" element={<Navigate to="/contacts/list" replace={true} />} />
                                <Route
                                    path="/list"
                                    element={
                                        <ContactsTable
                                            filteredLeadIdsLength={filteredLeadIdsLength}
                                            searchString={searchStringNew}
                                            sort={sort}
                                            handleRowSelected={handleRowSelected}
                                            handleGetAllLeadIds={handleGetAllLeadIds}
                                            deleteCounter={deleteCounter}
                                            isMobile={isMobile}
                                            layout={layout}
                                        />
                                    }
                                />
                                <Route
                                    path="/card"
                                    element={
                                        <ContactsCard
                                            searchString={searchStringNew}
                                            sort={sort}
                                            isMobile={isMobile}
                                            layout={layout}
                                        />
                                    }
                                />
                            </Routes>
                        </div>
                        <div className={styles.footerContainer}>
                            <FooterBanners className={styles.footerBanners} type={isMobile ? "column" : "row"} />
                        </div>
                    </Container>
                </div>
                <GlobalFooter />
            </StageStatusProvider>
        </React.Fragment>
    );
};

export default ContactsPage;
