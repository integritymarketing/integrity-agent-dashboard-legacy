import React, { useState, useEffect, useMemo, useRef } from "react";
import { Formik } from "formik";
import dateFnsFormat from "date-fns/format";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import SelectMenu from "components/ui/select-menu";
import Pagination from "components/ui/pagination";
import { useLocation, useHistory } from "react-router-dom";
import useLoading from "hooks/useLoading";
import Card from "components/ui/card";
import EditIcon from "components/icons/edit";
import StatusField, {
  STATUS_POSITIVE,
  STATUS_NEGATIVE,
} from "components/ui/status-field";
import Modal from "components/ui/modal";
import validationService from "services/validationService";
import Textfield from "components/ui/textfield";
import analyticsService from "services/analyticsService";
import clientsService from "services/clientsService";

const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : dateFnsFormat(date, "MM/dd/yyyy");
};

const EmptyField = () => <span className="text-muted">--</span>;

export default () => {
  const PAGE_SIZE = 9;
  const { state = {} } = useLocation();
  const history = useHistory();
  const { page = 1, sort = "firstName:asc" } = state;
  const [totalClients, setTotalClients] = useState(0);
  const [clientList, setClientList] = useState([]);
  const [stagedClient, setStagedClient] = useState(null);
  const totalPages = Math.ceil(totalClients / PAGE_SIZE);
  const loading = useLoading();
  const [allStatuses, setAllStatuses] = useState(null);
  const modalFormRef = useRef(null);
  const [hasLoadError, setLoadError] = useState(false);

  // update router history for back/forward functionality
  const setCurrentPage = (page, sort) => {
    history.push({
      state: {
        sort,
        page,
      },
    });
  };

  const getCurrentPage = useMemo(() => {
    return async () => {
      try {
        const list = await clientsService.getList(page, PAGE_SIZE, sort);
        setClientList(list.result);
        setTotalClients(list.pageResult.total);
        setLoadError(false);
      } catch (e) {
        setLoadError(true);
      }
    };
  }, [sort, page, PAGE_SIZE]);

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

  return (
    <React.Fragment>
      <div className="bg-photo text-invert">
        <GlobalNav />
        <Container className="scaling-header">
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
      {!loading.isLoading && !hasLoadError && (
        <Container className="mt-scale-3">
          {clientList.length > 0 ? (
            <React.Fragment>
              <div className="toolbar">
                <span className="mr-3">
                  <span className="text-bold">{totalClients}</span>
                  <span> Clients</span>
                </span>

                <button
                  className={`btn ${analyticsService.clickClass(
                    "addnewcontact-button"
                  )}`}
                  onClick={() => setStagedClient(clientsService.newClientObj())}
                >
                  Add New
                </button>

                <div className="toolbar__right">
                  <SelectMenu
                    name="sort"
                    id="cm-sort"
                    label="Sort by"
                    value={sort}
                    onChange={(event) =>
                      setCurrentPage(1, event.currentTarget.value)
                    }
                  >
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

              <div className="card-grid mb-5 pt-1">
                {clientList.map((client) => {
                  const { firstName = "", lastName = "" } = client;
                  const namedClient = firstName !== "" || lastName !== "";
                  const displayName = namedClient
                    ? `${firstName} ${lastName}`.trim()
                    : "Unnamed Contact";
                  return (
                    <Card key={client.leadsId}>
                      <div className="toolbar">
                        <div
                          className={`hdg hdg--4 ${
                            namedClient ? "" : "text-muted"
                          }`}
                        >
                          {displayName}
                        </div>
                        <div className="toolbar__right text-brand">
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
                            <EditIcon />
                          </button>
                        </div>
                      </div>
                      <div className="keyval-list text-body">
                        <div className="keyval-list__item mt-3">
                          <div className="text-bold">Status</div>
                          <StatusField
                            status={
                              client.statusName.includes("Closed")
                                ? STATUS_NEGATIVE
                                : STATUS_POSITIVE
                            }
                          >
                            {client.statusName}
                          </StatusField>
                          <div></div>
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
                          <div>
                            {client.email ? (
                              <a href={`mailto:${client.email}`}>
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

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page, sort)}
              />
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
            </div>
          )}

          <Modal
            open={stagedClient !== null}
            onClose={() => setStagedClient(null)}
          >
            {stagedClient && (
              <Formik
                initialValues={{
                  firstName: stagedClient.firstName,
                  lastName: stagedClient.lastName,
                  leadStatusId: stagedClient.leadStatusId,
                  email: stagedClient.email,
                  phone: formatPhoneNumber(stagedClient.phone) || "",
                  followUpDate: stagedClient.followUpDate
                    ? formatDate(stagedClient.followUpDate)
                    : "",
                  postalCode: stagedClient.postalCode || "",
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
                    ],
                    values
                  );

                  if (Object.keys(errors).length) {
                    // wait for validation error to show before scrolling
                    setTimeout(() => {
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
                    setErrors(validationService.formikErrorsFor(errorsArr));
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
                  >
                    <legend className="hdg hdg--2 mb-1">
                      {stagedClient.leadsId === null
                        ? "New Contact"
                        : "Edit Contact"}
                    </legend>
                    <fieldset className="form__fields">
                      <Textfield
                        id="cm-edit-fname"
                        label="First Name"
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
                        placeholder="Contact Phone Number"
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
                        placeholder="Contact Zip Code"
                        name="postalCode"
                        value={values.postalCode}
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
                          setCurrentPage(1);
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
