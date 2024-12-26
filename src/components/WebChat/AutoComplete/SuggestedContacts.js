import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Spinner from "../../ui/Spinner";
import { capitalizeFirstLetter } from "utils/shared-utils/sharedUtility";
import { formatDate } from "utils/dates";
import { formatPhoneNumber } from "utils/phones";
import "./SuggestedContacts.scss";
import { formatAddress } from "utils/addressFormatter";
import ChatIconPrompt from "../chat-icon-prompt.png";

const SuggestedContacts = ({ suggestedContacts, isContactsLoading, onContactSelect, initiateChat }) => {
    const mainRef = useRef(null);
    const [calculatedHeight, setCalculatedHeight] = useState("auto");
    const DEFAULT_PROMPT_ICON_HEIGHT = "75px";
    const [promptIconCalculatedHeight, setPromptIconCalculatedHeight] = useState(DEFAULT_PROMPT_ICON_HEIGHT);

    useEffect(() => {
        const adjustHeight = () => {
            setPromptIconCalculatedHeight(DEFAULT_PROMPT_ICON_HEIGHT);
            if (mainRef.current) {
                if (isContactsLoading) {
                    const suggestedContactsContainer = mainRef.current.querySelector(".suggestedContactsContainer");
                    setPromptIconCalculatedHeight(`${suggestedContactsContainer.offsetHeight + 93}px`);
                } else {
                    const entries = mainRef.current.querySelectorAll(".contactEntry");
                    let totalHeight = 0;

                    for (let i = 0; i < Math.min(entries.length, 3); i++) {
                        totalHeight += entries[i].offsetHeight;
                    }
                    const maxHeight = window.innerHeight - 263;
                    setCalculatedHeight(`${Math.min(totalHeight, maxHeight)}px`);
                    setPromptIconCalculatedHeight(`${Math.min(totalHeight, maxHeight) + 93}px`);
                }
            }
        };

        adjustHeight();
        window.addEventListener("resize", adjustHeight);
        return () => {
            window.removeEventListener("resize", adjustHeight);
        };
    }, [isContactsLoading, suggestedContacts]);

    const showPromptIcon = () => (
        <div className="webchatCenterIconWrapper" style={{ bottom: promptIconCalculatedHeight }}>
            <div className="webchatCenterIcon">
                <img
                    className="webchatCenterIconImage"
                    src={ChatIconPrompt}
                    onClick={initiateChat}
                    alt="Integrity Icon"
                />
            </div>
        </div>
    );

    return (
        <>
            {showPromptIcon()}
            {isContactsLoading ? (
                <div className="suggestedContactsMain" ref={mainRef}>
                    <div className="suggestedContactsContainer">
                        <div className="spinnerContainer">
                            <Spinner />
                        </div>
                    </div>
                </div>
            ) : suggestedContacts?.length > 0 ? (
                <div className="suggestedContactsMain" ref={mainRef}>
                    <div className="suggestedContactsContainer" style={{ height: calculatedHeight }}>
                        {suggestedContacts.map(
                            (
                                {
                                    leadsId,
                                    firstName,
                                    lastName,
                                    addresses,
                                    birthdate,
                                    primaryCommunication,
                                    phones,
                                    emails,
                                },
                                index
                            ) => {
                                const contact =
                                    primaryCommunication === "email"
                                        ? emails[0]?.leadEmail
                                        : formatPhoneNumber(phones[0]?.leadPhone) || "";
                                const address = addresses[0];

                                return (
                                    <div
                                        className="contactEntry"
                                        key={index}
                                        onClick={() =>
                                            onContactSelect(
                                                `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
                                                    lastName
                                                )}`,
                                                `${leadsId}`
                                            )
                                        }
                                    >
                                        <div className="contactDetails">
                                            <div className="contactName">
                                                <p className="contactNameText">{`${capitalizeFirstLetter(
                                                    firstName
                                                )} ${capitalizeFirstLetter(lastName)}`}</p>
                                            </div>
                                            {address && (
                                                <div className="contactAddress">
                                                    <p className="contactAddressText">
                                                        <span className="contactLabel">Address:</span>
                                                        <span className="contactValue">
                                                            {formatAddress({
                                                                city: address.city,
                                                                stateCode: address.stateCode,
                                                                postalCode: address.postalCode,
                                                            })}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                            {birthdate && (
                                                <div className="contactBirthdate">
                                                    <p className="contactBirthdateText">
                                                        <span className="contactLabel">Birthdate:</span>{" "}
                                                        <span className="contactValue">{formatDate(birthdate)}</span>
                                                    </p>
                                                </div>
                                            )}
                                            {contact && (
                                                <div className="contactContact">
                                                    <p className="contactContactText">
                                                        <span className="contactLabel">Contact:</span>{" "}
                                                        <span className="contactValue">{contact}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="iconWrapper">
                                            <img
                                                className="continueIcon"
                                                src="https://askintegrityasset.blob.core.windows.net/images/mc-arrow-list.png"
                                                alt="continue-icon"
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            ) : null}
        </>
    );
};

SuggestedContacts.propTypes = {
    suggestedContacts: PropTypes.array.isRequired,
    isContactsLoading: PropTypes.bool.isRequired,
    onContactSelect: PropTypes.func.isRequired,
    initiateChat: PropTypes.func.isRequired,
};

export default SuggestedContacts;
