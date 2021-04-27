import CardView from "components/icons/card-view";
import SearchIcon from "components/icons/search";
import TableView from "components/icons/table-view";
import { Button } from 'components/ui/Button';
import Container from "components/ui/container";
import Footer from "components/ui/Footer";
import { Select } from "components/ui/Select";
import Textfield from "components/ui/textfield";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { StageStatusProvider } from "contexts/stageStatus";
import { debounce } from "debounce";
import GlobalNav from "partials/global-nav-v2";
import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { SORT_OPTIONS } from "../../constants";
import ContactsCard from "./ContactsCard";
import styles from "./ContactsPage.module.scss";
import ContactsTable from "./ContactsTable";


const listViewLayoutPath = '/contacts/list'
const cardViewLayoutPath = '/contacts/card'

export default () => {
  const [searchString, setSearchString] = useState(null);
  const [sort, setSort] = React.useState(null);
  const [layout, setLayout] = useState()
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    setLayout(() => location.pathname === cardViewLayoutPath
      ? 'card'
      : 'list')
  }, [location])
  const debouncedSetSearchString = useCallback(
    debounce(setSearchString, 500),
    []
  );
  const switchLayout = () => {
    const switchToLayoutPath = layout === 'list'
      ? cardViewLayoutPath
      : listViewLayoutPath
    history.push(switchToLayoutPath)
    setLayout(layout =>  layout === 'list' ? 'card' : 'list')
  };

  return (
    <React.Fragment>
      <StageStatusProvider>
      <Helmet>
        <title>MedicareCENTER - Contacts</title>
      </Helmet>
      <GlobalNav />
      <Container className={styles.container}>
        <ToastContextProvider>
          <p className={styles.header}>Contacts</p>
          {/* <div className="contacts-nav-section"> */}
          <div
            className="bar bar--repel bar--collapse-mobile"
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
            <div className={styles['switch-view']}>
              {
                layout === 'list'
                  ? <Button
                    icon={<CardView />}
                    iconOnly
                    label="Button"
                    type="secondary"
                    onClick={switchLayout}
                  />
                  : <Button
                    icon={<TableView />}
                    iconOnly
                    label="Button"
                    type="secondary"
                    onClick={switchLayout}
                  />
              }
            </div>
            <div className="nav-header-mobile"></div>
            {/* </div> */}
            <div className={styles.sortSelect}>
              <Select
                placeholder={"Date Added Desc"}
                options={SORT_OPTIONS}
                onChange={(value) => setSort(value)}
              />
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
      <Footer />
      </StageStatusProvider>
    </React.Fragment>
  );
};
