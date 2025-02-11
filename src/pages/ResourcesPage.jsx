import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import ComputerIcon from "components/icons/computer";
import DocumentIcon from "components/icons/document";
import LightbulbIcon from "components/icons/lightbulb";
import ToolsIcon from "components/icons/tools";
import DownloadIcon from "components/icons/v2-download";
import Container from "components/ui/container";
import ExpandableContent from "components/ui/expandable-content";
import LineItem from "components/ui/line-item";
import VideoLineItem from "components/ui/video-line-item";

import GlobalFooter from "partials/global-footer";
import GlobalNavV2 from "partials/global-nav-v2";

import analyticsService from "services/analyticsService";

import resourceData from "pages/content/resources.json";

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

export const getResourceUrl = (filename) => {
    if (filename.indexOf("http") === 0) {
        return filename; // use full http filename
    } else {
        return `${import.meta.env.VITE_RESOURCES_URL}/${filename}`; // relative path, add resources_url
    }
};

const isTrainingHub = (resource) => {
    return resource.name === "Integrity Client's Video Training Hub" ? true : false;
};

const isFeaturedDescriptionChange = (resourceName) => {
    return resourceName === "New User Guide" ? true : false;
};

const ResourcesPage = () => {
    useEffect(() => {
        analyticsService.fireEvent("event-content-load", {
            pagePath: "/learning-center/",
        });
    }, []);

const pluralizeTitle = (title, count) => {
    return count > 1 ? `${title}s` : title;
    };    

    return (
        <React.Fragment>
            <Helmet>
                <title>Integrity - Learning Center</title>
            </Helmet>
            <GlobalNavV2 />
            <div className="v2 pb-4">
                <div className="bg-white" data-gtm="learning-center-recommended-read-wrapper">
                    <Container className="pt-scale-3 pb-scale-4">
                        <h2 className="hdg hdg--1 mb-4">Learning Center</h2>
                        <section>
                            <h3 className="hdg hdg--3">Recommended Reads</h3>
                            <div className="mod-grid mt-4">
                                {resourceData.featured
                                    .map((resourceName) => resourceDict[resourceName])
                                    .map((resource, idx) => {
                                        const category = categoryDict[resource.categories[0]];
                                        const CategoryIcon = iconDict[category.icon] || iconDict["default"];
                                        return (
                                            <div
                                                className="mod"
                                                data-gtm="learning-center-recommended-read-item"
                                                key={resource.name}
                                            >
                                                <div>
                                                    <CategoryIcon width="26" height="26" />
                                                </div>
                                                <div className="mt-2">
                                                    <h2 className="hdg hdg--4">{resource.name}</h2>
                                                </div>
                                                <div className="mt-1">
                                                    <p className="text-secondary">
                                                        {isFeaturedDescriptionChange(resource.name)
                                                            ? "Learn how to use Integrity to streamline your business so you can save time and make more sales."
                                                            : resource.description}
                                                    </p>
                                                </div>
                                                <div
                                                    className="pt-2 mt-auto"
                                                    data-gtm="learning-center-recommended-read-item-button"
                                                >
                                                    <a
                                                        href={getResourceUrl(resource.filename)}
                                                        rel="noopener noreferrer"
                                                        target="_blank"
                                                        className="btn-v2"
                                                        onClick={() =>
                                                            analyticsService.fireEvent("resourceWatchNow", {
                                                                featuredCategory:
                                                                    categoryDict[resource.categories[0]].analyticsKey,
                                                                assetName: resource.name,
                                                            })
                                                        }
                                                    >
                                                        {isTrainingHub(resource) ? "Watch Now" : "Download"}
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </section>
                    </Container>
                </div>
                <Container className="mt-scale-3" data-gtm="learning-center-all-resources-wrapper">
                    <section>
                        <ExpandableContent
                            header={({ isExpanded, toggleAll }) => (
                                <div className="toolbar mb-4">
                                    <h3 className="hdg hdg--3 text-main">Guides By Topic</h3>
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
                                const CategoryIcon = iconDict[category.icon] || iconDict["default"];
                                return {
                                    id: category.id,
                                    title: pluralizeTitle(category.name, resources.length),
                                    numItems: resources.length,
                                    renderItems: () => (
                                        <ul className="divided-vlist divided-vlist--light mt-2 mb-5">
                                            {resources.map((resource) => {
                                                if (resource.videoUrl) {
                                                    return <VideoLineItem key={resource.name} resource={resource} />;
                                                }

                                                return (
                                                    <li key={resource.name} data-gtm="learning-center-section-item">
                                                        <LineItem
                                                            href={getResourceUrl(resource.filename)}
                                                            rel="noopener noreferrer"
                                                            target="_blank"
                                                            icon={<CategoryIcon className="text-main" />}
                                                            actionIcon={
                                                                resource.filename ? (
                                                                    <DownloadIcon className="text-blue" />
                                                                ) : null
                                                            }
                                                            onClick={() =>
                                                                analyticsService.fireEvent("assetDownloaded", {
                                                                    assetCategory: category.analyticsKey,
                                                                    assetName: resource.name,
                                                                })
                                                            }
                                                        >
                                                            <div className="text-main mb-1">{resource.name}</div>
                                                            <div className="text-secondary">{resource.description}</div>
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
            </div>
            <GlobalFooter />
        </React.Fragment>
    );
};

export default ResourcesPage;
