import React from "react";
import { Helmet } from "react-helmet-async";
import Container from "components/ui/container";
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
import analyticsService from "services/analyticsService";

const iconDict = {
  computer: ComputerIcon,
  lightbulb: LightbulbIcon,
  document: DocumentIcon,
  tools: ToolsIcon,
  default: ComputerIcon,
};

const createDictBy = (list, prop) =>
  list.reduce((dict, item) => {
    dict[item[prop]] = item;
    return dict;
  }, {});

const resourceDict = createDictBy(resourceData.resources, "name");
const categoryDict = createDictBy(resourceData.categories, "id");

const getResourceUrl = (filename) => {
  const resourcesBaseUrl = process.env.REACT_APP_RESOURCES_URL;
  return `${resourcesBaseUrl}/${filename}`;
};

export default () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Learning Center</title>
      </Helmet>
      <div className="bg-photo text-invert">
        <GlobalNav />
        <Container id="main-content" className="scaling-header">
          <h2 className="hdg hdg--1">Learning Center</h2>
        </Container>
      </div>
      <div className="bg-high-contrast">
        <Container className="mt-scale-3 pb-scale-4">
          <section>
            <h3 className="hdg hdg--3 text-hr">Recommended Reads</h3>
            <div className="mod-grid mt-4">
              {resourceData.featured
                .map((resourceName) => resourceDict[resourceName])
                .map((resource, idx) => {
                  const category = categoryDict[resource.categories[0]];
                  const CategoryIcon =
                    iconDict[category.icon] || iconDict["default"];
                  return (
                    <div className="mod text-center" key={resource.name}>
                      <div>
                        <CategoryIcon width="40" height="40" />
                      </div>
                      <div className="mt-2">
                        <h2 className="hdg hdg--4">{resource.name}</h2>
                      </div>
                      <div className="mt-1">
                        <p className="text-body">{resource.description}</p>
                      </div>
                      <div className="pt-2 mt-auto">
                        <a
                          href={getResourceUrl(resource.filename)}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="btn"
                          onClick={() =>
                            analyticsService.fireEvent("resourceDownloaded", {
                              featuredCategory:
                                categoryDict[resource.categories[0]]
                                  .analyticsKey,
                              assetName: resource.name,
                            })
                          }
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </Container>
      </div>
      <Container className="mt-scale-3">
        <section>
          <ExpandableContent
            header={({ isExpanded, toggleAll }) => (
              <div className="toolbar mb-4">
                <h3 className="hdg hdg--3">All Resources</h3>
                <div className="toolbar__aux text-body sf-hide">
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
                id: category.id,
                title: category.name,
                numItems: resources.length,
                renderItems: () => (
                  <ul className="divided-vlist divided-vlist--light mt-2 mb-5">
                    {resources.map((resource) => {
                      return (
                        <li key={resource.name}>
                          <LineItem
                            href={getResourceUrl(resource.filename)}
                            rel="noopener noreferrer"
                            target="_blank"
                            icon={<CategoryIcon />}
                            actionIcon={
                              resource.filename ? <DownloadIcon /> : null
                            }
                            onClick={() =>
                              analyticsService.fireEvent("assetDownloaded", {
                                assetCategory: category.analyticsKey,
                                assetName: resource.name,
                              })
                            }
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
