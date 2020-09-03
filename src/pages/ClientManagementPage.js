import React, { useState, useEffect } from "react";
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

const capitalize = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

export default () => {
  const PAGE_SIZE = 9;
  const { state = {} } = useLocation();
  const history = useHistory();
  const { page = 1, sort = "firstName-asc" } = state;
  const [totalClients, setTotalClients] = useState(45);
  const [clientList, setClientList] = useState([]);
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
      await new Promise((resolve) => setTimeout(() => resolve(), 1000)); // TODO: remove this delay
      const list = await Promise.resolve([
        {
          firstName: "FirstName",
          lastName: "LastName",
          status: "closed",
          statusReason: "lost",
          followUpDate: "2020-01-01",
          email: "emailaddress@website.com",
          phone: "651-555-1234",
        },
        {
          firstName: "FirstName",
          lastName: "LastName",
          status: "closed",
          statusReason: "lost",
          followUpDate: "2020-01-01",
          email: "emailaddress@website.com",
          phone: "651-555-1234",
        },
        {
          firstName: "FirstName",
          lastName: "LastName",
          status: "closed",
          statusReason: "lost",
          followUpDate: "2020-01-01",
          email: "emailaddress@website.com",
          phone: "651-555-1234",
        },
        {
          firstName: "FirstName",
          lastName: "LastName",
          status: "closed",
          statusReason: "lost",
          followUpDate: "2020-01-01",
          email: "emailaddress@website.com",
          phone: "651-555-1234",
        },
      ]); // TODO: replace with API call
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

          <button className="btn">Add New</button>

          <div className="toolbar__right">
            <SelectMenu
              name="sort"
              id="cm-sort"
              label="Sort by"
              value={sort}
              onChange={(event) => setCurrentPage(1, event.currentTarget.value)}
            >
              <option value="firstName-asc">First Name Asc</option>
              <option value="firstName-desc">First Name Desc</option>
              <option value="lastName-asc">Last Name Asc</option>
              <option value="lastName-desc">Last Name Desc</option>
              <option value="status-asc">Status Asc</option>
              <option value="status-desc">Status Desc</option>
              <option value="followUpDate-asc">Follow Up Date Asc</option>
              <option value="followUpDate-desc">Follow Up Date Desc</option>
            </SelectMenu>
          </div>
        </div>

        <div className="card-grid mb-5 pt-1">
          {clientList.map((client) => (
            <Card>
              <div className="toolbar">
                <div className="hdg hdg--4">
                  {client.firstName} {client.lastName}
                </div>
                <div className="toolbar__right text-brand">
                  <button
                    type="button"
                    className="icon-btn icon-btn--bump-right"
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
                      client.status === "closed"
                        ? STATUS_NEGATIVE
                        : STATUS_POSITIVE
                    }
                  >
                    {capitalize(client.status)}:{" "}
                    {capitalize(client.statusReason)}
                  </StatusField>
                  <div></div>
                </div>
                <div className="keyval-list__item mt-3">
                  <div className="text-bold">Follow-Up</div>
                  <div>{client.followUpDate}</div>
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
                    <a href={`tel:+1-${client.phone}`}>{client.phone}</a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {clientList.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page, sort)}
          />
        )}
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
