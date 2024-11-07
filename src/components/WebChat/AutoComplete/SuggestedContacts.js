import PropTypes from "prop-types";
import Spinner from "../../ui/Spinner";
import { capitalizeFirstLetter } from "utils/shared-utils/sharedUtility";
import { formatDate } from "utils/dates";
import { formatPhoneNumber } from "utils/phones";
import "./SuggestedContacts.scss";
import { formatAddress } from "utils/addressFormatter";

const SuggestedContacts = ({
  suggestedContacts,
  isContactsLoading,
  onContactSelect
}) => {
  return (
    isContactsLoading ? (
      <div className="suggestedContactsMain">
        <div className="suggestedContactsContainer">
          <div className="spinnerContainer">
            <Spinner />
          </div>
        </div>
      </div>
    ) : (
      suggestedContacts?.length > 0 && (
        <div className="suggestedContactsMain">
          <div className="suggestedContactsContainer">
            {suggestedContacts.map(
              (
                {
                  firstName,
                  lastName,
                  addresses,
                  birthdate,
                  primaryCommunication,
                  phones,
                  emails
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
                        `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`
                      )
                    }
                  >
                    <div className="contactDetails">
                      <div className="contactName">
                        <p className="contactNameText">{`${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`}</p>
                      </div>
                      {address && (
                        <div className="contactAddress">
                          <p className="contactAddressText">
                            <span className="contactLabel">Address:</span>
                            <span className="contactValue">{formatAddress({
                              city: address.city,
                              stateCode: address.stateCode,
                              postalCode: address.postalCode
                            })}</span>
                          </p>
                        </div>
                      )}
                      {birthdate && (
                        <div className="contactBirthdate">
                          <p className="contactBirthdateText">
                            <span className="contactLabel">Birthdate:</span> <span className="contactValue">{formatDate(birthdate)}</span>
                          </p>
                        </div>
                      )}
                      {contact && (
                        <div className="contactContact">
                          <p className="contactContactText">
                            <span className="contactLabel">Contact:</span> <span className="contactValue">{contact}</span>
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
      )
    )
  );
};

SuggestedContacts.propTypes = {
  suggestedContacts: PropTypes.array.isRequired,
  isContactsLoading: PropTypes.bool.isRequired,
  onContactSelect: PropTypes.func.isRequired
};

export default SuggestedContacts;
