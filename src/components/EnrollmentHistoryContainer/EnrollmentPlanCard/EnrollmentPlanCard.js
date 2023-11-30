import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import styles from "./EnrollmentPlanCard.module.scss";
import IconWithText from "packages/IconWithText";
import View from "./View.png";
import Link from "./Link.png";
import Media from "react-media";
import Icon from "components/Icon";
import { Button } from "components/ui/Button";
import SharePlan from "components/icons/sharePlan";
import { formattedName } from "utils/shared-utils/sharedUtility";
import OpenIcon from "components/icons/open";
import Relink from "../Icons/relink";

export default function EnrollmentPlanCard(props) {
    const {
        submittedDate,
        enrolledDate,
        policyEffectiveDate,
        termedDate,
        policyHolder,
        policyId,
        currentYear = true,
        leadId,
        isEnrollPlansPage,
        onShareClick,
        policyStatus,
        confirmationNumber,
        isEmail = false,
        planName,
        carrier,
        planId,
        hasPlanDetails,
        policyStatusColor,
    } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);

    const holderName = policyHolder ? formattedName(policyHolder) : "";

    const navigateEnrollDetails = () => {
        navigate(`/enrollmenthistory/${leadId}/${confirmationNumber}/${policyEffectiveDate}`, {
            state: props,
        });
    };

    const navigateToEnrollmentLink = () => {
        navigate(`/enrollment-link-to-contact`, {
            state: props,
        });
    };
    return (
        <div className={styles.planCardContainer}>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            {/* <div className={styles.planHistory}>
        {currentYear ? "Current Plan" : "Previous Years"}
      </div> */}
            <div className={`${styles.planCard} ${!currentYear ? styles.isBordered : ""}`}>
                {currentYear && (
                    <div className={styles.status} style={{ backgroundColor: policyStatusColor }}>
                        <strong>Status:</strong> {policyStatus}
                    </div>
                )}
                <div className={`${!currentYear ? styles.previousYear : ""} ${styles.planDetails}`}>
                    <div className={styles.planName}>{planName}</div>
                    <div className={styles.detailsContainer}>
                        <div className={styles.detailAndDateContainer}>
                            <div className={styles.details}>
                                <div className={styles.planCompany}>{renderPlanDetails("Carrier", carrier)}</div>
                                <div>
                                    <strong className={styles.planId}>Plan ID:</strong> <span>{planId}</span>
                                </div>
                            </div>
                            <div className={styles.dates}>
                                {currentYear ? (
                                    <>
                                        <PlanDate type="Submitted" date={submittedDate} />

                                        {(policyStatus === "upcoming" || policyStatus === "active") && (
                                            <>
                                                <PlanDate type="Effective" date={policyEffectiveDate} />
                                                <PlanDate type="Enrolled" date={enrolledDate} />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <PlanDate type="Effective" date={policyEffectiveDate} />

                                        <PlanDate type="Termed" date={termedDate} />
                                    </>
                                )}
                            </div>
                        </div>
                        {!isEmail && (
                            <>
                                {isEnrollPlansPage ? (
                                    <div>
                                        {isMobile ? (
                                            <div className={styles.shareBtnContainer} onClick={() => onShareClick()}>
                                                <span className={styles.shareText}>Share</span>
                                                <SharePlan />
                                            </div>
                                        ) : (
                                            <Button
                                                label="Share Plan"
                                                onClick={() => onShareClick()}
                                                type="secondary"
                                                className={styles.shareBtn}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className={styles.links}>
                                        <Media
                                            queries={{
                                                small: "(max-width: 767px)",
                                            }}
                                        >
                                            {(matches) =>
                                                matches.small ? (
                                                    <>
                                                        {hasPlanDetails && (
                                                            <div onClick={navigateEnrollDetails}>
                                                                <IconWithText
                                                                    text="View"
                                                                    icon={
                                                                        <Icon
                                                                            altText="View"
                                                                            className={styles.iconPng}
                                                                            image={View}
                                                                        />
                                                                    }
                                                                    screensize="small"
                                                                />
                                                            </div>
                                                        )}
                                                        {!location.pathname.includes("enrollment-link-to-contact") &&
                                                            policyStatus !== "started" && (
                                                                <div onClick={navigateToEnrollmentLink}>
                                                                    <IconWithText
                                                                        text="Relink"
                                                                        icon={
                                                                            <Icon
                                                                                altText="Link"
                                                                                className={styles.iconPng}
                                                                                image={Link}
                                                                            />
                                                                        }
                                                                        screensize="small"
                                                                    />
                                                                </div>
                                                            )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {hasPlanDetails && (
                                                            <Button
                                                                icon={<OpenIcon />}
                                                                label={"View"}
                                                                className={styles.viewButton}
                                                                onClick={navigateEnrollDetails}
                                                                type="tertiary"
                                                                iconPosition="right"
                                                            />
                                                        )}
                                                        {!location.pathname.includes("enrollment-link-to-contact") &&
                                                            policyStatus !== "started" && (
                                                                <Button
                                                                    icon={<Relink color="#4178FF" />}
                                                                    label={"Relink"}
                                                                    className={styles.relinkButton}
                                                                    onClick={navigateToEnrollmentLink}
                                                                    type="tertiary"
                                                                    iconPosition="right"
                                                                />
                                                            )}
                                                    </>
                                                )
                                            }
                                        </Media>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={`${!currentYear ? styles.previousYear : ""} ${styles.policyDetails}`}>
                <div className={styles.policyHolder}>{renderPlanDetails("Policy Holder", holderName)}</div>
                {policyId && <div className={styles.policyId}>{renderPlanDetails("Policy ID", policyId)}</div>}
            </div>
        </div>
    );

    function PlanDate({ type, date }) {
        return (
            <div className={styles.date}>
                <strong>{type}: </strong>
                <span>{date}</span>
            </div>
        );
    }

    function renderPlanDetails(label, value) {
        return (
            <>
                <strong className={styles.label}>{label}: </strong>
                <span className={styles.value}>{value}</span>
            </>
        );
    }
}
