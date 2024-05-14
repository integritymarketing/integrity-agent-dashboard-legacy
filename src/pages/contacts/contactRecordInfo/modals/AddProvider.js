import React, { useEffect, useState } from "react";
import Modal from "components/ui/modal";
import { Select } from "components/ui/Select";
import Pagination from "components/ui/Pagination/pagination";
import { Button } from "components/ui/Button";
import { useClientServiceContext } from "services/clientServiceProvider";
import analyticsService from "services/analyticsService";
import Spinner from "components/ui/Spinner";
import Media from "react-media";
import "./provider-modal.scss";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import ProviderCard from "packages/ProviderCard";

function encodeQueryData(data) {
    const ret = [];
    for (const d in data) {
        if (data[d]) {
            ret.push(`${encodeURIComponent(d)}=${encodeURIComponent(data[d])}`);
        }
    }
    return ret.join("&");
}

export default function AddProvider({ isOpen, onClose, personalInfo, leadId, leadProviders }) {
    const [zipCode, setZipCode] = useState(personalInfo.addresses?.[0]?.postalCode);
    const [searchText, setSearchText] = useState("");
    const [radius, setRadius] = useState(10);
    const [isMobile, setIsMobile] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectAddressId, setSelectAddressId] = useState(null);
    const filteredResults = results?.providers || [];
    const totalPages = results ? Math.ceil(results.total / perPage) : 0;
    const showToast = useToast();
    const { clientsService } = useClientServiceContext();

    useEffect(() => {
        if (isOpen) {
            analyticsService.fireEvent("event-modal-appear", {
                modalName: "Add Provider",
            });
        }
    }, [isOpen]);
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
                Sentry.captureException(e);
            });
    }, [perPage, currentPage, searchText, zipCode, radius]);

    const deleteExistingProvider = async (provider, npi, addressId) => {
        try {
            await clientsService.deleteProvider(addressId, leadId, npi);
            addProviderHandle(provider);
        } catch (err) {
            Sentry.captureException(err);
            showToast({
                type: "error",
                message: "Error, update unsuccessful.",
            });
        }
    };

    const saveProvider = async (provider) => {
        const isExist = leadProviders?.filter((each) => each?.NPI === provider?.NPI)[0] || null;

        if (isExist) {
            deleteExistingProvider(provider, isExist?.NPI, isExist?.addresses?.[0]?.id);
        } else {
            addProviderHandle(provider);
        }
    };

    const addProviderHandle = async (provider) => {
        const request = [
            {
                npi: provider.NPI.toString(),
                addressId: selectAddressId,
                isPrimary: false,
            },
        ];
        try {
            await clientsService.createLeadProvider(leadId, request);
            showToast({
                message: `${provider.presentationName} added to the list. `,
            });
            onClose({ refresh: true });
        } catch (err) {
            Sentry.captureException(err);
            showToast({
                type: "error",
                message: "Error, update unsuccessful.",
            });
        }
    };

    return (
        <div>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <Modal
                header="Add Provider"
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
                                        data-gtm="button-cancel-provider"
                                    />
                                </div>
                                <div className="pr-add">
                                    {" "}
                                    <Button
                                        disabled={!selectedProvider}
                                        label="Add Provider"
                                        onClick={() => saveProvider(selectedProvider)}
                                        data-gtm="button-add-provider"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }
            >
                <div className="dialog--container">
                    <div className="dialog--body provider-modal-container">
                        <div className="large-view">
                            <div className="pr-header-container">
                                <div className="zip-section">
                                    <label className="pr-title">
                                        Zip Code
                                        <input
                                            type="text"
                                            placeholder="Zip"
                                            value={zipCode}
                                            maxLength="5"
                                            className={`${zipCode && zipCode.length < 5 ? "zip-error" : ""} zip-input`}
                                            onChange={(e) => {
                                                setZipCode(e.target.value);
                                                setCurrentPage(1);
                                                if (!e.target.value || e.target.value.length < 5) {
                                                    setSearchText("");
                                                }
                                            }}
                                        />
                                    </label>
                                    {zipCode && zipCode.length < 5 && (
                                        <span className="validation-msg">Invalid Zip Code</span>
                                    )}
                                </div>
                                <div className="miles-section">
                                    <label className="pr-title">
                                        Distance
                                        <Select
                                            placeholder="select"
                                            providerModal={true}
                                            options={[
                                                { value: 10, label: "10 miles" },
                                                { value: 20, label: "20 miles" },
                                                { value: 30, label: "30 miles" },
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
                            <div className="pr-search-section">
                                <div className="pr-title">
                                    <input
                                        className="pr-search-input"
                                        type="text"
                                        value={searchText}
                                        disabled={zipCode && zipCode.length < 5}
                                        placeholder="Start typing a provider’s name"
                                        onChange={(e) => {
                                            setSearchText(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="small-view">
                            <div className="pr-header-container">
                                <div className="zip-section">
                                    <label className="pr-title">
                                        Zip Code
                                        <input
                                            type="text"
                                            placeholder="Zip"
                                            value={zipCode ? zipCode : ""}
                                            maxLength="5"
                                            className={`${zipCode && zipCode.length < 5 ? "zip-error" : ""} zip-input`}
                                            onChange={(e) => {
                                                setZipCode(e.target.value);
                                                setCurrentPage(1);
                                                if (!e.target.value || e.target.value.length < 5) {
                                                    setSearchText("");
                                                }
                                            }}
                                        />
                                    </label>
                                    {zipCode && zipCode.length < 5 && (
                                        <span className="validation-msg">Invalid Zip Code</span>
                                    )}
                                </div>
                                <div className="miles-section">
                                    <label className="pr-title">
                                        Distance
                                        <Select
                                            placeholder="select"
                                            providerModal={true}
                                            options={[
                                                { value: 10, label: "10 miles" },
                                                { value: 20, label: "20 miles" },
                                                { value: 30, label: "30 miles" },
                                            ]}
                                            value={radius}
                                            initialValue={10}
                                            onChange={(value) => {
                                                setRadius(value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="pr-search-section">
                                <label className="pr-title">
                                    Provider Search
                                    <br />
                                    <input
                                        className="pr-search-input"
                                        type="text"
                                        value={searchText}
                                        disabled={zipCode && zipCode.length < 5}
                                        placeholder="Start typing a provider’s name"
                                        onChange={(e) => {
                                            setSearchText(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="pr-search-result">
                            {results?.total ? (
                                <>
                                    <b>{results?.total || 0} providers</b> within {radius} miles
                                </>
                            ) : null}
                        </div>

                        {isLoading ? (
                            <div className="spinner-container">
                                <Spinner />
                            </div>
                        ) : (
                            <div className="provider-result-container">
                                {error && <div className="pr-search-box">Error fetching Providers</div>}
                                {zipCode &&
                                    filteredResults.map((item, index) => (
                                        <ProviderCard
                                            key={item.NPI}
                                            item={item}
                                            index={index}
                                            selectedProvider={selectedProvider}
                                            setSelectedProvider={(value) => setSelectedProvider(value)}
                                            setSelectAddressId={(value) => setSelectAddressId(value)}
                                            selectAddressId={selectAddressId}
                                        />
                                    ))}
                                {!isLoading && (
                                    <>
                                        {(!zipCode || !searchText) && (!zipCode || zipCode.length === 5) && (
                                            <div className="pr-search-box">Search for a provider</div>
                                        )}
                                        {zipCode && zipCode.length < 5 && (
                                            <div className="pr-search-box">Fix errors before searching</div>
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
                        {isMobile && (
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
                                            data-gtm="button-save"
                                        />
                                    </div>
                                    <div className="pr-add">
                                        <Button
                                            disabled={!selectedProvider}
                                            label="Add Provider"
                                            onClick={() => saveProvider(selectedProvider)}
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
