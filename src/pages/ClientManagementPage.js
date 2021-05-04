import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { debounce } from "debounce";
import { Helmet } from "react-helmet-async";
import { Formik } from "formik";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import SelectMenu from "components/ui/select-menu";
import Pagination from "components/ui/pagination";
import { useLocation, useHistory, Link } from "react-router-dom";
import useLoading from "hooks/useLoading";
import Card from "components/ui/card";
import EditIcon from "components/icons/edit";
import Modal from "components/ui/modal";
import validationService from "services/validationService";
import Textfield from "components/ui/textfield";
import LeadSourceIndicator from "components/ui/lead-source-indicator";
import analyticsService from "services/analyticsService";
import clientsService from "services/clientsService";
import LocationIcon from "components/icons/location";
import MailIcon from "components/icons/mail";
import ProfileIcon from "components/icons/profile";
import SearchIcon from "components/icons/search";
import PhoneIcon from "components/icons/phone";
import NewIcon from "images/lead-status/Status-New.svg";
import OpenIcon from "images/lead-status/Status-Open.svg";
import QuotedIcon from "images/lead-status/Status-Quoted.svg";
import SOASentIcon from "images/lead-status/Status-SOA-Sent.svg";
import SOASignedIcon from "images/lead-status/Status-SOA-Signed.svg";
import AppliedIcon from "images/lead-status/Status-Applied.svg";
import EnrolledIcon from "images/lead-status/Status-Enrolled.svg";
import ClosedLostIcon from "images/lead-status/Status-Closed-Lost.svg";
import ClosedNotInterestedIcon from "images/lead-status/Status-Closed-Not_Interested.svg";
import ClosedIneligibleIcon from "images/lead-status/Status-Closed-Ineligible.svg";
import ClosedOtherIcon from "images/lead-status/Status-Closed-Other.svg";
import { formatDate, formatToLocalDate } from "utils/dates";
import { formatPhoneNumber } from "utils/phones";

const LEAD_ICONS = {
  1: NewIcon,
  2: OpenIcon,
  3: QuotedIcon,
  4: SOASentIcon,
  5: SOASignedIcon,
  6: AppliedIcon,
  7: EnrolledIcon,
  8: ClosedLostIcon,
  9: ClosedNotInterestedIcon,
  10: ClosedIneligibleIcon,
  11: ClosedOtherIcon,
};

const EmptyField = () => <span className="text-muted">--</span>;

