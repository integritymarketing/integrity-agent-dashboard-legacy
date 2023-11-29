import { useRef } from "react";

import debounce from "lodash/debounce";

import SearchBlue from "components/icons/version-2/SearchBlue";
import Textfield from "components/ui/textfield";

import analyticsService from "services/analyticsService";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";

function Search() {
    const { setSearchString, searchString } = useContactsListContext();

    const inputRef = useRef(null);

    const debouncedOnChangeHandle = debounce((value) => {
        setSearchString(value);
    }, 500);

    const onChangeHandle = (e) => {
        const value = e.target.value;
        debouncedOnChangeHandle(value);
    };

    return (
        <Textfield
            ref={inputRef}
            type="search"
            name="search"
            defaultValue={searchString}
            icon={<SearchBlue />}
            placeholder="Search for a contact"
            className={styles.searchInput}
            onChange={onChangeHandle}
            onBlur={() => analyticsService.fireEvent("event-search")}
            onClear={() => inputRef.current?.focus()}
        />
    );
}

export default Search;
