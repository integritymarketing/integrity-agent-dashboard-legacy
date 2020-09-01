import React from "react";
import { Link } from "react-router-dom";
import ArrowRightLongIcon from "components/icons/arrow-right-long";
import workingRemotelySrc from "images/optimized/working-remotely-373.jpg";
import workingRemotelySrc2x from "images/optimized/working-remotely-746.jpg";
import salesTipsSrc from "images/optimized/sales-tips-373.jpg";
import salesTipsSrc2x from "images/optimized/sales-tips-746.jpg";
import techGuidesSrc from "images/optimized/tech-guides-373.jpg";
import techGuidesSrc2x from "images/optimized/tech-guides-746.jpg";
import healthSolutionsSrc from "images/optimized/health-solutions-373.jpg";
import healthSolutionsSrc2x from "images/optimized/health-solutions-746.jpg";
import lifeSolutionsSrc from "images/optimized/life-solutions-373.jpg";
import lifeSolutionsSrc2x from "images/optimized/life-solutions-746.jpg";
import carrierGuidesSrc from "images/optimized/carrier-guides-373.jpg";
import carrierGuidesSrc2x from "images/optimized/carrier-guides-746.jpg";
import analyticsService from "services/analytics";

export default () => {
  const topics = [
    {
      id: "working-remotely",
      analyticsKey: "workingremotely",
      name: "Working Remotely",
      images: { 373: workingRemotelySrc, 746: workingRemotelySrc2x },
    },
    {
      id: "sales-tips",
      analyticsKey: "salestips",
      name: "Sales Tips",
      images: { 373: salesTipsSrc, 746: salesTipsSrc2x },
    },
    {
      id: "tech-guides",
      analyticsKey: "techguides",
      name: "Tech Guides",
      images: { 373: techGuidesSrc, 746: techGuidesSrc2x },
    },
    {
      id: "health-solutions",
      analyticsKey: "healthsolutions",
      name: "Health Solutions",
      images: { 373: healthSolutionsSrc, 746: healthSolutionsSrc2x },
    },
    {
      id: "life-solutions",
      analyticsKey: "lifesolutions",
      name: "Life Solutions",
      images: { 373: lifeSolutionsSrc, 746: lifeSolutionsSrc2x },
    },
    {
      id: "carrier-guides",
      analyticsKey: "carrierguides",
      name: "Carrier Guides",
      images: { 373: carrierGuidesSrc, 746: carrierGuidesSrc2x },
    },
  ];
  return (
    <ul className="link-card-grid">
      {topics.map(({ id, analyticsKey, name, images }) => (
        <li key={id} className="link-card">
          <img
            src={images[373]}
            srcSet={Object.keys(images)
              .map((size) => `${images[size]} ${size}w`)
              .join(", ")}
            width="373"
            alt=""
            className="link-card__img"
            aria-hidden="true"
          />
          {/* TODO: link up to resources sections */}
          <Link
            to={{
              pathname: "/resources",
              hash: `#${id}`,
            }}
            className={`link-card__link text-body text-bold ${analyticsService.clickClass(
              `${analyticsKey}-tile`
            )}`}
          >
            <span>{name}</span> <ArrowRightLongIcon />
          </Link>
        </li>
      ))}
    </ul>
  );
};
