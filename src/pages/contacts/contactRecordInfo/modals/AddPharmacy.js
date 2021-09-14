import React, { useEffect, useState } from "react";
import Modal from "components/ui/modal";
import { Select } from "components/ui/Select";
import Pagination from "components/ui/pagination";
import ExitIcon from "components/icons/exit";
import { Button } from "components/ui/Button";
import Media from "react-media";
import "./pharmacy-modal.scss";
import clientsService from "services/clientsService";
import analyticsService from "services/analyticsService";
import Spinner from "components/ui/Spinner";
import * as Sentry from "@sentry/react";

export default function AddPharmacy({ isOpen, onClose, personalInfo, onSave }) {
  const [zipCode, setZipCode] = useState(
    personalInfo?.addresses[0]?.postalCode
  );
  const [radius, setRadius] = useState(5);

  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [latLng, setLatLng] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = results ? Math.ceil(totalCount / perPage) : 0;
  const [isMobile, setIsMobile] = useState(false);

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
      setTotalCount(0);
      return;
    }
    clientsService
      .getLatlongByAddress(zipCode, pharmacyAddress)
      .then((data) => {
        if (data?.features[0]?.center) {
          // mapbox returns longitude/latitude, so need to reverse order for
          // the pharmacy search API.
          let latlan_value = data?.features[0]?.center.reverse().toString();
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
      setTotalCount(0);
      return;
    }

    let payload = {
      take: perPage,
      skip: perPage * (currentPage - 1),
      fields: "",
      radius: radius,
      zip: zipCode,
      latLng: latLng,
      pharmacyName: pharmacyName,
      pharmacyAddress: pharmacyAddress,
      planPharmacyType: "",
      pharmacyIDType: 0,
    };

    setIsLoading(true);
    clientsService
      .searchPharmacies(payload)
      .then((data) => {
        setIsLoading(false);
        if (data?.pharmacyList?.length > 0) {
          setResults(data?.pharmacyList);
          setError(null);
          setTotalCount(data.totalCount);
        } else {
          setResults([]);
          setTotalCount(0);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
      });
  }, [
    perPage,
    currentPage,
    pharmacyName,
    pharmacyAddress,
    latLng,
    zipCode,
    radius,
  ]);

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
    onClose();
  };

  const zipCodeError = !zipCode || zipCode?.length < 5 ? true : false;

  return (
    <div>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Modal
        open={isOpen}
        onClose={onClose}
        size="wide"
        labeledById="dialog_add_provider"
        providerModal={true}
        footer={
          isMobile ? null : (
            <div className="dialog--actions-pr">
              {zipCode && totalPages > 1 ? (
                <Pagination
                  providerPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={totalCount}
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
                    onClick={onClose}
                    style={{ marginRight: 10 }}
                    data-gtm="button-save"
                  />
                </div>
                <div className="pr-add">
                  {" "}
                  <Button
                    disabled={!selectedPharmacy}
                    label="Add Pharmacy"
                    onClick={handleAddPharmacy}
                    data-gtm="button-cancel"
                  />
                </div>
              </div>
            </div>
          )
        }
      >
        <div className="dialog--container">
          <div className="dialog--title add-pr-title">
            <h2 id="dialog_help_label" className="hdg hdg--2 mb-1 mble-title">
              Add Pharmacy
            </h2>
          </div>
          <div className="dialog--body pharmacy-modal-container">
            <div className="large-view">
              <div className="pr-header-container">
                <div className="zip-section">
                  <label className="pr-title">
                    ZIP Code
                    <input
                      type="text"
                      placeholder="Zip"
                      value={zipCode}
                      maxLength="5"
                      className={`${zipCodeError ? "error" : ""} zip-input`}
                      onChange={(e) => {
                        setZipCode(e.target.value);
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
                      className={"pr-search-input"}
                      value={pharmacyName}
                      disabled={zipCodeError}
                      placeholder="Enter name"
                      onChange={(e) => {
                        setPharmacyName(e?.currentTarget?.value);
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
                      className="pr-search-input"
                      value={pharmacyAddress}
                      disabled={zipCodeError}
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
              {zipCodeError && (
                <span className="validation-msg">Invalid ZIP Code</span>
              )}
            </div>

            <div className="small-view">
              <div className="pr-header-container">
                <div className="zip-section">
                  <label className="pr-title">
                    ZIP Code
                    <br />
                    <input
                      type="text"
                      placeholder="Zip"
                      value={zipCode}
                      maxLength="5"
                      className={`${zipCodeError ? "error" : ""} zip-input`}
                      onChange={(e) => {
                        setZipCode(e?.target?.value);
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
                      providerModal={true}
                      options={[
                        { value: 5, label: "5 miles" },
                        { value: 10, label: "10 miles" },
                        { value: 20, label: "20 miles" },
                        { value: 30, label: "30 miles" },
                      ]}
                      value={radius}
                      initialValue={5}
                      onChange={(value) => {
                        setRadius(value);
                        setCurrentPage(1);
                      }}
                    />
                  </label>
                </div>
              </div>
              {zipCodeError && (
                <span className="validation-msg">Invalid ZIP Code</span>
              )}

              <div className="pr-search-section">
                <label className="pr-title">
                  Pharmacy Name
                  <br />
                  <input
                    className={"pr-search-input"}
                    type="text"
                    value={pharmacyName}
                    disabled={zipCodeError}
                    placeholder="Enter name"
                    onChange={(e) => {
                      setPharmacyName(e?.target?.value);
                      setCurrentPage(1);
                    }}
                  />
                </label>
              </div>
              <div className="pr-search-section">
                <label className="pr-title">
                  Pharmacy Address
                  <br />
                  <input
                    className="pr-search-input"
                    type="text"
                    value={pharmacyAddress}
                    disabled={zipCodeError}
                    placeholder="Enter Address"
                    onChange={(e) => {
                      setPharmacyAddress(e?.target?.value);
                      setCurrentPage(1);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="pr-search-result">
              {totalCount ? (
                <>
                  <b>{totalCount || 0} Pharmacies</b> found within {radius}
                  &nbsp;miles
                </>
              ) : null}
            </div>

            {isLoading ? (
              <div className="spinner-container">
                <Spinner />
              </div>
            ) : (
              <div className="provider-result-container">
                {error && (
                  <div className="pr-search-box">Error fetching Providers</div>
                )}
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
                          {item?.address1}
                          {item.address2 ? " " + item.address2 : ""},{" "}
                          {item?.city}, {item?.state}
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
                    {zipCodeError && (
                      <div className="pr-search-box">
                        Fix errors before searching
                      </div>
                    )}
                    {!error &&
                      zipCode &&
                      zipCode?.length === 5 &&
                      results?.length === 0 && (
                        <div className="pr-search-box">
                          No Pharmacies found under the current search criteria
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
            {isMobile && (
              <div className="dialog--actions-pr">
                {zipCode && totalPages > 1 ? (
                  <Pagination
                    providerPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalResults={totalCount}
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
                      onClick={onClose}
                      style={{ marginRight: 10 }}
                      data-gtm="button-save"
                    />
                  </div>
                  <div className="pr-add">
                    {" "}
                    <Button
                      disabled={!selectedPharmacy}
                      label="Add Pharmacy"
                      onClick={handleAddPharmacy}
                      data-gtm="button-cancel"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
