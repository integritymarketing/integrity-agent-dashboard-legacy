import React from "react";
import Container from "components/ui/container";
import Card from "components/ui/card";
import LineItem from "components/ui/line-item";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import ExpandableContent from "components/ui/expandable-content";
import ComputerIcon from "components/icons/computer";
import DownloadIcon from "components/icons/download";
import LightbulbIcon from "components/icons/lightbulb";
import DocumentIcon from "components/icons/document";
import ToolsIcon from "components/icons/tools";
import resourceData from "pages/content/resources.json";

const iconDict = {
  computer: ComputerIcon,
  lightbulb: LightbulbIcon,
  document: DocumentIcon,
  tools: ToolsIcon,
  default: ComputerIcon,
};

const resourceDict = resourceData.resources.reduce((dict, resource) => {
  dict[resource.name] = resource;
  return dict;
}, {});

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
            {resourceData.featured
              .map((resourceName) => resourceDict[resourceName])
              .map((resource) => (
                <Card key={resource.name}>
                  <div className="card__title">
                    <ComputerIcon className="card__icon" />
                    <span>{resource.name}</span>
                  </div>
                  <div className="card__body">
                    <p className="text-body">{resource.description}</p>
                  </div>
                  <div className="card__actions">
                    <a
                      href={resource.url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="btn"
                    >
                      Download
                    </a>
                  </div>
                </Card>
              ))}
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
            sections={resourceData.categories.map((category) => {
              const resources = resourceData.resources.filter((resource) =>
                resource.categories.includes(category.id)
              );
              const CategoryIcon =
                iconDict[category.icon] || iconDict["default"];
              return {
                title: category.name,
                numItems: resources.length,
                renderItems: () => (
                  <ul className="divided-vlist mt-2 mb-5">
                    {resources.map((resource) => {
                      return (
                        <li key={resource.name}>
                          <LineItem
                            href={resource.url}
                            rel="noopener noreferrer"
                            target="_blank"
                            icon={<CategoryIcon />}
                            actionIcon={<DownloadIcon />}
                          >
                            <div className="text-body text-bold mb-1">
                              {resource.name}
                            </div>
                            <div className="text-body">
                              {resource.description}
                            </div>
                          </LineItem>
                        </li>
                      );
                    })}
                  </ul>
                ),
              };
            })}
          />
        </section>
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
