import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Link from "../Icons/relink";
import { TaskListCard } from "../../Tasklist/TaskListCardContainer";
import OpenIcon from "components/icons/open";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";
import styles from "./UnlinkedPoliciesMobileList.module.scss";

export default function UnlinkedPolicyMobileList({ policyList, npn }) {
    const navigate = useNavigate();
    const showToast = useToast();
    const { enrollPlansService } = useClientServiceContext();

    const handleLinkToContact = useCallback(
        async (item) => {
            try {
                const data = await enrollPlansService.getBookOfBusinessBySourceId(npn, item?.sourceId);
                const stateData = data
                    ? {
                          ...data,
                          page: "Dashboard",
                          policyHolder: `${data.consumerFirstName} ${data.consumerLastName}`,
                      }
                    : {
                          ...item,
                          page: "Dashboard",
                          policyHolder: item?.policyHolder || "",
                      };

                navigate("/enrollment-link-to-contact", { state: stateData });
            } catch (error) {
                showToast({
                    type: "error",
                    message: "Failed to get enroll plan info.",
                    time: 10000,
                });
            }
        },
        [enrollPlansService, npn, navigate, showToast]
    );

    const navigateEnrollDetails = useCallback(async () => {
        try {
            navigate(`/enrollmenthistory/${leadId}/${confirmationNumber}/${policyEffectiveDate}`, {
                state: props,
            });
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to get enroll plan info.",
                time: 10000,
            });
        }
    }, [navigate, showToast]);

    return (
        <>
            {policyList?.map((item, index) => {
                return (
                    <TaskListCard key={index} multi={policyList?.length > 1} background="blue">
                        <Box className={styles.taskListInfo}>
                            <div className={styles.policyName}> {item?.planName}</div>
                            <Box marginTop={"10px"}>
                                <div className={styles.dateTimeLabel}>
                                    Policy ID:
                                    <span className={styles.taskSentDate}> {item?.policyNumber}</span>
                                </div>
                                <div className={styles.dateTimeLabel}>
                                    Carrier:
                                    <span className={styles.taskSentDate}> {item?.carrier}</span>
                                </div>
                            </Box>
                            <Box marginTop={"10px"}>
                                <div className={styles.dateTimeLabel}>Policy Holder</div>
                                <div className={styles.policyHolder}>{item?.policyHolder}</div>
                            </Box>
                        </Box>
                        <Box className={styles.taskListIcons}>
                            <div className={styles.taskListIcon} onClick={() => handleLinkToContact(item)}>
                                <Link />
                            </div>
                            {item?.hasPlanDetails && (
                                <div
                                    className={`${styles.taskListIcon} ${styles.downloadIcon}`}
                                    onClick={navigateEnrollDetails}
                                >
                                    <OpenIcon color="#4178FF" />
                                </div>
                            )}
                        </Box>
                    </TaskListCard>
                );
            })}
        </>
    );
}
