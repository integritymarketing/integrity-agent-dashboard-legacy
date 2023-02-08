import React from "react";
import Tile from "components/ui/tile";
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
import analyticsService from "services/analyticsService";

export default () => {
  const topics = [
    {
      id: "sales-tips",
      analyticsKey: "salestips",
      name: "Sales Tips",
      desc: "Successful sales strategies can change a career. Collaborate with other Agents to increase sales.",
      images: { 373: salesTipsSrc, 746: salesTipsSrc2x },
    },
    {
      id: "tech-guides",
      analyticsKey: "techguides",
      name: "Tech Guides",
      desc: "You’ll be surprised how life-changing technology can be when used a certain way.",
      images: { 373: techGuidesSrc, 746: techGuidesSrc2x },
    },
    {
      id: "working-remote",
      analyticsKey: "workingremotely",
      name: "Working Remote",
      desc: "Get personalized tips and advice for maximizing your day and your staff remotely.",
      images: { 373: workingRemotelySrc, 746: workingRemotelySrc2x },
    },
    {
      id: "carrier-guides",
      analyticsKey: "carrierguides",
      name: "Carrier Guides",
      desc: "Access condensed outlines for carriers by network and plans to make sense out of AEP.",
      images: { 373: carrierGuidesSrc, 746: carrierGuidesSrc2x },
    },
    {
      id: "health-solutions",
      analyticsKey: "healthsolutions",
      name: "Health Solutions",
      desc: "Insights to help you outperform the competition for health products.",
      images: { 373: healthSolutionsSrc, 746: healthSolutionsSrc2x },
    },
    {
      id: "life-solutions",
      analyticsKey: "lifesolutions",
      name: "Life Solutions",
      desc: "Resources to assist in understanding how to follow up with life products after AEP.",
      images: { 373: lifeSolutionsSrc, 746: lifeSolutionsSrc2x },
    },
  ];
  return (
    <ul className="link-card-grid">
      {topics.map(({ id, analyticsKey, name, images, desc }) => (
        <Tile
          data-gtm="hp-learning-center-item"
          component="li"
          key={id}
          imgProps={{
            src: images[373],
            srcSet: Object.keys(images)
              .map((size) => `${images[size]} ${size}w`)
              .join(", "),
            width: "373",
          }}
          linkProps={{
            to: {
              pathname: "/learning-center",
              hash: `#${id}`,
            },
            className: analyticsService.clickClass(`${analyticsKey}-tile`),
          }}
          name={name}
          desc={desc}
        ></Tile>
      ))}
    </ul>
  );
};
