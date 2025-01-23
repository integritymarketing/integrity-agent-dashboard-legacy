import PropTypes from "prop-types";

import SortArrow from "components/icons/version-2/SortArrow";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";

function TableHeader({ headerGroups }) {
    const { sort, setSort } = useContactsListContext();
    const onSortHandle = (column) => {
        if (column.Header === "Name") {
            if (sort.includes("lastName:asc")) {
                setSort(["lastName:desc"]);
            } else {
                setSort(["lastName:asc"]);
            }
        }
    };

    return (
        <thead>
            {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, _index) => {
                        return (
                            <th {...column.getHeaderProps()} key={_index}>
                                <div className={styles.customHeader}>
                                    <span>{column.render("Header")}</span>
                                    <span className={styles.sortingIcon} onClick={() => onSortHandle(column)}>
                                        {column.disableSortBy ? "" : <SortArrow />}
                                    </span>
                                </div>
                            </th>
                        );
                    })}
                </tr>
            ))}
        </thead>
    );
}

TableHeader.propTypes = {
    headerGroups: PropTypes.array,
};

export default TableHeader;
