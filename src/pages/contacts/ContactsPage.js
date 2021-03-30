import React, { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { debounce } from "debounce";
import Container from "components/ui/container";
import Footer from "components/ui/Footer";
import Textfield from "components/ui/textfield";
import SearchIcon from "components/icons/search";
import GlobalNav from "partials/global-nav-v2";
import ContactsTable from "./ContactsTable";
import styles from "./ContactsPage.module.scss";

export default () => {
  const [searchString, setSearchString] = useState(null)
  const debouncedSetSearchString = useCallback(
    debounce(setSearchString, 500),
    []
  );
  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Contacts</title>
      </Helmet>
      <GlobalNav />
      <Container className={styles.container}>
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
              debouncedSetSearchString(event.target.value || null)
            }}
          />
        </div>
        {/* <div className={styles.header}>Header</div> */}
        <div className={styles.tableWrapper}>
          <ContactsTable searchString={searchString} />
        </div>
      </Container>
      <Footer />
    </React.Fragment>
  );
};
