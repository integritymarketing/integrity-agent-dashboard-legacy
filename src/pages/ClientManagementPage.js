import React, { useState, useEffect } from "react";
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
import validationService from "services/validation";
import Textfield from "components/ui/textfield";
import analyticsService from "services/analytics";
import clientsService from "services/clients";

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
  return dateFnsFormat(date, "MM/dd/yyyy");
};

export default () => {
  const PAGE_SIZE = 9;
  const { state = {} } = useLocation();
  const history = useHistory();
  const { page = 1, sort = "firstName:asc" } = state;
  const [totalClients, setTotalClients] = useState(45);
  const [clientList, setClientList] = useState([]);
  const [stagedClient, setStagedClient] = useState(null);
  const totalPages = Math.ceil(totalClients / PAGE_SIZE);
  const loading = useLoading();

  // update router history for back/forward functionality
  const setCurrentPage = (page, sort) => {
    history.push({
      state: {
        sort,
        page,
      },
    });
  };

  // load data set for current parameters
  useEffect(() => {
    const refreshClientList = async () => {
      const list = await clientsService.getList(page, sort);
      console.log(list);

      setClientList(list);
      setTotalClients(45);
      loading.end();
    };
    loading.begin({ delay: 200 });
    refreshClientList();

    // disable warning for loading hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, page]);

  return (
    <React.Fragment>
      <div className="bg-photo text-invert">
        <GlobalNav />
        <Container className="scaling-header">
          <h2 className="hdg hdg--1">Client Management</h2>
        </Container>
      </div>
      <Container className="mt-scale-3">
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
              onChange={(event) => setCurrentPage(1, event.currentTarget.value)}
            >
              <option value="firstName:asc">First Name Asc</option>
              <option value="firstName:desc">First Name Desc</option>
              <option value="lastName:asc">Last Name Asc</option>
              <option value="lastName:desc">Last Name Desc</option>
              <option value="statusName:asc">Status Asc</option>
              <option value="statusName:desc">Status Desc</option>
              <option value="followUpDate:asc">Follow Up Date Asc</option>
              <option value="followUpDate:desc">Follow Up Date Desc</option>
            </SelectMenu>
          </div>
        </div>

        <div className="card-grid mb-5 pt-1">
          {clientList.map((client) => (
            <Card key={client.leadsId}>
              <div className="toolbar">
                <div className="hdg hdg--4">
                  {client.firstName} {client.lastName}
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
                      Edit {client.firstName} {client.lastName}
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
                  <div>{formatDate(client.followUpDate)}</div>
                </div>
                <div className="keyval-list__item keyval-list__item--full mt-3">
                  <div className="text-bold">Email</div>
                  <div>
                    <a href={`mailto:${client.email}`}>{client.email}</a>
                  </div>
                </div>
                <div className="keyval-list__item keyval-list__item--full mt-3">
                  <div className="text-bold">Phone Number</div>
                  <div>
                    <a href={`tel:+1-${formatPhoneNumber(client.phone)}`}>
                      {formatPhoneNumber(client.phone)}
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {clientList.length > 0 ? (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page, sort)}
          />
        ) : (
          <div className="pt-3 pb-5 text-center">
            <div className="hdg hdg--3 mb-2">No results</div>
            <p className="text-body">Click the button above to add a client.</p>
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
                status: stagedClient.statusName,
                email: stagedClient.email,
                phone: formatPhoneNumber(stagedClient.phone) || "",
                followUpDate: stagedClient.followUpDate
                  ? formatDate(stagedClient.followUpDate)
                  : "",
                postalCode: stagedClient.postalCode || "",
                notes: stagedClient.notes,
              }}
              validate={(values) => {
                return validationService.validateMultiple(
                  [
                    {
                      name: "firstName",
                      validator: validationService.validateRequired,
                      args: ["First Name"],
                    },
                    {
                      name: "lastName",
                      validator: validationService.validateRequired,
                      args: ["Last Name"],
                    },
                  ],
                  values
                );
              }}
              onSubmit={async (values, { setErrors, setSubmitting }) => {
                setSubmitting(true);
                loading.begin();

                // TODO: submit changes
                let response = null;
                if (stagedClient.leadsId === null) {
                  response = await clientsService.createClient(values);
                } else {
                  response = await clientsService.updateClient(
                    stagedClient.leadsId,
                    values
                  );
                }

                setSubmitting(false);
                loading.end();

                if (response.status >= 200 && response.status < 300) {
                  setStagedClient(null);
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
              }) => (
                <form action="" className="form" onSubmit={handleSubmit}>
                  <legend className="hdg hdg--2 mb-1">
                    {stagedClient.leadsId === null
                      ? "Add Contact"
                      : "Edit Contact"}
                  </legend>
                  <fieldset className="form__fields">
                    <Textfield
                      id="cm-edit-fname"
                      label="First Name"
                      placeholder="Enter first name"
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
                        (touched.firstName && errors.firstName) || errors.Global
                      }
                    />
                    <Textfield
                      id="cm-edit-lname"
                      label="Last Name"
                      placeholder="Enter last name"
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
                    <SelectMenu
                      id="cm-edit-status"
                      label="Status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={(e) => {
                        analyticsService.fireEvent("contactCard", {
                          field: "status",
                        });
                        return handleBlur(e);
                      }}
                      error={(touched.status && errors.status) || errors.Global}
                    >
                      <option value="Open">Open</option>
                      <option value="Applied">Applied</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Closed: Lost">Closed: Lost</option>
                      <option value="Closed: Other">Closed: Other</option>
                      <option value="Open">Open</option>
                    </SelectMenu>
                    <Textfield
                      id="cm-edit-email"
                      type="email"
                      label="Email"
                      placeholder="Enter email address"
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
                      label="Phone"
                      placeholder="Enter phone number"
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
                      label="ZIP Code"
                      placeholder="Enter zip code"
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
                    <Textfield
                      id="cm-edit-followup"
                      type="date"
                      label="Follow-up Date"
                      placeholder="YYYY-MM-DD"
                      name="followUpDate"
                      value={values.followUpDate}
                      onChange={handleChange}
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
                      placeholder="Enter notes"
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
              <hr class="modal__hr" />
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
                      await clientsService.deleteClient(stagedClient.leadsId);
                      setStagedClient(null);
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
      <GlobalFooter />
    </React.Fragment>
  );
};
