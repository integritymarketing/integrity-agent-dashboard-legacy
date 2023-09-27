import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import { Helmet } from "react-helmet-async";
import * as Sentry from "@sentry/react";
import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import LeadInformationProvider from "hooks/useLeadInformation";

import Container from "components/ui/container";
import GlobalNav from "partials/global-nav-v2";
import ContactFooter from "partials/global-footer";
import clientsService from "services/clientsService";
import styles from "../ContactsPage.module.scss";
import "./contactRecordInfo.scss";
import OverviewIcon from "components/icons/home";
import DetailsIcon from "components/icons/person";
import PreferencesIcon from "components/icons/settings";
import Warning from "components/icons/warning";
import PersonalInfo from "./PersonalInfo";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import WithLoader from "components/ui/WithLoader";
import { StageStatusProvider } from "contexts/stageStatus";
import BackNavContext from "contexts/backNavProvider";
import Overview from "./Overview";
import Preferences from "./Preferences";
import Details from "./Details";
import analyticsService from "services/analyticsService";
import { Button } from "components/ui/Button";
import SOAicon from "components/icons/soa";
import ScopeOfAppointment from "./soaList/ScopeOfAppointment";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import AddZip from "./modals/AddZip";
import { STATES } from "utils/address";
import { debounce } from "debounce";
import MobileMenu from "mobile/Contact/OverView/Menu";
import Media from "react-media";
import FooterBanners from "packages/FooterBanners";
import ViewAvailablePlans from "./viewAvailablePlans";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import closeAudio from "../../../components/WebChat/close.mp3";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  addProviderModalAtom,
  showViewAvailablePlansAtom,
} from "recoil/providerInsights/atom.js";
import useFetch from "hooks/useFetch";
import WebChatComponent from "components/WebChat/WebChat";
import ReviewProviders from "./viewAvailablePlans/steps/ReviewProviders";
import useAwaitingQueryParam from "hooks/useAwaitingQueryParam";

