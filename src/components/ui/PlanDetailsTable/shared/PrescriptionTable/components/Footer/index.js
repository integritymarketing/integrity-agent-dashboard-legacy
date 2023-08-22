import React from "react";
import PropTypes from "prop-types";
import styles from "./Footer.module.scss";
import { TotalEstValue } from "../../../cost-table";
import { useParams } from "react-router-dom";

const Footer = ({ isMobile, planData, count }) => {
  const { effectiveDate } = useParams();
  const [year, month] = effectiveDate?.split("-") || [0, 0];
  const effectiveStartDate = new Date(`${year}-${month}-15`);
  const effectiveMonthlyCosts =
    planData && planData.pharmacyCosts?.length > 0
      ? planData.pharmacyCosts[0].monthlyCosts?.filter(
          (mc) => mc.monthID <= 12 - parseInt(month)
        )
      : [];
  const totalDrugCost = effectiveMonthlyCosts?.reduce((acc, curr) => {
    return (
      acc +
      (curr?.costDetail?.reduce((acc, curr) => {
        return acc + curr.memberCost;
      }, 0) || 0)
    );
  }, 0);
  return (
    <div
      className={`${styles.container} ${
        isMobile ? styles.mobileContainer : ""
      }`}
    >
      <div className={`${styles.left} ${isMobile ? styles.mbLeft : ""}`}>
        <div className={`${styles.title} ${isMobile ? styles.mbTitle : ""}`}>
          Estimated Drug Cost
        </div>
        <div
          className={`${styles.subTitle} ${isMobile ? styles.mbSubTitle : ""}`}
        >
          Based on {count} drugs plus monthly drug premium
        </div>
      </div>
      <div className={`${styles.right} ${isMobile ? styles.mbRight : ""}`}>
        <TotalEstValue
          planData={planData}
          effectiveStartDate={effectiveStartDate}
          monthNumber={parseInt(month)}
          totalCost={totalDrugCost}
        />
      </div>
    </div>
  );
};

Footer.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  planData: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
};

export default Footer;
