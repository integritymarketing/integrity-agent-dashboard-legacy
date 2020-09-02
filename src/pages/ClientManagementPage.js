import React from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import SelectMenu from "components/ui/select-menu";

export default () => {
  const totalClients = 45;
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
            <SelectMenu name="sort" id="cm-sort" label="Sort by">
              <option value="firstName-asc">First Name Asc</option>
              <option value="firstName-asc">First Name Desc</option>
              <option value="lastName-asc">Last Name Asc</option>
              <option value="lastName-asc">Last Name Desc</option>
              <option value="status-asc">Status Asc</option>
              <option value="status-asc">Status Desc</option>
              <option value="followUpDate-asc">Follow Up Date Asc</option>
              <option value="followUpDate-asc">Follow Up Date Desc</option>
            </SelectMenu>
          </div>
        </div>
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