export default () => {
  const PAGE_SIZE = 9;
  const { state = {} } = useLocation();
  const history = useHistory();
  const {
    page = 1,
    sort = "createDate:desc",
    filter = "",
    searchText = "",
  } = state;
  const [hasLoaded, setLoaded] = useState(false);
  const [totalClients, setTotalClients] = useState(0);
  const [clientList, setClientList] = useState([]);
  const [stagedClient, setStagedClient] = useState(null);
  const totalPages = Math.ceil(totalClients / PAGE_SIZE);
  const loading = useLoading();
  const [allStatuses, setAllStatuses] = useState(null);
  const modalFormRef = useRef(null);
  const [hasLoadError, setLoadError] = useState(false);
  const lastRequest = useRef();

  const resultParams = {
    page,
    sort,
    filter,
    searchText,
  };

  // update router history for back/forward functionality
  const setCurrentPage = ({ page, sort, filter, searchText }) => {
    history.push({
      state: {
        sort,
        page,
        filter,
        searchText,
      },
    });
  };

  const getCurrentPage = useMemo(() => {
    return async () => {
      try {
        const getPromise = clientsService.getList(
          page,
          PAGE_SIZE,
          sort,
          filter,
          searchText
        );
        lastRequest.current = getPromise;
        const list = await lastRequest.current;
        if (lastRequest.current !== getPromise) {
          // throw out old requests
          return;
        }
        setClientList(list.result);
        setTotalClients(list.pageResult.total);
        setLoadError(false);
        setLoaded(true);
      } catch (e) {
        setLoadError(true);
      }
    };
  }, [sort, page, filter, PAGE_SIZE, searchText, lastRequest]);

  const debouncedSetCurrentPage = useCallback(
    debounce(setCurrentPage, 500),
    []
  );

  // load status ids for updates
  useEffect(() => {
    const doFetch = async () => {
      const statuses = await clientsService.getStatuses();
      setAllStatuses(statuses);
    };

    doFetch();
  }, []);

  // load data set for current parameters
  useEffect(() => {
    const doFetch = async () => {
      loading.begin({ delay: 200 });
      await getCurrentPage();
      loading.end();
    };

    doFetch();

    // disable warning for loading hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentPage]);

  // on modal load, set focus
  useEffect(() => {
    if (stagedClient) {
      document.getElementById("cm-edit-fname").focus();
    }
  }, [stagedClient]);

  const scrollToErrors = () => {
    setTimeout(() => {
      if (!modalFormRef.current) return;
      const firstError = modalFormRef.current.querySelector(
        ".form-input__error:not(:empty)"
      );
      if (firstError) {
        firstError.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Client Management</title>
      </Helmet>
      <div className="bg-photo bg-photo--alt text-invert">
        <GlobalNav />
        <Container id="main-content" className="scaling-header">
          <h2 className="hdg hdg--1">Client Management</h2>
        </Container>
      </div>
      {hasLoadError && (
        <Container className="mt-scale-3">
          <div className="pt-3 pb-5 text-center">
            <div className="hdg hdg--2 mb-1">Error</div>
            <p className="text-bod mb-3">
              We were unable to load you clients at this time. Please try again
              later.
            </p>
            <button className="btn" onClick={getCurrentPage}>
              Retry
            </button>
          </div>
        </Container>
      )}
      {hasLoaded && !hasLoadError && (
        <Container className="mt-scale-3">
          {clientList.length > 0 || searchText || filter ? (
            <React.Fragment>
              <div className="hdg hdg--3 content-center mb-4 hasImportActions">
                <span>
                  <span className="text-bold">{totalClients}</span> Clients
                </span>
                <button
                  className={`btn btn--outline ml-2 ${analyticsService.clickClass(
                    "addnewcontact-button"
                  )}`}
                  onClick={() => setStagedClient(clientsService.newClientObj())}
                >
                  Add New
                </button>

                <Link
                  to="/client-import"
                  className={`btn btn--outline ml-2 ${analyticsService.clickClass(
                    "import-button"
                  )}`}
                >
                  Import
                </Link>
              </div>
              <div
                className="bar bar--repel bar--collapse-mobile"
                style={{
                  "--bar-spacing-vert": 0,
                  "--bar-spacing-horiz": "2.5rem",
                }}
              >
                <Textfield
                  id="cm-search"
                  type="search"
                  label="Search Leads"
                  defaultValue={searchText}
                  icon={<SearchIcon />}
                  placeholder="Search by first or last name..."
                  name="search"
                  className="bar__item-large"
                  onChange={(event) => {
                    debouncedSetCurrentPage({
                      ...resultParams,
                      page: 1,
                      searchText: event.currentTarget.value,
                    });
                  }}
                />
                <div
                  className="bar bar--attract bar--collapse-mobile"
                  style={{
                    "--bar-spacing-vert": 0,
                    "--bar-spacing-horiz": "2.5rem",
                  }}
                >
                  <SelectMenu
                    name="filter"
                    id="cm-filter"
                    label="Showing"
                    value={filter}
                    className="bar__item-small"
                    onChange={(event) =>
                      setCurrentPage({
                        ...resultParams,
                        page: 1,
                        filter: event.currentTarget.value,
                      })
                    }
                  >
                    <option value="">All Statuses</option>
                    {allStatuses &&
                      allStatuses.map((status) => (
                        <option
                          key={status.leadStatusId}
                          value={status.leadStatusId}
                        >
                          {status.statusName}
                        </option>
                      ))}
                  </SelectMenu>

                  <SelectMenu
                    name="sort"
                    id="cm-sort"
                    label="Sort by"
                    value={sort}
                    className="bar__item-small"
                    onChange={(event) =>
                      setCurrentPage({
                        ...resultParams,
                        page: 1,
                        sort: event.currentTarget.value,
                      })
                    }
                  >
                    <option value="createDate:asc">Date Added Asc</option>
                    <option value="createDate:desc">Date Added Desc</option>
                    <option value="firstName:asc">First Name Asc</option>
                    <option value="firstName:desc">First Name Desc</option>
                    <option value="lastName:asc">Last Name Asc</option>
                    <option value="lastName:desc">Last Name Desc</option>
                    <option value="leadStatusId:asc">Status Asc</option>
                    <option value="leadStatusId:desc">Status Desc</option>
                    <option value="followUpDate:asc">Follow Up Date Asc</option>
                    <option value="followUpDate:desc">
                      Follow Up Date Desc
                    </option>
                  </SelectMenu>
                </div>
              </div>

              {clientList.length === 0 && (
                <div className="pt-5 pb-4 text-center">
                  <div className="hdg hdg--2 mb-1">No Results</div>
                  <p className="text-body">
                    Adjust your search criteria to see more results
                  </p>
                </div>
              )}

              <div className="card-grid mb-5 pt-1">
                {clientList.map((client) => {
                  const {
                    firstName = "",
                    lastName = "",
                    leadSource = "Manual",
                  } = client;
                  const namedClient = firstName !== "" || lastName !== "";
                  const displayName = namedClient
                    ? `${firstName} ${lastName}`.trim()
                    : "--";
                  return (
                    <Card key={client.leadsId}>
                      <div className="bar bar--repel">
                        <div className="card__contactHeader">
                          {leadSource === "Import" && (
                            <LeadSourceIndicator
                              leadStatusId={client.leadStatusId}
                            />
                          )}
                          <div
                            className={`pt-1 pb-1 hdg hdg--4 text-truncate ${
                              namedClient ? "" : "text-muted"
                            }`}
                          >
                            {displayName}
                          </div>
                        </div>
                        <div className="text-brand">
                          <button
                            type="button"
                            className={`icon-btn icon-btn--bump-right ${analyticsService.clickClass(
                              "edit-contactcard"
                            )}`}
                            onClick={() => setStagedClient(client)}
                          >
                            <span className="visually-hidden">
                              Edit {displayName}
                            </span>
                            <EditIcon style={{ pointerEvents: "none" }} />
                          </button>
                        </div>
                      </div>
                      <div className="pb-1 text-body text-body--small">
                        Date Added: {formatToLocalDate(client.createDate)}
                      </div>
                      <div className="keyval-list text-body">
                        <div className="keyval-list__item mt-3">
                          <div className="text-bold">Status</div>
                          <div className="icon-label">
                            {LEAD_ICONS[client.leadStatusId] ? (
                              <img
                                src={LEAD_ICONS[client.leadStatusId]}
                                alt=""
                                height="20"
                                className="mr-1"
                              />
                            ) : null}
                            {client.statusName}
                          </div>
                        </div>
                        <div className="keyval-list__item mt-3">
                          <div className="text-bold">Follow-Up</div>
                          <div>
                            {client.followUpDate ? (
                              formatDate(client.followUpDate)
                            ) : (
                              <EmptyField />
                            )}
                          </div>
                        </div>
                        <div className="keyval-list__item keyval-list__item--full mt-3">
                          <div className="text-bold">Email</div>
                          <div className="text-truncate">
                            {client.email ? (
                              <a
                                className="link link--dark-underline"
                                href={`mailto:${client.email}`}
                              >
                                {client.email}
                              </a>
                            ) : (
                              <EmptyField />
                            )}
                          </div>
                        </div>
                        <div className="keyval-list__item keyval-list__item--full mt-3">
                          <div className="text-bold">Phone Number</div>
                          <div>
                            {client.phone ? (
                              <a
                                className="link link--dark-underline"
                                href={`tel:+1-${formatPhoneNumber(
                                  client.phone
                                )}`}
                              >
                                {formatPhoneNumber(client.phone)}
                              </a>
                            ) : (
                              <EmptyField />
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {clientList.length > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(page) =>
                    setCurrentPage({
                      ...resultParams,
                      page,
                    })
                  }
                />
              )}
            </React.Fragment>
          ) : (
            <div className="pt-3 pb-5 text-center">
              <div className="hdg hdg--2 mb-1">Let's get started</div>
              <p className="text-bod mb-3">Add your first client to begin</p>
              <button
                className={`btn ${analyticsService.clickClass(
                  "addnewcontact-button"
                )}`}
                onClick={() => setStagedClient(clientsService.newClientObj())}
              >
                Add New
              </button>
              <Link
                to="/client-import"
                className={`btn ml-2 ${analyticsService.clickClass(
                  "import-button"
                )}`}
              >
                Import
              </Link>
            </div>
          )}

          <Modal
            open={stagedClient !== null}
            onClose={() => setStagedClient(null)}
            labeledById="dialog_contact_label"
          >
            {stagedClient && (
              <Formik
                initialValues={{
                  firstName: stagedClient.firstName || "",
                  lastName: stagedClient.lastName || "",
                  leadStatusId: stagedClient.leadStatusId,
                  email: stagedClient.email || "",
                  phone: formatPhoneNumber(stagedClient.phone) || "",
                  followUpDate: stagedClient.followUpDate
                    ? formatDate(stagedClient.followUpDate)
                    : "",
                  postalCode: stagedClient.postalCode || "",
                  product: stagedClient.product || "",
                  notes: stagedClient.notes,
                }}
                validate={(values) => {
                  const emailPhoneValidator = () => {
                    if (values.email === "" && values.phone === "") {
                      return "Email Address or Phone Number is required";
                    }
                    return null;
                  };
                  const errors = validationService.validateMultiple(
                    [
                      {
                        name: "email",
                        validator: validationService.composeValidator([
                          validationService.validateEmail,
                          emailPhoneValidator,
                        ]),
                      },
                      {
                        name: "phone",
                        validator: validationService.composeValidator([
                          validationService.validatePhone,
                          emailPhoneValidator,
                        ]),
                      },
                      {
                        name: "postalCode",
                        validator: validationService.validatePostalCode,
                      },
                      {
                        name: "followUpDate",
                        validator: validationService.validateDate,
                        args: ["Follow Up date"],
                      },
                    ],
                    values
                  );

                  if (Object.keys(errors).length) {
                    // wait for validation error to show before scrolling
                    scrollToErrors();
                  }

                  return errors;
                }}
                onSubmit={async (values, { setErrors, setSubmitting }) => {
                  setSubmitting(true);
                  loading.begin();

                  let response = null;

                  try {
                    if (stagedClient.leadsId === null) {
                      response = await clientsService.createClient(values);
                    } else {
                      response = await clientsService.updateClient(
                        stagedClient,
                        values
                      );
                    }
                  } catch (e) {
                    alert("Unable to update this contact. Please try again.");
                    return;
                  }

                  setSubmitting(false);
                  loading.end();

                  if (response.status >= 200 && response.status < 300) {
                    setStagedClient(null);
                    await getCurrentPage();
                  } else {
                    const errorsArr = await response.json();
                    if (
                      response.status === 400 &&
                      errorsArr === "Duplicate Email Address"
                    ) {
                      setErrors({
                        email:
                          "A record already exists associated to that email address",
                      });
                    } else {
                      setErrors(validationService.formikErrorsFor(errorsArr));
                    }
                    scrollToErrors();
                  }
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                }) => (
                  <form
                    action=""
                    className="form"
                    ref={modalFormRef}
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <legend
                      className="hdg hdg--2 mb-1"
                      id="dialog_contact_label"
                    >
                      {stagedClient.leadsId === null
                        ? "New Contact"
                        : "Edit Contact"}
                    </legend>
                    <fieldset className="form__fields">
                      <Textfield
                        id="cm-edit-fname"
                        label="First Name"
                        icon={<ProfileIcon />}
                        placeholder="Contact First Name"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={(e) => {
                          analyticsService.fireEvent("contactCard", {
                            field: "firstName",
                          });
                          return handleBlur(e);
                        }}
                        error={
                          (touched.firstName && errors.firstName) ||
                          errors.Global
                        }
                      />
                      <Textfield
                        id="cm-edit-lname"
                        label="Last Name"
                        icon={<ProfileIcon />}
                        placeholder="Contact Last Name"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={(e) => {
                          analyticsService.fireEvent("contactCard", {
                            field: "lastName",
                          });
                          return handleBlur(e);
                        }}
                        error={
                          (touched.lastName && errors.lastName) || errors.Global
                        }
                      />
                      <Textfield
                        id="cm-edit-email"
                        type="email"
                        label="Email"
                        icon={<MailIcon />}
                        placeholder="Contact Email Address"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={(e) => {
                          analyticsService.fireEvent("contactCard", {
                            field: "emailAddress",
                          });
                          return handleBlur(e);
                        }}
                        error={(touched.email && errors.email) || errors.Global}
                      />
                      <Textfield
                        id="cm-edit-phone"
                        label="Phone Number"
                        icon={<PhoneIcon />}
                        placeholder="XXX-XXX-XXXX"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={(e) => {
                          analyticsService.fireEvent("contactCard", {
                            field: "phoneNumber",
                          });
                          return handleBlur(e);
                        }}
                        error={(touched.phone && errors.phone) || errors.Global}
                      />
                      <Textfield
                        id="cm-edit-postalCode"
                        label="Zip Code"
                        icon={<LocationIcon />}
                        placeholder="Contact Zip Code"
                        name="postalCode"
                        value={values.postalCode}
                        maxLength="5"
                        onChange={handleChange}
                        onBlur={(e) => {
                          analyticsService.fireEvent("contactCard", {
                            field: "postalCode",
                          });
                          return handleBlur(e);
                        }}
                        error={
                          (touched.postalCode && errors.postalCode) ||
                          errors.Global
                        }
                      />
                      <Textfield
                        id="cm-edit-product"
                        label="Product"
                        placeholder="Enter Primary Product"
                        name="product"
                        maxLength="40"
                        value={values.product}
                        onChange={handleChange}
                        onBlur={(e) => {
                          analyticsService.fireEvent("contactCard", {
                            field: "product",
                          });
                          return handleBlur(e);
                        }}
                        error={
                          (touched.product && errors.product) || errors.Global
                        }
                      />
                      <SelectMenu
                        id="cm-edit-status"
                        label="Status"
                        name="leadStatusId"
                        value={values.leadStatusId}
                        onChange={handleChange}
                        onBlur={(e) => {
                          analyticsService.fireEvent("contactCard", {
                            field: "status",
                          });
                          return handleBlur(e);
                        }}
                        error={
                          (touched.status && errors.status) || errors.Global
                        }
                      >
                        {allStatuses ? (
                          <React.Fragment>
                            {allStatuses.map((status) => (
                              <option
                                key={status.leadStatusId}
                                value={status.leadStatusId}
                              >
                                {status.statusName}
                              </option>
                            ))}
                          </React.Fragment>
                        ) : null}
                      </SelectMenu>
                      <Textfield
                        id="cm-edit-followup"
                        type="date"
                        autoComplete="off"
                        label="Follow Up"
                        placeholder="MM/DD/YYYY"
                        name="followUpDate"
                        value={values.followUpDate}
                        onChange={handleChange}
                        onDateChange={(date) => {
                          setFieldValue("followUpDate", formatDate(date));
                        }}
                        onBlur={(e) => {
                          analyticsService.fireEvent("contactCard", {
                            field: "followUpDate",
                          });
                          return handleBlur(e);
                        }}
                        error={
                          (touched.followUpDate && errors.followUpDate) ||
                          errors.Global
                        }
                      />
                      <Textfield
                        id="cm-edit-notes"
                        label="Notes"
                        multiline={true}
                        placeholder="Enter additional notes here"
                        name="notes"
                        value={values.notes}
                        onChange={handleChange}
                        onBlur={(e) => {
                          analyticsService.fireEvent("contactCard", {
                            field: "notes",
                          });
                          return handleBlur(e);
                        }}
                        error={(touched.notes && errors.notes) || errors.Global}
                      />
                      <div className="form__submit text-center">
                        <button className="btn" type="submit">
                          Save
                        </button>
                      </div>
                    </fieldset>
                  </form>
                )}
              </Formik>
            )}
            {stagedClient && stagedClient.leadsId !== null && (
              <React.Fragment>
                <hr className="modal__hr" />
                <div className="text-center">
                  <button
                    className={`btn btn--destructive ${analyticsService.clickClass(
                      "deletecontact-contactcard"
                    )}`}
                    type="button"
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure? You cannot undo this action."
                        )
                      ) {
                        try {
                          await clientsService.deleteClient(
                            stagedClient.leadsId
                          );
                          setStagedClient(null);
                          setCurrentPage({ ...resultParams, page: 1 });
                          await getCurrentPage();
                        } catch (e) {
                          alert("Unable to delete contact. Please try again.");
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </React.Fragment>
            )}
          </Modal>
        </Container>
      )}
      <GlobalFooter />
    </React.Fragment>
  );
};
