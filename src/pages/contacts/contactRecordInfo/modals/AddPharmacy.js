import React, { useEffect, useState } from "react";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import Modal from "components/ui/modal";
import { Select } from "components/ui/Select";
import { Button } from "components/ui/Button";
import Media from "react-media";
import "./pharmacy-modal.scss";
import { useClientServiceContext } from "services/clientServiceProvider";
import analyticsService from "services/analyticsService";
import Spinner from "components/ui/Spinner";
import * as Sentry from "@sentry/react";
import Styles from "./AddPharmacy.module.scss";
import ArrowForwardWithCircle from "components/SharedModals/Icons/ArrowForwardWithCircle";
import Pagination from "components/ui/Pagination/pagination";
import { Checkbox } from "@mui/material";
import SearchIcon from "components/icons/search2";

export default function AddPharmacy({ isOpen, onClose, personalInfo, refresh, leadId }) {
    const { addPharmacy } = useHealth();
    const [zipCode, setZipCode] = useState(personalInfo?.addresses?.[0]?.postalCode);
    const [radius, setRadius] = useState(5);

    const [pharmacyName, setPharmacyName] = useState("");
    const [pharmacyAddress, setPharmacyAddress] = useState("");
    const [latLng, setLatLng] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const totalPages = results ? Math.ceil(totalCount / perPage) : 0;
    const [isMobile, setIsMobile] = useState(false);
    const { clientsService } = useClientServiceContext();

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
                if (data?.features?.length > 0 && data?.features[0]?.center) {
                    // mapbox returns longitude/latitude, so need to reverse order for
                    // the pharmacy search API.
                    const latlan_value = data?.features[0]?.center.reverse().toString();
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

        const payload = {
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
    }, [perPage, currentPage, pharmacyName, pharmacyAddress, latLng, zipCode, radius]);

    const renderEmptyContainer = () => {
        if (!zipCode) {
            return <div className={Styles.emptyContainer}>Search for a pharmacy</div>;
        }
    };

    const handleAddPharmacy = async () => {
        await addPharmacy(
            {
                pharmacyID: selectedPharmacy.pharmacyID,
                name: selectedPharmacy.name,
                address1: selectedPharmacy.address1,
                address2: selectedPharmacy.address2,
                city: selectedPharmacy.city,
                zip: selectedPharmacy.zip,
                state: selectedPharmacy.state,
                pharmacyPhone: selectedPharmacy.pharmacyPhone,
            },
            refresh,
            leadId,
        );
        onClose();
    };

    const zipCodeError = zipCode?.length > 0 && zipCode?.length < 5;

    return (
        <div>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            {isMobile && isOpen ? (
                // Mobile Version
                <div className={Styles.modalContainer}>
                    <div className={Styles.modal}>
                        <div className={Styles.modalHeader}>
                            <h2>Add Pharmacy</h2>
                            <button onClick={onClose}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className={Styles.closeBtn}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className={Styles.modalBody}>
                            <div className="dialog--container">
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
                                                    <div
                                                        onClick={() => {
                                                            const element =
                                                                document.querySelector(".search-input-container");
                                                            element.classList.add("outlineDiv");
                                                            element.focus();
                                                        }}
                                                        onBlur={() => {
                                                            const element =
                                                                document.querySelector(".search-input-container");
                                                            element.classList.remove("outlineDiv");
                                                        }}
                                                        className="search-input-container"
                                                        style={{
                                                            background: zipCodeError ? "#f1f5f9" : "#fff",
                                                        }}
                                                    >
                                                        <div className="search-icon">
                                                            <SearchIcon />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className={"pr-search-input"}
                                                            value={pharmacyName}
                                                            disabled={zipCodeError}
                                                            placeholder="Search"
                                                            onChange={(e) => {
                                                                setPharmacyName(e?.currentTarget?.value);
                                                                setCurrentPage(1);
                                                            }}
                                                        />
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="pr-address-section">
                                                <label className="pr-title">
                                                    Address
                                                    <input
                                                        type="text"
                                                        className="pr-search-input"
                                                        value={pharmacyAddress}
                                                        disabled={zipCodeError}
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

                                        {zipCodeError && <span className="validation-msg">Invalid ZIP Code</span>}
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
                                        {zipCodeError && <span className="validation-msg">Invalid ZIP Code</span>}

                                        <div className="pr-search-section">
                                            <label className="pr-title">
                                                Address
                                                <br />
                                                <input
                                                    className="pr-search-input"
                                                    type="text"
                                                    value={pharmacyAddress}
                                                    disabled={zipCodeError}
                                                    onChange={(e) => {
                                                        setPharmacyAddress(e?.target?.value);
                                                        setCurrentPage(1);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <div className="pr-search-section">
                                            <label className="pr-title">
                                                Pharmacy Name
                                                <br />
                                                <div
                                                    onClick={() => {
                                                        const element =
                                                            document.querySelector(".search-input-container");
                                                        element.classList.add("outlineDiv");
                                                        element.focus();
                                                    }}
                                                    onBlur={() => {
                                                        const element =
                                                            document.querySelector(".search-input-container");
                                                        element.classList.remove("outlineDiv");
                                                    }}
                                                    className="search-input-container"
                                                    style={{
                                                        background: zipCodeError ? "#f1f5f9" : "#fff",
                                                    }}
                                                >
                                                    <div className="search-icon">
                                                        <SearchIcon />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className={"pr-search-input"}
                                                        value={pharmacyName}
                                                        disabled={zipCodeError}
                                                        placeholder="Search"
                                                        onChange={(e) => {
                                                            setPharmacyName(e?.currentTarget?.value);
                                                            setCurrentPage(1);
                                                        }}
                                                    />
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pr-search-result">
                                        {totalCount ? <>{totalCount || 0} Pharmacies found</> : null}
                                        {renderEmptyContainer()}
                                    </div>

                                    {isLoading ? (
                                        <div className="spinner-container">
                                            <Spinner />
                                        </div>
                                    ) : (
                                        <div className="result-container">
                                            <div className="provider-result-container">
                                                {error && <div className="pr-search-box">Error fetching Providers</div>}
                                                {zipCode &&
                                                    results?.map((item) => (
                                                        <div
                                                            key={`${item?.pharmacyID}-pharmacy`}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                background:
                                                                    selectedPharmacy === item ? "#f1faff" : "inherit",
                                                            }}
                                                        >
                                                            <Checkbox
                                                                onClick={() => {
                                                                    setSelectedPharmacy(
                                                                        item === selectedPharmacy ? null : item,
                                                                    );
                                                                }}
                                                                checked={selectedPharmacy === item}
                                                            />
                                                            <div className="provider-content-section">
                                                                <div className="pr-h1">{item?.name}</div>
                                                                <div className="pr-h2">
                                                                    {item?.address1}
                                                                    {item.address2 ? ` ${item.address2}` : ""},{" "}
                                                                    {item?.city}, {item?.state}
                                                                </div>
                                                            </div>
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
                                                                    No Pharmacies found under the current search
                                                                    criteria
                                                                </div>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                            <div className="pagination-container">
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
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="dialog--actions-pr">
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
                                        style={selectedPharmacy ? null : { opacity: 0.5, cursor: "none" }}
                                        label="Add Pharmacy"
                                        onClick={handleAddPharmacy}
                                        data-gtm="button-cancel"
                                        icon={<ArrowForwardWithCircle />}
                                        iconPosition="right"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Modal
                    header="Add Pharmacy"
                    open={isOpen}
                    onClose={onClose}
                    size="medium"
                    labeledById="dialog_add_provider"
                    providerModal={true}
                    footer={
                        <div className="dialog--actions-pr">
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
                                        style={selectedPharmacy ? null : { opacity: 0.5, cursor: "none" }}
                                        label="Add Pharmacy"
                                        onClick={handleAddPharmacy}
                                        data-gtm="button-cancel"
                                        icon={<ArrowForwardWithCircle />}
                                        iconPosition="right"
                                    />
                                </div>
                            </div>
                        </div>
                    }
                >
                    <div className="dialog--container">
                        <div className="dialog--body pharmacy-modal-container">
                            <div className="large-view">
                                <div className="pr-header-title">Search for a Pharmacy</div>

                                <div className="pr-header-container">
                                    <div className="pr-input">
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
                                        <div className="pr-address-section">
                                            <label className="pr-title">
                                                <div>Address</div>
                                                <input
                                                    type="text"
                                                    className="pr-search-input"
                                                    value={pharmacyAddress}
                                                    disabled={zipCodeError}
                                                    onChange={(e) => {
                                                        setPharmacyAddress(e.currentTarget.value);
                                                        setCurrentPage(1);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="pr-search-section">
                                        <label className="pr-title">
                                            <div>Pharmacy Name</div>

                                            <div
                                                onClick={() => {
                                                    const element = document.querySelector(".search-input-container");
                                                    element.classList.add("outlineDiv");
                                                    element.focus();
                                                }}
                                                onBlur={() => {
                                                    const element = document.querySelector(".search-input-container");
                                                    element.classList.remove("outlineDiv");
                                                }}
                                                className="search-input-container"
                                                style={{
                                                    background: zipCodeError ? "#f1f5f9" : "#fff",
                                                }}
                                            >
                                                <div className="search-icon">
                                                    <SearchIcon />
                                                </div>
                                                <input
                                                    type="text"
                                                    className={"pr-search-input"}
                                                    value={pharmacyName}
                                                    disabled={zipCodeError}
                                                    placeholder="Search"
                                                    onChange={(e) => {
                                                        setPharmacyName(e?.currentTarget?.value);
                                                        setCurrentPage(1);
                                                    }}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                {zipCodeError && <span className="validation-msg">Invalid ZIP Code</span>}
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
                                {zipCodeError && <span className="validation-msg">Invalid ZIP Code</span>}

                                <div className="pr-search-section">
                                    <label className="pr-title">
                                        Pharmacy Name
                                        <br />
                                        <div
                                            onClick={() => {
                                                const element = document.querySelector(".search-input-container");
                                                element.classList.add("outlineDiv");
                                                element.focus();
                                            }}
                                            onBlur={() => {
                                                const element = document.querySelector(".search-input-container");
                                                element.classList.remove("outlineDiv");
                                            }}
                                            className="search-input-container"
                                            style={{
                                                background: zipCodeError ? "#f1f5f9" : "#fff",
                                            }}
                                        >
                                            <div className="search-icon">
                                                <SearchIcon />
                                            </div>
                                            <input
                                                type="text"
                                                className={"pr-search-input"}
                                                value={pharmacyName}
                                                disabled={zipCodeError}
                                                placeholder="Search"
                                                onChange={(e) => {
                                                    setPharmacyName(e?.currentTarget?.value);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                        </div>
                                    </label>
                                </div>
                                <div className="pr-address-section">
                                    <label className="pr-title">
                                        Address
                                        <br />
                                        <input
                                            className="pr-search-input"
                                            type="text"
                                            value={pharmacyAddress}
                                            disabled={zipCodeError}
                                            onChange={(e) => {
                                                setPharmacyAddress(e?.target?.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="pr-search-result">
                                {totalCount > 0 && `${totalCount} Pharmacies found`}
                                {renderEmptyContainer()}
                            </div>

                            {isLoading ? (
                                <div className="spinner-container">
                                    <Spinner />
                                </div>
                            ) : (
                                <div className="result-container">
                                    <div className="provider-result-container">
                                        {error && <div className="pr-search-box">Error fetching Providers</div>}
                                        {zipCode &&
                                            results?.map((item) => (
                                                <div
                                                    key={`${item?.pharmacyID}-pharmacy`}
                                                    className="provider-result-content"
                                                    style={{
                                                        background: selectedPharmacy === item ? "#f1faff" : "inherit",
                                                    }}
                                                >
                                                    <div className="provider-content-section">
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <Checkbox
                                                                onClick={() => {
                                                                    setSelectedPharmacy(
                                                                        item === selectedPharmacy ? null : item,
                                                                    );
                                                                }}
                                                                checked={selectedPharmacy === item}
                                                            />
                                                            <div>
                                                                <div className="pr-h1">{item?.name}</div>
                                                                <div className="pr-h2">
                                                                    {item?.address1}
                                                                    {item.address2 ? ` ${item.address2}` : ""},{" "}
                                                                    {item?.city}, {item?.state}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        {!isLoading && (
                                            <>
                                                {zipCodeError && (
                                                    <div className="pr-search-box">Fix errors before searching</div>
                                                )}
                                                {!error &&
                                                    zipCode &&
                                                    zipCode?.length === 5 &&
                                                    results?.length === 0 && (
                                                        <div className="pr-search-box no-result-container">
                                                            No Pharmacies found under the current search criteria
                                                        </div>
                                                    )}
                                            </>
                                        )}
                                    </div>
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
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
