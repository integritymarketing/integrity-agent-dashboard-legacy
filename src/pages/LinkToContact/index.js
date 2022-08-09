import ContactSearch from "./ContactSearch";
import DashboardHeaderSection from "pages/dashbaord/DashboardHeaderSection";
import DescriptionIcon from "@mui/icons-material/Description";
import Footer from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import Modal from "packages/Modal";
import React, { useState } from "react";
import Tags from "packages/Tags/Tags";
import clientService from "services/clientsService";
import styles from "./styles.module.scss";
import { Helmet } from "react-helmet-async";
import { TextButton } from "packages/Button";
import { Typography } from "@mui/material";
import Heading3 from "packages/Heading3";

export default function LinkToContact() {
  const [modalOpen, setModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);

  const getContacts = async (searchStr) => {
    const response = await clientService.getList(
      undefined,
      undefined,
      "Activities.CreateDate:desc",
      searchStr
    );
    if (response && response.result) {
      setContacts(response.result);
    }
  };

  const bannerContent = () => {
    return (
      <>
        <div>
          <Heading3 text={'Link to contact'}>
          </Heading3>
        </div>
        <div>
          <TextButton
            variant={"outlined"}
            size={"medium"}
            startIcon={<DescriptionIcon />}
            onClick={() => setModalOpen(true)}
          >
            Call Script
          </TextButton>
        </div>
      </>
    );
  };

  const modalContent = () => {
    return (
      <>
        <Typography id="transition-modal-title" variant="h5" color={"#002D72"}>
          Recorded Call Script
        </Typography>
        <div className={styles.upperSectionModal}>
          <Typography
            id="transition-modal-subtitle"
            variant="subtitle1"
            color={"#434A51"}
          >
            To be in compliance with CMS guidelines, please read this script
            before every call
          </Typography>
        </div>
        <div className={styles.lowerSectionModal}>
          <Typography
            id="transition-modal-description"
            sx={{ p: "16px" }}
            color={"#434A51"}
          >
            Donec id elit non mi porta gravida at eget metus. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor. Donec
            ullamcorper nulla non metus auctor fringilla. Nullam quis risus eget
            urna mollis ornare.
          </Typography>
        </div>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>MedicareCENTER - Link To Contact</title>
      </Helmet>
      <GlobalNav />
      <DashboardHeaderSection
        content={bannerContent()}
        justifyContent={"space-between"}
        padding={"0 15%"}
      />

      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.medContent}>
            <Typography sx={{ mx: 1 }} variant={"h5"}>
              Caller ID{" "}
            </Typography>
          </div>
          <div className={styles.medContent}>
            <Tags words={["CALL LEAD", "MAPD"]} flexDirection={"column"} />
          </div>
          <div className={styles.medContent}>
            <TextButton variant={"outlined"} size={"large"}>
              Create new contact
            </TextButton>
          </div>
          <div className={styles.medContent}>
            <ContactSearch onChange={getContacts} contacts={contacts} />
          </div>
        </div>
      </div>

      <Modal
        content={modalContent()}
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
      />
  <Footer />
    </>
  );
}
