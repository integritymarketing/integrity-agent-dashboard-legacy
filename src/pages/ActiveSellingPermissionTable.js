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
import { Grid, Paper } from "@mui/material";
import { useWindowSize } from "hooks/useWindowSize";
import NonRTSBanner from "components/Non-RTS-Banner";
import useRoles from "hooks/useRoles";

const uniqValues = (array) => Array.from(new Set(array));
const NONRTS_DESCRIPTION = "Active selling permission data is currently unavailable for your account. This section will be updated once your carrier appointment information is in our files. Please contact your marketer if you have any questions."
const mobileColumnFormat = {
  Carrier: {
    name: "Carrier",
    bold: "true",
  },
  "Plan year": {
    name: "Yr",
    bold: "",
  },
  States: {
    name: "States",
    bold: "",
  },
  "Producer ID": {
    name: "ID",
    bold: "true",
  },
  "Plan type": {
    name: "Products",
    bold: "",
  },
};

export default function ActiveSellingPermissionTable({ npn }) {
  const { width: windowWidth } = useWindowSize();
  const addToast = useToast();
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoadings] = useState(true);
  const [error, setError] = useState(null);
  const { isNonRTS_User } = useRoles();
  console.log("JJJ", isNonRTS_User);
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
        const { carrier, planType, planYear, state } = row;
        return {
          Carrier: uniqValues([carrier, ...(acc?.Carrier ?? [])]),
          State: uniqValues([state, ...(acc?.State ?? [])]),
          PlanType: uniqValues([planType, ...(acc?.PlanType ?? [])]),
          PlanYear: uniqValues([planYear, ...(acc?.PlanYear ?? [])]),
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

  if (isNonRTS_User) {
    return (
      <Container className={styles.container}>
        <div className={styles.headerContainerNonRTS}>
          <Heading2
            className={styles.heading}
            text="Active Selling Permissions"
          />
        </div>

        <div className={styles.nonRTS}>
          <NonRTSBanner description={NONRTS_DESCRIPTION} />
        </div>
      </Container>
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
      mobile={windowWidth <= 784 ? true : false}
      isNonRTS_User={isNonRTS_User}
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
  mobile,
  isNonRTS_User,
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
        ...Object.keys(filters?.PlanYear ?? {}).filter(
          (id) => (filters?.PlanYear || {})[id]
        ),
      ].length > 0;
    const filteredData = shouldApplyFilters
      ? data.filter((row) => {
          const { states, carrier, planTypes, planYear } = row;
          const isStateMatched =
            states.filter((state) => (filters?.State ?? {})[state]).length > 0;
          if (isStateMatched) return true;
          if ((filters?.Carrier || {})[carrier]) return true;
          const isPlantypeMatched =
            planTypes.filter((planType) => (filters?.PlanType ?? {})[planType])
              .length > 0;
          if (isPlantypeMatched) return true;
          if ((filters?.PlanYear || {})[planYear]) return true;

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

  const orderMobileColumns = (cells) => {
    const clonedArr = [...cells];
    const lastTwoItems = clonedArr.splice(-2);
    clonedArr.splice(1, 0, ...lastTwoItems);
    clonedArr.splice(2, 1, clonedArr.splice(3, 1, clonedArr[2])[0]);
    return clonedArr;
  };

  const mobileListCells = (cell, index) => {
    return (
      <Grid item xs={(index + 1) % 2 === 0 ? 6 : 10} key={index + Date.now()}>
        <div className={styles.gridItem}>
          <p>{mobileColumnFormat[cell.column?.Header]["name"]}:</p>
          {(() => {
            if (mobileColumnFormat[cell.column?.Header]["name"] === "States") {
              return (
                <p
                  className={`${
                    mobileColumnFormat[cell.column?.Header]["bold"]
                      ? styles.textBlueBold
                      : ""
                  }${
                    styles[
                      cell.column?.Header?.replace(/\s+/g, "").toLowerCase()
                    ]
                  }
                      `}
                >
                  {cell?.value?.join(", ")}
                </p>
              );
            } else if (
              mobileColumnFormat[cell.column?.Header]["name"] === "Products"
            ) {
              return (
                <LableGroupCard
                  labelNames={cell?.value?.slice(0, 3).join(", ")}
                />
              );
            } else {
              return (
                <p
                  className={`${
                    mobileColumnFormat[cell.column?.Header]["bold"]
                      ? styles.textBlueBold
                      : ""
                  }
                  ${
                    styles[
                      cell.column?.Header?.replace(/\s+/g, "").toLowerCase()
                    ]
                  }
                  ${styles.wordWrap}
                    `}
                >
                  {cell?.value}
                </p>
              );
            }
          })()}
        </div>
      </Grid>
    );
  };

  const renderMobileList = () => (
    <Paper>
      {rows.map((row, i) => {
        prepareRow(row);
        return (
          <Grid
            container
            spacing="8px"
            columns={16}
            className={styles.mobileListItem}
            key={i + Date.now()}
          >
            {orderMobileColumns(row.cells).map((cell, index) => {
              return mobileListCells(cell, index);
            })}
          </Grid>
        );
      })}
    </Paper>
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className={styles.container}>
      <div className={styles.headerContainer}>
        <Heading2
          className={styles.heading}
          text="Active Selling Permissions"
        />

        <ActiveSellingPermissionFilter
          onSubmit={setFilters}
          filterOptions={filterOptions}
        />
      </div>
      {isNonRTS_User ? (
        <NonRTSBanner description={NONRTS_DESCRIPTION}/>
      ) : (
        <>
          {mobile ? (
            renderMobileList()
          ) : (
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
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
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
                <tbody
                  {...getTableBodyProps()}
                  className={styles["contact-table"]}
                >
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
          )}
        </>
      )}
    </Container>
  );
}
