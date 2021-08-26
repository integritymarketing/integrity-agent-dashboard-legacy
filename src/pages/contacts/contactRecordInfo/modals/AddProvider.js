import React, { useEffect, useState } from "react";
import Modal from "components/ui/modal";
import { Select } from "components/ui/Select";
import Pagination from "components/ui/pagination";
import ExitIcon from "components/icons/exit";
import { Button } from "./../../../../stories/examples/Button";
import "./provider-modal.scss";
import clientsService from "services/clientsService";
import Spinner from "components/ui/Spinner";

function encodeQueryData(data) {
  const ret = [];
  for (let d in data)
    if (data[d]) {
      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    }
  return ret.join("&");
}

export default function AddProvider({ isOpen, onClose, personalInfo }) {
  const [zipCode, setZipCode] = useState(personalInfo.addresses[0]?.postalCode);
  const [searchText, setSearchText] = useState("");
  const [radius, setRadius] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const filteredResults = results?.providers || [];
  const totalPages = results ? Math.ceil(results.total / perPage) : 0;

  useEffect(() => {
    if (!zipCode || zipCode.length !== 5 || !searchText) {
      setIsLoading(false);
      setError(null);
      setResults();
      return;
    }
    const query = encodeQueryData({
      searchTerm: searchText,
      radius,
      zipCode,
      page: currentPage,
      perPage,
    });
    setIsLoading(true);
    clientsService
      .searchProviders(query)
      .then((resp) => {
        setIsLoading(false);
        setError(null);
        setResults(resp);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
      });
  }, [perPage, currentPage, searchText, zipCode, radius]);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
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
                  onClick={onClose}
                  style={{ marginRight: 10 }}
                />
              </div>
              <div className="pr-add">
                {" "}
                <Button
                  disabled={!selectedProvider}
                  label="Add Provider"
                  onClick={onClose}
                />
              </div>
            </div>
          </div>
        }
      >
        <div className="dialog--container">
          <div className="dialog--title">
            <h2 id="dialog_help_label" className="hdg hdg--2 mb-1">
              Add Provider
            </h2>
          </div>
          <div className="dialog--body provider-modal-container">
            <div className="pr-header-container">
              <div className="zip-section">
                <label className="pr-title">
                  ZIP Code
                  <input
                    type="text"
                    placeholder="Zip"
                    value={zipCode}
                    maxLength="5"
                    className={`${zipCode.length < 5 && "zip-error"} zip-input`}
                    onChange={(e) => {
                      setZipCode(e.target.value);
                      setCurrentPage(1);
                      if (!e.target.value || e.target.value.length < 5) {
                        setSearchText("");
                      }
                    }}
                  />
                </label>
              </div>
              <div className="pr-search-section">
                <label className="pr-title">
                  Provider Search
                  <input
                    className="pr-search-input"
                    type="text"
                    value={searchText}
                    disabled={zipCode.length < 5}
                    placeholder="Start typing a provider’s name"
                    onChange={(e) => {
                      setSearchText(e.target.value);
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
                      { value: 10, label: "10 miles" },
                      { value: 20, label: "20 miles" },
                      { value: 30, label: "30 miles" },
                    ]}
                    initialValue={10}
                    onChange={(value) => {
                      setRadius(value);
                      setCurrentPage(1);
                    }}
                  />
                </label>
              </div>
            </div>
            {zipCode.length < 5 && (
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

            {!isLoading ? (
              <div className="spinner-container">
                <Spinner />
              </div>
            ) : (
              <div className="provider-result-container">
                {error && <div>Error fetching</div>}
                {zipCode &&
                  filteredResults.map((item) => (
                    <div
                      className={`provider-result-content ${
                        selectedProvider?.NPI === item.NPI ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedProvider(item);
                      }}
                    >
                      <div className="provider-content-section">
                        <div className="pr-h1">{item.presentationName}</div>
                        <div className="pr-h2">{item.specialty}</div>
                        <div className="pr-h2">
                          {[
                            item.addresses[0].streetLine1,
                            item.addresses[0].streetLine2,
                            item.addresses[0].city,
                            item.addresses[0].state,
                            item.addresses[0].zipCode,
                          ]
                            .filter(Boolean)
                            .join(",")}
                        </div>
                      </div>
                      {selectedProvider?.NPI === item.NPI && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProvider(null);
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
                    {(!zipCode || !searchText) &&
                      (!zipCode || zipCode.length === 5) && (
                        <div className="pr-search-box">
                          Enter ZIP code and search text before searching
                        </div>
                      )}
                    {zipCode && zipCode.length < 5 && (
                      <div className="pr-search-box">
                        Fix errors before searching
                      </div>
                    )}
                    {searchText &&
                      zipCode &&
                      zipCode.length === 5 &&
                      filteredResults.length === 0 && (
                        <div className="pr-search-box">
                          No providers found under the current search criteria
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
