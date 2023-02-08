import React, { useEffect, useMemo, useCallback, useState } from "react";
import Container from "components/ui/container";
import Spinner from "components/ui/Spinner/index";
import { useSortBy, useTable } from "react-table";
import analyticsService from "services/analyticsService";
import styles from "./ActiveSellingPermissionTable.module.scss";
import ActiveSellingPermissionFilter from "./ActiveSellingPermissionFilter";
import clientService from "services/clientsService";
import Sort from "components/icons/sort-arrow";
import SortUp from "components/icons/sort-arrow-up";
import SortDown from "components/icons/sort-arrow-down";
import LableGroupCard from "components/ui/LableGroupCard";
import useToast from "hooks/useToast";
import Heading2 from "packages/Heading2";

const uniqValues = (array) => Array.from(new Set(array));

export default function ActiveSellingPermissionTable({ npn }) {
  const addToast = useToast();
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoadings] = useState(true);
  const [error, setError] = useState(null);

  useEffect(
    function () {
      if (!npn) return;

      setIsLoadings(true);
      clientService
        .getAgents(npn)
        .then((resp) => {
          setIsLoadings(false);
          setError(null);
          setAgents(resp);
        })
        .catch((err) => {
          setIsLoadings(false);
          setError(err);
          addToast({
            type: "error",
            message: "Failed to load data",
            time: 10000,
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [npn]
  );

  const uniqAgenets = useMemo(() => {
    const byStates = Object.values(
      agents.reduce((acc, row) => {
        const {
          businessUnit,
          carrier,
          planType,
          planYear,
          producerId,
          state,
          status,
        } = row;
        const key = `${carrier}-${producerId}-${planYear}`;
        acc[key] = {
          businessUnit,
          carrier,
          planYear,
          producerId,
          status,
          states: {
            ...(acc[key]?.states ?? {}),
            [state]: uniqValues([
              ...(acc[key]?.states?.[state] ?? []),
              planType,
            ]),
          },
        };
        return acc;
      }, {})
    );
    const results = byStates.reduce((rows, rec) => {
      const statesByPlanTypes = Object.keys(rec.states).reduce((acc, state) => {
        acc[rec.states[state].join("-")] = {
          states: [
            state,
            ...(acc[rec.states[state].join("-")]?.states ?? []),
          ].sort(),
          planTypes: rec.states[state],
        };
        return acc;
      }, {});
      return [
        ...rows,
        ...Object.values(statesByPlanTypes).map((byPlansState) => ({
          ...rec,
          ...byPlansState,
        })),
      ];
    }, []);
    return results;
  }, [agents]);

  const filterOptions = useMemo(
    () =>
      agents.reduce((acc, row) => {
        const { carrier, planType, state } = row;
        return {
          Carrier: uniqValues([carrier, ...(acc?.Carrier ?? [])]),
          State: uniqValues([state, ...(acc?.State ?? [])]),
          PlanType: uniqValues([planType, ...(acc?.PlanType ?? [])]),
        };
      }, {}),
    [agents]
  );

  const handleChangeTable = useCallback(function () {}, []);

  const columns = useMemo(
    () => [
      {
        Header: "Carrier",
        accessor: "carrier",
        Cell: ({ value, row }) => {
          return <div className={styles.carrierName}>{value}</div>;
        },
      },
      {
        Header: "States",
        accessor: "states",
        disableSortBy: true,
        Cell: ({ value, row }) => {
          return <div>{value?.join(", ")}</div>;
        },
      },
      {
        Header: "Plan type",
        accessor: "planTypes",
        disableSortBy: true,
        Cell: ({ value, row }) => {
          return <LableGroupCard labelNames={value?.join(", ")} />;
        },
      },
      {
        Header: "Plan year",
        accessor: "planYear",
        Cell: ({ value, row }) => {
          return <div>{value}</div>;
        },
      },
      {
        Header: "Producer ID",
        accessor: "producerId",
        disableSortBy: true,
        Cell: ({ value, row }) => {
          return <div className={styles.carrierName}>{value}</div>;
        },
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  if (!agents.length) {
    return <div>No records found</div>;
  }

  return (
    <Table
      columns={columns}
      data={uniqAgenets}
      onChangeTableState={handleChangeTable}
      filterOptions={filterOptions}
    />
  );
}

function Table({
  columns,
  data,
  searchString,
  onChangeTableState,
  loading,
  sort,
  applyFilters,
  filterOptions,
}) {
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({});

  const pageData = useMemo(() => {
    const shouldApplyFilters =
      [
        ...Object.keys(filters?.Carrier ?? {}).filter(
          (id) => (filters?.Carrier || {})[id]
        ),
        ...Object.keys(filters?.State ?? {}).filter(
          (id) => (filters?.State || {})[id]
        ),
        ...Object.keys(filters?.PlanType ?? {}).filter(
          (id) => (filters?.PlanType || {})[id]
        ),
      ].length > 0;
    const filteredData = shouldApplyFilters
      ? data.filter((row) => {
          const { states, carrier, planTypes } = row;
          const isStateMatched =
            states.filter((state) => (filters?.State ?? {})[state]).length > 0;
          if (isStateMatched) return true;
          if ((filters?.Carrier || {})[carrier]) return true;
          const isPlantypeMatched =
            planTypes.filter((planType) => (filters?.PlanType ?? {})[planType])
              .length > 0;
          if (isPlantypeMatched) return true;

          return false;
        })
      : [...data];
    setPageSize((pageSize) => Math.min(data.length, pageSize + 10));
    return filteredData.splice(0, pageSize);
  }, [data, pageSize, filters]);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data: pageData,
      },
      useSortBy
    );

  const handleSeeMore = useCallback(() => {
    setPageSize((pageSize) => Math.min(pageData.length, pageSize + 10));
  }, [pageData, setPageSize]);

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/list-view/",
    });
    onChangeTableState({
      searchString,
      sort,
      applyFilters,
    });
  }, [onChangeTableState, searchString, sort, applyFilters]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className="mt-scale-3">
      <div className={styles.headerContainer}>
        <Heading2 text="Active Selling Permissions" />
        <ActiveSellingPermissionFilter
          onSubmit={setFilters}
          filterOptions={filterOptions}
        />
      </div>
      <div className={styles.tableWrapper}>
        <table
          data-gtm="contacts-list-wrapper"
          className={styles.table}
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="text-left"
                  >
                    <div className={styles["tb-headers"]}>
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
          <tbody {...getTableBodyProps()} className={styles["contact-table"]}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        <div className={styles["tb-cell"]}>
                          {cell.render("Cell")}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.length > pageSize && (
          <button onClick={handleSeeMore} className={styles.seeMore}>
            See More
          </button>
        )}
        <div className={styles.paginationResultsDisplay}>
          {`Showing ${rows.length} of ${data.length} Permissions`}
        </div>
      </div>
    </Container>
  );
}
