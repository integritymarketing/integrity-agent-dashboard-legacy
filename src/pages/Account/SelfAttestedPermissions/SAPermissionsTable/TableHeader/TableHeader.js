import Sort from "components/icons/sort-arrow";
import SortUp from "components/icons/sort-arrow-up";
import SortDown from "components/icons/sort-arrow-down";

import styles from "./styles.module.scss";

function TableHeader({ headerGroups }) {
  return (
    <thead>
      {headerGroups.map((headerGroup, i) => (
        <tr {...headerGroup.getHeaderGroupProps()} key={i}>
          {headerGroup.headers.map((column) => (
            <th
              {...column.getHeaderProps(column.getSortByToggleProps())}
            >
              <div className={styles.customHeader}>
                <span>{column.render("Header")}</span>
                <span className={styles.sortingIcon}>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <SortDown />
                    ) : (
                      <SortUp />
                    )
                  ) : column.disableSortBy ? (
                    ""
                  ) : (
                    <Sort />
                  )}
                </span>
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

export default TableHeader;
