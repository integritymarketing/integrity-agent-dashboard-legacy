import PropTypes from "prop-types";
import "./prescription.scss";
import GreenRoundCheckIcon from "components/icons/greenRoundCheckBold";
import MinusIconRed from "components/icons/minusIconRed";

export const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const fields = ["retail", "gap", "copay", "catastrophic"];

function Prescription({ data, prescriptions }) {
    const getDoseQuantity = (labelName) => {
        const prescription = findPrescriptionByLabelName(labelName);
        if (!prescription || !prescription.dosage) {
            return;
        }
        const { dosage } = prescription;
        const duration = getNumberInText(Math.floor(dosage.daysOfSupply / 30));
        if (dosage.selectedPackage) {
            return `${dosage.userQuantity} X ${dosage.selectedPackage.packageDisplayText} per ${duration}`;
        }

        return `${dosage.userQuantity} tablets per ${duration}`;
    };

    const findPrescriptionByLabelName = (labelName) => {
        return prescriptions?.find((prescription) => labelName === prescription?.dosage?.labelName);
    };

    const getNumberInText = (number) => {
        switch (number) {
            case 1:
                return "one month";
            case 2:
                return "two months";
            case 3:
                return "three months";
            case 4:
                return "four months";
            case 5:
                return "five months";
            case 6:
                return "six months";
            case 12:
                return "year";
            default:
                return "";
        }
    };
    return (
        <div className="prescription-container">
            <div className="row header">
                <div className="col field desc">
                    <div className="type">{data.type}</div>
                    <div className="drug-name">{data.drugName}</div>
                    <div className="type" style={{ fontStyle: "italic" }}>
                        {getDoseQuantity(data?.drugName)}
                    </div>
                    {/* <div className="covered">Covered</div> */}
                </div>
                {data &&
                    data?.covered?.length > 0 &&
                    data?.covered?.map((covered, index) => (
                        <div className="col val" key={index}>
                            {covered ? <GreenRoundCheckIcon /> : <MinusIconRed />}
                        </div>
                    ))}
            </div>
            {fields.map((field) => (
                <div className="row" key={field}>
                    <div className="col field">{field}</div>
                    {data &&
                        data[field]?.length > 0 &&
                        data[field]?.map((value, idx) => (
                            <div className="col val" key={idx}>
                                {(value && currencyFormatter.format(value)) || "-"}
                            </div>
                        ))}
                </div>
            ))}
            <div className="row">
                <div className="col field">Restrictions</div>
                {data &&
                    data?.restrictions?.length > 0 &&
                    data?.restrictions?.map((value, index) => (
                        <div className="col val restrictions" key={index}>
                            {value.hasPriorAuthorization && <div className="link">Prior Authorization</div>}
                            {value.hasQuantityLimit && (
                                <div className="qty">
                                    <div className="link">Quantity Limit</div>
                                    <div className="qty-limit">
                                        {value.quantityLimitAmount} / {value.quantityLimitDays} days
                                    </div>
                                </div>
                            )}
                            {value.hasStepTherapy && <div className="link">Step Therapy</div>}
                            {!value.hasPriorAuthorization && !value.hasQuantityLimit && !value.hasStepTherapy && (
                                <div>None</div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}

Prescription.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.string,
        drugName: PropTypes.string,
        covered: PropTypes.arrayOf(PropTypes.bool),
        retail: PropTypes.arrayOf(PropTypes.number),
        gap: PropTypes.arrayOf(PropTypes.number),
        copay: PropTypes.arrayOf(PropTypes.number),
        catastrophic: PropTypes.arrayOf(PropTypes.number),
        restrictions: PropTypes.arrayOf(
            PropTypes.shape({
                hasPriorAuthorization: PropTypes.bool,
                hasQuantityLimit: PropTypes.bool,
                hasStepTherapy: PropTypes.bool,
                quantityLimitAmount: PropTypes.number,
                quantityLimitDays: PropTypes.number,
            })
        ),
    }),
    prescriptions: PropTypes.array,
};
export default Prescription;
