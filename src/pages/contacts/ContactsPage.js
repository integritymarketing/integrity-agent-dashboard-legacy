import React, { useState, useCallback, useEffect } from "react";
import { Route, Switch, Redirect, useLocation, useHistory } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import { debounce } from "debounce";
import Container from "components/ui/container";
import Footer from "components/ui/Footer";
import Textfield from "components/ui/textfield";
import SearchIcon from "components/icons/search";
import CardView from "components/icons/card-view";
import TableView from "components/icons/table-view";
import GlobalNav from "partials/global-nav-v2";
import ContactsTable from "./ContactsTable";
import ContactsCard from "./ContactsCard";
import styles from "./ContactsPage.module.scss";
import { Select } from "components/ui/Select";
import { SORT_OPTIONS } from "../../constants";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { Button } from 'components/ui/Button';

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
      <Helmet>
        <title>MedicareCENTER - Contacts</title>
      </Helmet>
      <GlobalNav />
      <Container className={styles.container}>
        <ToastContextProvider>
          <p className={styles.header}>Contacts</p>
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
            <div>
              {
                layout === 'list'
                  ? <Button
                    icon={<TableView />}
                    iconOnly
                    label="Button"
                    type="secondary"
                    onClick={switchLayout}
                  />
                  : <Button
                    icon={<CardView />}
                    iconOnly
                    label="Button"
                    type="secondary"
                    onClick={switchLayout}
                  />
              }
            </div>
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
    </React.Fragment>
  );
};
