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
import {Select} from 'components/ui/Select';
import {SORT_OPTIONS} from '../../constants';

export default () => {
  const [searchString, setSearchString] = useState(null)
  const [sort, setSort] = React.useState(null)

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
              debouncedSetSearchString(event.currentTarget.value || null)
            }}
          />
              <div className={styles.sortSelect}>
        <Select 
            placeholder={'Date Added Desc'}
            options={SORT_OPTIONS}
            onChange = {(value)=> setSort(value)}
          />
          </div>
        </div>
        {/* <div className={styles.header}>Header</div> */}
    
        <div className={styles.tableWrapper}>
          <ContactsTable searchString={searchString} sort={sort} />
        </div>
      </Container>
      <Footer />
    </React.Fragment>
  );
};
