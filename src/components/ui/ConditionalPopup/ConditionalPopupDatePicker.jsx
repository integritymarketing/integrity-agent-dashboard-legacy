import PropTypes from "prop-types";
import ConditionalPopupLayout from "./ConditionalPopupLayout";
import DatePickerMUI from "components/DatePicker";
import styles from "./styles.module.scss";

function ConditionalPopupDatePicker({
    header,
    title,
    contentHeading,
    handleApplyClick,
    handleCancelClick,
    applyButtonDisabled,
    values,
    onChange,
    open,
    onClose,
}) {
    return (
        <ConditionalPopupLayout
            header={header}
            title={title}
            contentHeading={contentHeading}
            handleApplyClick={handleApplyClick}
            handleCancelClick={handleCancelClick}
            applyButtonDisabled={applyButtonDisabled}
            open={open}
            onClose={onClose}
        >
            <DatePickerMUI
                value={values}
                disableFuture={true}
                onChange={(value) => onChange(value)}
                className={styles.datepicker}
                iconPosition="left"
            />
        </ConditionalPopupLayout>
    );
}

ConditionalPopupDatePicker.propTypes = {
    header: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    contentHeading: PropTypes.string.isRequired,
    handleApplyClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired,
    applyButtonDisabled: PropTypes.bool,
    values: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
export default ConditionalPopupDatePicker;
