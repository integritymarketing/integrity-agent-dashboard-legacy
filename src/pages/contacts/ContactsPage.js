import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import Media from "react-media";
import Import from "components/icons/import";
import Add from "components/icons/add";
import CardView from "components/icons/card-view";
import SearchIcon from "components/icons/search";
import SortIcon from "components/icons/sort";
import TableView from "components/icons/table-view";
import Filter from "components/icons/filter";
import { Button } from "components/ui/Button";
import Container from "components/ui/container";
import { Select } from "components/ui/Select";
import Textfield from "components/ui/textfield";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { StageStatusProvider } from "contexts/stageStatus";
import { debounce } from "debounce";
import GlobalNav from "partials/global-nav-v2";
import ContactFooter from "partials/global-footer";
import { SORT_OPTIONS } from "../../constants";
import ContactsCard from "./ContactsCard";
import styles from "./ContactsPage.module.scss";
import ContactsTable from "./ContactsTable";

const listViewLayoutPath = "/contacts/list";
const cardViewLayoutPath = "/contacts/card";

const SortButton = () => {
  return (
    <>
      <SortIcon />
      <span>Sort</span>
    </>
  )
}
export default () => {
  const [searchString, setSearchString] = useState(null);
  const [sort, setSort] = React.useState(null);
  const [layout, setLayout] = useState();
  const location = useLocation();
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setLayout(() =>
      location.pathname === cardViewLayoutPath ? "card" : "list"
    );
    if (isMobile && location.pathname !== cardViewLayoutPath) {
      switchLayout();
    }
  }, [location, isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedSetSearchString = useCallback(
    debounce(setSearchString, 500),
    []
  );
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

  return (
    <React.Fragment>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <StageStatusProvider>
        <Helmet>
          <title>MedicareCENTER - Contacts</title>
        </Helmet>
        <GlobalNav />
        <div className={styles.header}>
          <Container>
            <div className={styles.headerText}>Contacts</div>
            <div className={`${styles.buttonGroup} ${styles.hideOnMobile}`}>
              <Button
                className="mr-2"
                icon={<Import />}
                label="Import"
                type="secondary"
                onClick={goToImportPage}
              />
              <Button 
              icon={<Add />} 
              label="Add New" 
              type="primary"
              onClick={goToAddNewContactPage} />
            </div>
          </Container>
        </div>
        <Container>
          <ToastContextProvider>
            <div
              className={`bar bar--repel bar--collapse-mobile`}
              style={{
                "--bar-spacing-vert": 0,
                "--bar-spacing-horiz": "2.5rem",
              }}
            >
              <Textfield
                id="contacts-search"
                type="search"
                defaultValue={searchString}
                icon={<SearchIcon />}
                placeholder="Search "
                name="search"
                className="bar__item-small"
                onChange={(event) => {
                  debouncedSetSearchString(event.currentTarget.value || null);
                }}
              />
              <div className="bar">
                {isMobile ? null : (
                  <div className={styles["switch-view"]}>
                    {layout === "list" ? (
                      <Button
                        icon={<CardView />}
                        iconOnly
                        label="Button"
                        type="secondary"
                        onClick={switchLayout}
                      />
                    ) : (
                      <Button
                        icon={<TableView />}
                        iconOnly
                        label="Button"
                        type="secondary"
                        onClick={switchLayout}
                      />
                    )}
                  </div>
                )}
                <div className="nav-header-mobile"></div>
                <div className={styles.sortSelect}>
                  <Select
                    mobileLabel={<SortButton />}
                    placeholder={"Sort by"}
                    initialValue="followUpDate:asc"
                    options={SORT_OPTIONS}
                    prefix="Sort by "
                    onChange={(value) => setSort(value)}
                  />
                </div>
                <div className={styles["filter-view"]}>
                  <Button
                    icon={<Filter />}
                    label="Filter"
                    type="secondary"
                    onClick={switchLayout}
                  />
                </div>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <Switch>
                <Route exact path="/contacts">
                  <Redirect to="/contacts/list" />
                </Route>
                <Route path="/contacts/list">
                  <ContactsTable searchString={searchString} sort={sort} />
                </Route>
                <Route path="/contacts/card">
                  <ContactsCard searchString={searchString} sort={sort} />
                </Route>
              </Switch>
            </div>
          </ToastContextProvider>
        </Container>
        <ContactFooter hideMeicareIcon={true} />
      </StageStatusProvider>
    </React.Fragment>
  );
};
