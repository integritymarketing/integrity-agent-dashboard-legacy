/* eslint-disable max-lines-per-function */
import React, { useCallback, useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import * as Sentry from "@sentry/react";
import { useParams, useLocation, useNavigate, useMatch } from "react-router-dom";

import Media from "react-media";
import styles from "../ContactsPage.module.scss";
import PersonalInfo from "./PersonalInfo";
import Overview from "./Overview";
import Preferences from "./Preferences";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav-v2";
import ContactFooter from "partials/global-footer";
import clientsService from "services/clientsService";
import "./contactRecordInfo.scss";
import OverviewIcon from "components/icons/home";
import DetailsIcon from "components/icons/person";
import PreferencesIcon from "components/icons/settings";
import Warning from "components/icons/warning";
import WithLoader from "components/ui/WithLoader";
import { StageStatusProvider } from "contexts/stageStatus";
import BackNavContext from "contexts/backNavProvider";
import Details from "./Details";
import analyticsService from "services/analyticsService";
import { Button } from "components/ui/Button";
import SOAicon from "components/icons/soa";
import ScopeOfAppointment from "./soaList/ScopeOfAppointment";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import { STATES } from "utils/address";
import MobileMenu from "mobile/Contact/OverView/Menu";
import FooterBanners from "packages/FooterBanners";
import WebChatComponent from "components/WebChat/WebChat";
import useAwaitingQueryParam from "hooks/useAwaitingQueryParam";
import EnrollmentHistoryContainer from "components/EnrollmentHistoryContainer/EnrollmentHistoryContainer";
import PlansTypeModal from "components/PlansTypeModal";

const ContactRecordInfoDetails = () => {
    const { contactId: id, sectionId } = useParams();
    const { getLeadDetails, leadDetails } = useContactDetails(id);
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
    const [isMobile, setIsMobile] = useState(false);
    const { setCurrentPage } = useContext(BackNavContext);
    const navigate = useNavigate();
    const match = useMatch(`/contact/${id}/*`);
    const { isAwaiting, deleteAwaitingParam } = useAwaitingQueryParam();
    const [openPlanType, setOpenPlanType] = useState(false);

    useEffect(() => {
        setCurrentPage("Contact Detail Page");
    }, []);

    const autoUpdateDetails = async (data) => {
        const zipcode = data?.addresses?.[0]?.postalCode;
        const dataCounty = data?.addresses?.[0]?.county;
        if (zipcode && !dataCounty) {
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
        async (_leadDetails) => {
            if (!sectionId) {
                if (isAwaiting) {
                    setDisplay("scopeofappointments");
                    deleteAwaitingParam();
                } else {
                    setDisplay("overview");
                }
            }
            setLoading(true);
            if (_leadDetails?.length === 0) {
                return;
            }
            try {
                const data = _leadDetails;
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
                    const _duplicateLeadIds = resMessage.duplicateLeadIds;
                    if (_duplicateLeadIds.length === 1) {
                        const getFullNameById = await clientsService.getContactInfo(_duplicateLeadIds[0]);
                        // eslint-disable-next-line no-shadow
                        const { firstName, middleName, lastName } = getFullNameById;
                        setDuplicateLeadIdName(`${firstName} ${middleName || ""} ${lastName}`);
                        if (resMessage.isPartialDuplicate && _duplicateLeadIds[0] !== id) {
                            setDuplicateLeadIds(_duplicateLeadIds);
                        }
                    } else {
                        if (resMessage.isPartialDuplicate && _duplicateLeadIds[0] !== id) {
                            setDuplicateLeadIds(_duplicateLeadIds);
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
        if (match) {
            navigate(`/contact/${id}/${display}`, { replace: true });
        }
    }, [navigate, match, display, id]);

    useEffect(() => {
        analyticsService.fireEvent("event-content-load", {
            pagePath: "/contact-record-note-edit/",
        });
        getContactRecordInfo(leadDetails);
        setEdit(state?.isEdit);
    }, [getContactRecordInfo, state?.isEdit, state?.display, leadDetails]);

    const handleRendering = () => {
        const props = {
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
            case "policies":
                return <EnrollmentHistoryContainer leadId={id} />;
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
            window.localStorage.setItem("duplicateLeadIds", JSON.stringify(duplicateLeadIds));
        }
        return true;
    };

    const isLoad = loading;

    const handleZipDetails = () => {
        setMenuToggle(false);
        navigate(`/contact/${id}/addZip`);
    };

    const fetchCounty = useCallback(async (zipcode) => {
        const counties = (await clientsService.getCounties(zipcode)) || [];

        const all_Counties = counties.map((_county) => ({
            value: _county.countyName,
            label: _county.countyName,
            key: _county.countyFIPS,
        }));

        const uniqueStatesSet = new Set(counties.map((_county) => _county.state));
        const uniqueStates = [...uniqueStatesSet];

        const all_States = uniqueStates.map((_state) => {
            const stateNameObj = STATES.find((s) => s.value === _state);
            return {
                label: stateNameObj?.label,
                value: _state,
            };
        });

        return { all_Counties, all_States };
    }, []);
    const handleClickHealthPlan = () => {
        setOpenPlanType(false);
        navigate(`/plans/${id}`);
      };
        const handleClickFinalExpense = () => {
        setOpenPlanType(false);
        navigate(`/finalexpenses/create/${id}`);
        };
    const handleViewAvailablePlans = () => {
        if (process.env.REACT_APP_SHOW_FINAL_EXPENSE === "true") {
            setOpenPlanType(true);
          } else {
            navigate(`/plans/${id}`);
          }
    };

    const handleViewPlans = () => {
        const postalCode = personalInfo?.addresses?.[0]?.postalCode;
        const stateCode = personalInfo?.addresses?.[0]?.stateCode;
        const _county = personalInfo?.addresses?.[0]?.county;
        const countyFips = personalInfo?.addresses?.[0]?.countyFips;

        if (postalCode && stateCode && _county && countyFips) {
            return (
                <Button
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
        } else {
            return (
                <Button
                    label="Add State/Zip to view plans"
                    type="primary"
                    disabled={false}
                    onClick={handleZipDetails}
                    style={{ borderRadius: "50px" }}
                />
            );
        }
    };

    return (
        <React.Fragment>
            <Media
                query={"(max-width: 500px)"}
                onChange={(_isMobile) => {
                    setIsMobile(_isMobile);
                }}
            />
            <StageStatusProvider>
                <WithLoader isLoading={isLoad}>
                    <Helmet>
                        <title>MedicareCENTER - Contacts</title>
                    </Helmet>
                    <GlobalNav />
                    {duplicateLeadIds.length === 1 && (
                        <section className={`${styles["duplicate-contact-link"]} pl-1`}>
                            <Warning />
                            <span className="pl-1">
                                The entry is a potential duplicate to&nbsp;&nbsp;
                                <a href={`/contact/${duplicateLeadIds}`} target="_blank" rel="noopener noreferrer">
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
                    <PlansTypeModal
                isModalOpen={openPlanType}
                handleHealthPlanClick={handleClickHealthPlan}
                handleFinalExpensePlanClick={handleClickFinalExpense}
                handleModalClose={() => {
                    setOpenPlanType(false);
                }}
            />
                        <Container className={styles.container}>
                            {isMobile ? (
                                <MobileMenu
                                    handleDisplay={handleDisplay}
                                    handleViewPlans={handleViewPlans}
                                    display={display}
                                    setMenuToggle={setMenuToggle}
                                    menuToggle={menuToggle}
                                />
                            ) : (
                                <ul className="leftcardmenu desktop-menu-hide" data-gtm="contact-record-menu-item">
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
                                            display === "details" || display === "DetailsEdit" ? "active" : ""
                                        }
                                        onClick={() => setDisplay("details")}
                                    >
                                        <label className="icon-spacing">
                                            <DetailsIcon />
                                        </label>
                                        <span>Details</span>
                                    </li>
                                    <li
                                        className={display === "scopeofappointments" ? "active" : ""}
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
                                    <FooterBanners className={"footerBanners"} type={isMobile ? "column" : "row"} />
                                </div>
                            </div>
                            <WebChatComponent />
                        </Container>
                    </div>
                    <ContactFooter />
                </WithLoader>
            </StageStatusProvider>
        </React.Fragment>
    );
};

export default ContactRecordInfoDetails;
