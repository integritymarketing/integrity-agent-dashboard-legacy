import React from "react";
import { Link } from "react-router-dom";
import ArrowRightLongIcon from "components/icons/arrow-right-long";
import workingRemotelySrc from "images/working-remotely-373.jpg";
import workingRemotelySrc2x from "images/working-remotely-746.jpg";
import salesTipsSrc from "images/sales-tips-373.jpg";
import salesTipsSrc2x from "images/sales-tips-746.jpg";
import techGuidesSrc from "images/tech-guides-373.jpg";
import techGuidesSrc2x from "images/tech-guides-746.jpg";
import healthSolutionsSrc from "images/health-solutions-373.jpg";
import healthSolutionsSrc2x from "images/health-solutions-746.jpg";
import lifeSolutionsSrc from "images/life-solutions-373.jpg";
import lifeSolutionsSrc2x from "images/life-solutions-746.jpg";
import carrierGuidesSrc from "images/carrier-guides-373.jpg";
import carrierGuidesSrc2x from "images/carrier-guides-746.jpg";

export default () => {
  const topics = [
    {
      name: "Working Remotely",
      images: { 373: workingRemotelySrc, 746: workingRemotelySrc2x },
    },
    {
      name: "Sales Tips",
      images: { 373: salesTipsSrc, 746: salesTipsSrc2x },
    },
    {
      name: "Tech Guides",
      images: { 373: techGuidesSrc, 746: techGuidesSrc2x },
    },
    {
      name: "Health Solutions",
      images: { 373: healthSolutionsSrc, 746: healthSolutionsSrc2x },
    },
    {
      name: "Life Solutions",
      images: { 373: lifeSolutionsSrc, 746: lifeSolutionsSrc2x },
    },
    {
      name: "Carrier Guides",
      images: { 373: carrierGuidesSrc, 746: carrierGuidesSrc2x },
    },
  ];
  return (
    <ul className="link-card-grid">
      {topics.map(({ name, images }) => (
        <li key={name} className="link-card">
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
          <Link to="/resources" className="link-card__link text-body text-bold">
            <span>{name}</span> <ArrowRightLongIcon />
          </Link>
        </li>
      ))}
    </ul>
  );
};
