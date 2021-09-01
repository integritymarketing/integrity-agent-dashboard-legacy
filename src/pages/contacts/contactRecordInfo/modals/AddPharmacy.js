import React, { useEffect, useState } from "react";
import Modal from "components/ui/modal";
import { Select } from "components/ui/Select";
import Pagination from "components/ui/pagination";
import ExitIcon from "components/icons/exit";
import { Button } from "components/ui/Button";
import "./pharmacy-modal.scss";
import clientsService from "services/clientsService";
import analyticsService from "services/analyticsService";
import Spinner from "components/ui/Spinner";
import * as Sentry from "@sentry/react";

export default function AddPharmacy({ isOpen, onClose, personalInfo, onSave }) {
  const [zipCode, setZipCode] = useState(
    personalInfo?.addresses[0]?.postalCode
  );
  const [radius, setRadius] = useState("5");

  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [latLng, setLatLng] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const totalPages = results ? Math.ceil(results.total / perPage) : 0;

  useEffect(() => {
    if (isOpen) {
      analyticsService.fireEvent("event-modal-appear", {
        modalName: "Add Pharmacy",
      });
    }
  }, [isOpen]);
  useEffect(() => {
    if (!zipCode || zipCode?.length !== 5) {
      setIsLoading(false);
      setLatLng("");
      setError(null);
      setResults();
      return;
    }
    clientsService
      .getLatlongByAddress(zipCode, pharmacyAddress)
      .then((data) => {
        if (data?.features[0]?.center) {
          let latlan_value = data?.features[0]?.center.toString();
          setLatLng(latlan_value);
        } else {
          setLatLng("");
        }
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  }, [zipCode, pharmacyAddress]);

  useEffect(() => {
    if (!zipCode || zipCode?.length !== 5) {
      setIsLoading(false);
      setError(null);
      setResults([]);
      return;
    }

    let payload = {
      take: 5,
      skip: 0,
      fields: "",
      radius: radius,
      zip: zipCode,
      pharmacyName: pharmacyName,
      planPharmacyType: "",
      // latLng: "",
      pharmacyIDType: 0,
    };

    setIsLoading(true);
    clientsService
      .searchPharmacies(payload)
      .then((data) => {
        setIsLoading(false);
        if (data?.pharmacyList?.length > 0) {
          setResults(data?.pharmacyList);
        } else {
          setResults([]);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
      });
  }, [perPage, currentPage, pharmacyName, zipCode, radius, latLng]);

  const handleAddPharmacy = async () => {
    await onSave({
      pharmacyID: selectedPharmacy.pharmacyID,
      name: selectedPharmacy.name,
      address1: selectedPharmacy.address1,
      address2: selectedPharmacy.address2,
      city: selectedPharmacy.city,
      zip: selectedPharmacy.zip,
      state: selectedPharmacy.state,
      pharmacyPhone: selectedPharmacy.pharmacyPhone,
    });
    closeModal();
  };

  const closeModal = () => {
    setRadius(5);
    setSelectedPharmacy({});
    setPharmacyAddress("");
    setPharmacyName("");
    onClose();
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={closeModal}
        size="wide"
        labeledById="dialog_add_provider"
        providerModal={true}
        footer={
          <div className="dialog--actions-pr">
            {zipCode && totalPages > 1 ? (
              <Pagination
                providerPagination
                currentPage={currentPage}
                totalPages={totalPages - 1}
                totalResults={results?.total}
                pageSize={perPage}
                onPageChange={(pageIndex) => setCurrentPage(pageIndex)}
              />
            ) : (
              <div />
            )}
            <div className="buttons-wrapper">
              <div className="pr-cancl">
                <Button
                  label="Cancel"
                  onClick={closeModal}
                  style={{ marginRight: 10 }}
                  data-gtm="button-cancel"
                />
              </div>
              <div className="pr-add">
                {" "}
                <Button
                  disabled={!selectedPharmacy}
                  label="Add Pharmacy"
                  onClick={handleAddPharmacy}
                  data-gtm="button-save"
                />
              </div>
            </div>
          </div>
        }
      >
        <div className="dialog--container pharmacy-modal-dailog">
          <div className="dialog--title">
            <h2 id="dialog_help_label" className="hdg hdg--2 mb-1">
              Add Pharmacy
            </h2>
          </div>
          <div className="dialog--body pr-modal-container">
            <div className="pr-header-container">
              <div className="zip-section">
                <label className="pr-title">
                  ZIP Code
                  <input
                    type="text"
                    placeholder="Zip"
                    value={zipCode}
                    maxLength="5"
                    className={`${zipCode?.length < 5 && "zip-error"} zip-input`}
                    onChange={(e) => {
                      setZipCode(e.currentTarget.value);
                      setCurrentPage(1);
                    }}
                  />
                </label>
              </div>
              <div className="pr-search-section">
                <label className="pr-title">
                  Pharmacy Name
                  <input
                    type="text"
                    value={pharmacyName}
                    disabled={zipCode?.length < 5}
                    placeholder="Enter name"
                    onChange={(e) => {
                      setPharmacyName(e.currentTarget.value);
                      setCurrentPage(1);
                    }}
                  />
                </label>
              </div>
              <div className="pr-address-section">
                <label className="pr-title">
                  Pharmacy Address
                  <input
                    type="text"
                    value={pharmacyAddress}
                    disabled={zipCode?.length < 5}
                    placeholder="Enter address"
                    onChange={(e) => {
                      setPharmacyAddress(e.currentTarget.value);
                      setCurrentPage(1);
                    }}
                  />
                </label>
              </div>
              <div className="miles-section">
                <label className="pr-title">
                  Distance
                  <Select
                    placeholder="select"
                    showValueAsLabel={true}
                    options={[
                      { value: 5, label: "5 miles" },
                      { value: 10, label: "10 miles" },
                      { value: 25, label: "25 miles" },
                      { value: 50, label: "50 miles" },
                    ]}
                    initialValue={radius}
                    onChange={(value) => {
                      setRadius(value);
                      setCurrentPage(1);
                    }}
                  />
                </label>
              </div>
            </div>
            {zipCode?.length < 5 && (
              <span className="validation-msg">Invalid ZIP Code</span>
            )}

            <div className="pr-search-result">
              {results?.total ? (
                <>
                  <b>{results?.total || 0} providers</b> found within {radius}{" "}
                  miles
                </>
              ) : null}
            </div>

            {isLoading ? (
              <div className="spinner-container">
                <Spinner />
              </div>
            ) : (
              <div className="provider-result-container">
                {error && <div>Error fetching</div>}
                {zipCode &&
                  results?.map((item) => (
                    <div
                      className={`provider-result-content ${
                        selectedPharmacy?.pharmacyID === item?.pharmacyID
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedPharmacy(item);
                      }}
                    >
                      <div className="provider-content-section">
                        <div className="pr-h1">{item?.name}</div>
                        <div className="pr-h2">
                          {item?.address1} {item?.address2}.{item?.city}{" "}
                          {item?.state}
                        </div>
                      </div>
                      {selectedPharmacy?.pharmacyID === item?.pharmacyID && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPharmacy(null);
                          }}
                          className="icon-btn deselect-pr"
                        >
                          <ExitIcon />
                        </div>
                      )}
                    </div>
                  ))}
                {!isLoading && (
                  <>
                    {!zipCode && (!zipCode || zipCode?.length === 5) && (
                      <div className="pr-search-box">
                        Search for a provider
                      </div>
                    )}
                    {zipCode && zipCode?.length < 5 && (
                      <div className="pr-search-box">
                        Fix errors before searching
                      </div>
                    )}
                    {results?.length === 0 && (
                      <div className="pr-search-box">
                        No phrmacies found under the current search criteria
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
