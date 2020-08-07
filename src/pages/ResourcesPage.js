import React from "react";
import Container from "components/ui/container";
import Card from "components/ui/card";
import LineItem from "components/ui/line-item";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import ExpandableContent from "components/ui/expandable-content";
import ComputerIcon from "components/icons/computer";
import DownloadIcon from "components/icons/download";

export default () => {
  return (
    <React.Fragment>
      <div className="bg-high-contrast">
        <GlobalNav />
        <Container className="scaling-header">
          <div className="hdg hdg--2">
            Resources to keep your sales game strong.
          </div>

          <div className="hdg hdg--3 mt-1">
            Check out your educational resources below.
          </div>
        </Container>
      </div>
      <Container className="mt-scale-3">
        <section>
          <div className="hdg hdg--3">Recommended Reads</div>
          <div className="card-grid mt-4">
            <Card>
              <div className="card__title">
                <ComputerIcon className="card__icon" />
                <span>Tips for Working Remotely</span>
              </div>
              <div className="card__body">
                <p className="text-body">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor,
                </p>
              </div>
              <div className="card__actions">
                <button className="btn">Download</button>
              </div>
            </Card>
            <Card>
              <div className="card__title">
                <ComputerIcon className="card__icon" />
                <span>Tips for Managing Remote Workers</span>
              </div>
              <div className="card__body">
                <p className="text-body">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor,
                </p>
              </div>
              <div className="card__actions">
                <button className="btn">Download</button>
              </div>
            </Card>
            <Card>
              <div className="card__title">
                <ComputerIcon className="card__icon" />
                <span>Tips for Managing Stress</span>
              </div>
              <div className="card__body">
                <p className="text-body">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor,
                </p>
              </div>
              <div className="card__actions">
                <button className="btn">Download</button>
              </div>
            </Card>
          </div>
        </section>
        <section className="mt-scale-4">
          <ExpandableContent
            header={({ isExpanded, toggleAll }) => (
              <div className="toolbar mb-4">
                <div className="hdg hdg--3">All Resources</div>
                <div className="toolbar__right text-body sf-hide">
                  <button className="link" onClick={toggleAll}>
                    {isExpanded ? "Collapse All" : "Expand All"}
                  </button>
                </div>
              </div>
            )}
            sections={[
              {
                title: "Working in a Remote World",
                numItems: 2,
                renderItems: () => (
                  <ul className="divided-vlist mt-2 mb-5">
                    <li>
                      <LineItem
                        href="#external"
                        icon={<ComputerIcon />}
                        actionIcon={<DownloadIcon />}
                      >
                        <div className="text-body text-bold mb-1">
                          Tips for Working Remotely
                        </div>
                        <div className="text-body">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor,
                        </div>
                      </LineItem>
                    </li>
                    <LineItem
                      href="#external"
                      icon={<ComputerIcon />}
                      actionIcon={<DownloadIcon />}
                    >
                      <div className="text-body text-bold mb-1">
                        Tips for Working Remotely
                      </div>
                      <div className="text-body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor,
                      </div>
                    </LineItem>
                  </ul>
                ),
              },
              {
                title: "Sales Tips and Tricks",
                numItems: 1,
                renderItems: () => (
                  <ul className="divided-vlist mt-2 mb-5">
                    <LineItem
                      href="#external"
                      icon={<ComputerIcon />}
                      actionIcon={<DownloadIcon />}
                    >
                      <div className="text-body text-bold mb-1">
                        Tips for Working Remotely
                      </div>
                      <div className="text-body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor,
                      </div>
                    </LineItem>
                  </ul>
                ),
              },
            ]}
          />
        </section>
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
