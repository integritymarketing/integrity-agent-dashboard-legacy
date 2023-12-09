import React, { createContext, useState, useCallback, useMemo } from "react";
import useFetch from "hooks/useFetch";
import PropTypes from "prop-types";
import performAsyncOperation from "utilities/performAsyncOperation";
import useToast from "hooks/useToast";
import { getFormattedData } from "utilities/formatData";
import { parseDate, formatServerDate } from "utils/dates";

const flattenMBI = (mbi) => {
  if (!mbi) return null;
  return mbi.replace(/-/g, "");
};

const getFormattedPhone = (phone) =>
  phone ? ("" + phone).replace(/\D/g, "") : null;

export const LeadDetailsContext = createContext();

export const LeadDetailsProvider = ({ children }) => {
  const leadsApiUrl = `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Leads`;

  const {
    Get: fetchLeadDetails,
    loading: isLoadingLeadDetails,
    error: leadDetailsError,
    Put: editLeadDetails,
    Delete: deleteContact,
  } = useFetch(leadsApiUrl);

  const showToast = useToast();

  // selectedTab  state can be one of ["overview", "scopeOfAppointment", "policies", "health"]
  const [selectedTab, setSelectedTab] = useState("overview");
  const [leadDetails, setLeadDetails] = useState(null);
  const [leadDetailsloading, setLeadDetailsloading] = useState(false);

  const getLeadDetails = useCallback(
    async (leadId) => {
      try {
        const data = await fetchLeadDetails(null, false, leadId);
        if (data) setLeadDetails(data);
        else setLeadDetails(null);
      } catch (error) {
        console.error("Error fetching Lead details:", error);
        // Handle error appropriately here
      }
    },
    [fetchLeadDetails]
  );

  const updateLeadDetails = async (newPayload) => {
    const {
      firstName,
      middleName,
      lastName,
      birthdate,
      email,
      phones,
      address,
      primaryCommunication,
      contactRecordType,
      leadsId,
      leadStatusId,
      emailID,
      phoneId,
      leadAddressId,
      notes,
      medicareBeneficiaryID,
      partA,
      partB,
    } = newPayload;
    const reqData = {
      leadsId,
      firstName,
      middleName: middleName?.toUpperCase(),
      lastName,
      birthdate: birthdate ? formatServerDate(parseDate(birthdate)) : null,
      leadStatusId,
      primaryCommunication,
      contactRecordType,
      notes,
    };
    if (medicareBeneficiaryID) {
      reqData.medicareBeneficiaryID = flattenMBI(medicareBeneficiaryID);
    }
    if (partA) {
      reqData.partA = formatServerDate(partA);
    }
    if (partB) {
      reqData.partB = formatServerDate(partB);
    }
    reqData.emails = [];
    if (email !== null && email !== undefined) {
      reqData.emails = [
        {
          emailID: emailID,
          leadEmail: email,
        },
      ];
    }

    reqData.phones = [
      {
        phoneId: phoneId,
        ...phones,
        leadPhone: getFormattedPhone(phones.leadPhone),
      },
    ];

    reqData.addresses = [
      {
        leadAddressId: leadAddressId,
        ...address,
      },
    ];
    await performAsyncOperation(
      () => editLeadDetails(reqData, false, newPayload.leadsId),
      setLeadDetailsloading,
      async () => {
        await getLeadDetails(newPayload?.leadsId);
        showToast({
          message: `Lead updated successfully`,
        });
      },
      (err) =>
        showToast({
          type: "error",
          message: `Failed to update lead`,
        })
    );
  };

  const updateClientNotes = async (oldPayload, newPayload) => {
    const formattedData = getFormattedData(newPayload, oldPayload);
    await performAsyncOperation(
      () => editLeadDetails(formattedData, false, newPayload.leadsId),
      setLeadDetailsloading,
      async () => {
        await getLeadDetails(newPayload?.leadsId);
        showToast({
          message: `Client notes successfully Updated.                      `,
        });
      },
      (err) =>
        showToast({
          type: "error",
          message: `Failed to update lead`,
        })
    );
  };

  const removeContact = async (leadId, callBack) => {
    await performAsyncOperation(
      () => deleteContact(null, false, leadId),
      setLeadDetailsloading,
      () => {
        callBack();
      },
      (err) =>
        showToast({
          type: "error",
          message: `Failed to delete lead`,
        })
    );
  };

  const contextValue = useMemo(
    () => ({
      getLeadDetails,
      leadDetails,
      leadDetailsError,
      isLoadingLeadDetails,
      selectedTab,
      setSelectedTab,
      updateLeadDetails,
      removeContact,
      updateClientNotes,
    }),
    [
      getLeadDetails,
      leadDetails,
      leadDetailsError,
      isLoadingLeadDetails,
      selectedTab,
      setSelectedTab,
      removeContact,
      updateLeadDetails,
      updateClientNotes,
    ]
  );

  return (
    <LeadDetailsContext.Provider value={contextValue}>
      {children}
    </LeadDetailsContext.Provider>
  );
};

LeadDetailsProvider.propTypes = {
  children: PropTypes.node.isRequired, // PropTypes.node for validating React node types
};