const ContactRecordInfoDetails = () => {
  const { contactId: id, sectionId } = useParams();
  const { getLeadDetails, isLoading, leadDetails } = useContactDetails(id);
  const { state = {} } = useLocation();
  const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);
  const [duplicateLeadIdName, setDuplicateLeadIdName] = useState();
  const [personalInfo, setPersonalInfo] = useState({ addresses: [] });
  const [reminders, setReminders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(sectionId);
  const [menuToggle, setMenuToggle] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isZipAlertOpen, setisZipAlertOpen] = useState(false);
  const [allCounties, setAllCounties] = useState([]);
  const [rXToSpecialists, setRXToSpecialists] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [county, setCounty] = useState("");
  const [countyError, setCountyError] = useState(false);
  const [submitEnable, setSubmitEnable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showViewAvailablePlans, setShowViewAvailablePlans] = useRecoilState(
    showViewAvailablePlansAtom
  );
  const [prescriptions, setPrescriptions] = useState([]);
  const [providers, setProviders] = useState([]);
  const { setCurrentPage } = useContext(BackNavContext);
  const history = useHistory();
  const { path } = useRouteMatch();
  const showViewAvailablePlansRef = useRef(showViewAvailablePlans);
  const audioRefClose = useRef(null);
  const isAddProviderModalOpen = useRecoilValue(addProviderModalAtom);
  const shouldShowAskIntegrity = useRecoilValue(showViewAvailablePlansAtom);
  const { Post: postSpecialists } = useFetch(
    `${process.env.REACT_APP_QUOTE_URL}/Rxspecialists/${id}?api-version=1.0`
  );
  const { isAwaiting, deleteAwaitingParam } = useAwaitingQueryParam();

  useEffect(() => {
    setCurrentPage("Contact Detail Page");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const autoUpdateDetails = async (data) => {
    let zipcode = data?.addresses?.[0]?.postalCode;
    let county = data?.addresses?.[0]?.county;
    if (zipcode && !county) {
      const countiesList = await fetchCounty(zipcode);
      if (countiesList?.all_Counties?.length === 1) {
        await clientsService
          .updateLeadCounty(
            data,
            countiesList?.all_Counties[0]?.value,
            countiesList?.all_Counties[0]?.key,
            zipcode,
            countiesList?.all_States[0]?.value
          )
          .then(() => {
            setisZipAlertOpen(false);
            getLeadDetails();
          });
      }
    }
  };

  const getContactRecordInfo = useCallback(
    async (leadDetails) => {
      if (!sectionId) {
        if (isAwaiting) {
          setDisplay("scopeofappointments");
          deleteAwaitingParam();
        } else {
          setDisplay("overview");
        }
      }
      setLoading(true);
      if (leadDetails?.length === 0) {
        return;
      }
      try {
        const data = leadDetails;
        setPersonalInfo(data);
        setReminders(data.reminders);
        setActivities(data.activities);
        autoUpdateDetails(data);
        const { firstName, lastName, leadsId, emails, phones } = data;
        const email = emails?.[0]?.leadEmail ?? "";
        const leadPhone = phones?.[0]?.leadPhone ?? "";
        const leadPhoneLabel = phones?.[0]?.phoneLabel ?? "";
        const phone = { leadPhone, leadPhoneLabel };
        const values = {
          firstName,
          lastName,
          phones: phone,
          email,
          leadId: leadsId,
        };
        const response = await clientsService.getDuplicateContact(values);
        if (response.ok) {
          const resMessage = await response.json();
          const duplicateLeadIds = resMessage.duplicateLeadIds;
          if (duplicateLeadIds.length === 1) {
            const getFullNameById = await clientsService.getContactInfo(
              duplicateLeadIds[0]
            );
            const { firstName, middleName, lastName } = getFullNameById;
            setDuplicateLeadIdName(
              `${firstName} ${middleName || ""} ${lastName}`
            );
            if (resMessage.isPartialDuplicate && duplicateLeadIds[0] !== id) {
              setDuplicateLeadIds(duplicateLeadIds);
            }
          } else {
            if (resMessage.isPartialDuplicate && duplicateLeadIds[0] !== id) {
              setDuplicateLeadIds(duplicateLeadIds);
            }
          }
        }
      } catch (e) {
        Sentry.captureException(e);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  useEffect(() => {
    if (path === `/contact/${id}`) {
      setLoading(isLoading);
      history.push(`/contact/${id}/${display}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, id]);

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/contact-record-note-edit/",
    });
    getContactRecordInfo(leadDetails);
    setEdit(state.isEdit);
  }, [getContactRecordInfo, state.isEdit, state.display, leadDetails]);

  const handleRendering = () => {
    let props = {
      id,
      personalInfo,
      reminders,
      setDisplay,
      activities,
      setEdit,
      isEdit,
      getLeadDetails,
      isMobile: isMobile,
    };
    switch (display) {
      case "overview":
        return <Overview {...props} />;
      case "details":
        return <Details {...props} getContactRecordInfo={getLeadDetails} />;
      case "scopeofappointments":
        return <ScopeOfAppointment {...props} />;
      case "preferences":
        return <Preferences {...props} />;
      default:
        return <Overview {...props} />;
    }
  };

  const handleDisplay = (page) => {
    if (menuToggle) {
      setDisplay(page);
      setMenuToggle(false);
    } else {
      setMenuToggle(true);
    }
  };

  const handleMultileDuplicates = () => {
    if (duplicateLeadIds.length) {
      window.localStorage.setItem(
        "duplicateLeadIds",
        JSON.stringify(duplicateLeadIds)
      );
    }
    return true;
  };

  const isLoad = loading;

  const handleZipDetails = () => {
    setMenuToggle(false);
    const postalCode = personalInfo?.addresses?.[0]?.postalCode;
    const stateCode = personalInfo?.addresses?.[0]?.stateCode;
    const county = personalInfo?.addresses?.[0]?.county;
    const countyFips = personalInfo?.addresses?.[0]?.countyFips;
    if (!postalCode || !stateCode || !county || !countyFips) {
      setisZipAlertOpen(true);
    }
  };

  const fetchCounty = useCallback(async (zipcode) => {
    const counties = (await clientsService.getCounties(zipcode)) || [];

    const all_Counties = counties.map((county) => ({
      value: county.countyName,
      label: county.countyName,
      key: county.countyFIPS,
    }));

    const uniqueStatesSet = new Set(counties.map((county) => county.state));
    const uniqueStates = [...uniqueStatesSet];

    const all_States = uniqueStates.map((state) => {
      const stateNameObj = STATES.find((s) => s.value === state);
      return {
        label: stateNameObj?.label,
        value: state,
      };
    });

    return { all_Counties, all_States };
  }, []);

  const fetchCounties = useCallback(
    async (zipcode) => {
      if (zipcode) {
        const countiesList = await fetchCounty(zipcode);
        if (countiesList) {
          setAllCounties([...(countiesList?.all_Counties || [])]);
          setAllStates([...(countiesList?.all_States || [])]);
          setSubmitEnable(false);
        } else {
          setAllCounties([]);
          setAllStates([]);
          setSubmitEnable(false);
        }
      }
    },
    [fetchCounty, setAllCounties, setAllStates, setSubmitEnable]
  );
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceZipFn = useCallback(debounce(fetchCounties, 1000), []);

  const handleZipCode = (zipcode) => {
    setSubmitEnable(true);
    debounceZipFn(zipcode);
  };

  const updateCounty = async (county, fip, zip, state) => {
    await clientsService
      .updateLeadCounty(personalInfo, county, fip, zip, state)
      .then(() => {
        setisZipAlertOpen(false);
        getLeadDetails();
      });
  };

  const handleUpdateZip = async (zip) => {
    if (allCounties.length === 1) {
      const county = allCounties?.[0]?.value;
      const fip = allCounties?.[0]?.key;
      const state = allStates[0]?.value;
      updateCounty(county, fip, zip, state);
    } else {
      if (county) {
        const fip = allCounties.filter((item) => item.value === county)[0]?.key;
        const state = allStates[0]?.value;
        updateCounty(county, fip, zip, state);
      } else {
        setCountyError(true);
      }
    }
  };

  useOnClickOutside(showViewAvailablePlansRef, () => {
    if (isAddProviderModalOpen === false) {
      setShowViewAvailablePlans(false);
      playCloseAudio();
    }
  });

  const playCloseAudio = () => {
    if (audioRefClose.current) {
      audioRefClose.current.play().catch((error) => {
        console.error("Error playing open audio:", error);
      });
    }
  };

  const handleViewAvailablePlans = async () => {
    setLoading(true);
    const { leadsId, birthdate, shouldHideSpecialistPrompt } = personalInfo;
    try {
      const [prescriptions, { providers }] = await Promise.all([
        clientsService.getLeadPrescriptions(leadsId),
        clientsService.getLeadProviders(leadsId),
      ]);
      const payload = {
        birthDate: birthdate,
        rxDetails: prescriptions?.map(({ dosage: { ndc, drugName } }) => ({
          ndc,
          drugName,
        })),
        providerDetails: providers?.map(({ presentationName, specialty }) => ({
          providerName: presentationName,
          providerSpecialty: specialty,
        })),
      };
      const data = await postSpecialists(payload);
      const shouldShowSpecialistPrompt =
        prescriptions?.length > 0 &&
        providers?.length > 0 &&
        !shouldHideSpecialistPrompt &&
        data?.shouldShow;
      if (shouldShowSpecialistPrompt) {
        setPrescriptions(prescriptions);
        setProviders(providers);
        setMenuToggle(false);
        setShowViewAvailablePlans(true);
        setRXToSpecialists(data);
      } else {
        history.push(`/plans/${id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshContactInfo = async () => {
    await getLeadDetails();
  };

  const handleViewPlans = () => {
    const postalCode = personalInfo?.addresses?.[0]?.postalCode;
    const stateCode = personalInfo?.addresses?.[0]?.stateCode;
    const county = personalInfo?.addresses?.[0]?.county;
    const countyFips = personalInfo?.addresses?.[0]?.countyFips;

    if (postalCode && stateCode && county && countyFips) {
      return (
        <Button
          disabled={showViewAvailablePlans}
          label="View Available Plans"
          onClick={handleViewAvailablePlans}
          type="primary"
          style={{
            borderRadius: "50px",
            background: "#4178FF",
            border: "none",
          }}
        />
      );
    } else
      return (
        <Button
          label="Add State/Zip to view plans"
          type="primary"
          disabled={false}
          onClick={handleZipDetails}
          style={{ borderRadius: "50px" }}
        />
      );
  };
  const { firstName, lastName, birthdate, leadsId } = personalInfo;
  const toSentenceCase = (name) =>
    name?.charAt(0).toUpperCase() + name?.slice(1).toLowerCase();
  const fullName = `${toSentenceCase(firstName)} ${toSentenceCase(lastName)}`;

  return (
    <React.Fragment>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <LeadInformationProvider leadId={id}>
        <ToastContextProvider>
          <WithLoader isLoading={isLoad}>
            <StageStatusProvider>
              <Helmet>
                <title>MedicareCENTER - Contacts</title>
              </Helmet>
              <GlobalNav />
              <audio ref={audioRefClose} src={closeAudio} />
              {showViewAvailablePlans && (
                <>
                  <ViewAvailablePlans
                    providers={providers}
                    prescriptions={prescriptions}
                    fullName={fullName}
                    birthdate={birthdate}
                    leadsId={leadsId}
                    showViewAvailablePlansRef={showViewAvailablePlansRef}
                    showViewAvailablePlans={showViewAvailablePlans}
                    personalInfo={personalInfo}
                    refreshAvailablePlans={handleViewAvailablePlans}
                    rXToSpecialists={rXToSpecialists}
                    setShowViewAvailablePlans={setShowViewAvailablePlans}
                  />
                </>
              )}
              {duplicateLeadIds.length === 1 && (
                <section className={`${styles["duplicate-contact-link"]} pl-1`}>
                  <Warning />
                  <span className="pl-1">
                    The entry is a potential duplicate to&nbsp;&nbsp;
                    <a
                      href={`/contact/${duplicateLeadIds}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {duplicateLeadIdName ?? "this contact link."}
                    </a>
                  </span>
                </section>
              )}
              {duplicateLeadIds.length > 1 && (
                <section className={`${styles["duplicate-contact-link"]} pl-1`}>
                  <Warning />
                  <span className="pl-1">
                    The entry is a potential duplicate to&nbsp;&nbsp;
                    <a
                      onClick={handleMultileDuplicates}
                      href={`/contacts/list`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      these contacts
                    </a>
                  </span>
                </section>
              )}

              <PersonalInfo
                personalInfo={personalInfo}
                setEdit={setEdit}
                isEdit={isEdit}
                setDisplay={setDisplay}
                leadsId={id}
                refreshContactDetails={getLeadDetails}
              />

              <div className="details-card-main">
                <Container className={styles.container}>
                  {isMobile ? (
                    <MobileMenu
                      handleDisplay={handleDisplay}
                      handleViewPlans={handleViewPlans}
                      display={display}
                      setMenuToggle={setMenuToggle}
                      menuToggle={menuToggle}
                      showViewAvailablePlans={showViewAvailablePlans}
                    />
                  ) : (
                    <ul
                      className="leftcardmenu desktop-menu-hide"
                      data-gtm="contact-record-menu-item"
                    >
                      <li
                        className={display === "overview" ? "active" : ""}
                        onClick={() => {
                          setDisplay("overview");
                        }}
                      >
                        <label className="icon-spacing">
                          <OverviewIcon />
                        </label>
                        <span>Overview</span>
                      </li>
                      <li
                        className={
                          display === "details" || display === "DetailsEdit"
                            ? "active"
                            : ""
                        }
                        onClick={() => setDisplay("details")}
                      >
                        <label className="icon-spacing">
                          <DetailsIcon />
                        </label>
                        <span>Details</span>
                      </li>
                      <li
                        className={
                          display === "scopeofappointments" ? "active" : ""
                        }
                        onClick={() => setDisplay("scopeofappointments")}
                      >
                        <label className="icon-spacing">
                          <SOAicon />
                        </label>
                        <span>Scope Of Appointments</span>
                      </li>
                      <li
                        className={display === "preferences" ? "active" : ""}
                        onClick={() => setDisplay("preferences")}
                      >
                        <label className="icon-spacing">
                          <PreferencesIcon />
                        </label>
                        <span>Preferences </span>
                      </li>
                      <li className="plans-button">{handleViewPlans(false)}</li>
                    </ul>
                  )}
                  <div className="rightSection">
                    {handleRendering()}
                    <div className={"footerContainer"}>
                      <FooterBanners
                        className={"footerBanners"}
                        type={isMobile ? "column" : "row"}
                      />
                    </div>
                  </div>
                  <AddZip
                    isOpen={isZipAlertOpen}
                    onClose={() => setisZipAlertOpen(false)}
                    updateZip={handleUpdateZip}
                    address={[
                      personalInfo?.addresses?.[0]?.address1,
                      personalInfo?.addresses?.[0]?.address2,
                      personalInfo?.addresses?.[0]?.city,
                      personalInfo?.addresses?.[0]?.stateCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    handleZipCode={handleZipCode}
                    zipCode={personalInfo?.addresses?.[0]?.postalCode}
                    allCounties={allCounties}
                    county={county}
                    setCounty={setCounty}
                    countyError={countyError}
                    submitEnable={submitEnable}
                  />
                  {!shouldShowAskIntegrity && <WebChatComponent />}
                  {!isLoading && !loading && isAddProviderModalOpen && (
                    <ReviewProviders
                      providers={providers}
                      prescriptions={prescriptions}
                      fullName={fullName}
                      birthdate={birthdate}
                      leadsId={leadsId}
                      personalInfo={personalInfo}
                      rXToSpecialists={rXToSpecialists}
                      setShowViewAvailablePlans={setShowViewAvailablePlans}
                      refreshContactInfo={handleRefreshContactInfo}
                      isAddProviderModalOpen={isAddProviderModalOpen}
                    />
                  )}
                </Container>
              </div>
              <ContactFooter />
            </StageStatusProvider>
          </WithLoader>
        </ToastContextProvider>
      </LeadInformationProvider>
    </React.Fragment>
  );
};

export default ContactRecordInfoDetails;
