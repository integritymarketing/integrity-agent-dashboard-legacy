import PropTypes from 'prop-types';
import { AGE, BIRTHDATE, GENDER, HEALTH_INFO, HEIGHT, SMOKER, WEIGHT } from "../HealthContainer.constants";
import { EditIcon } from "../icons/EditIcon";
import styles from "./HealthInfoContainer.module.scss";
import { formatDate, getAgeFromBirthDate } from 'utils/dates';

export const ViewHealthInfo = ({ birthdate, gender, height, weight, smoker, onEdit }) => {
    return (
        <div className={styles.healthInfoContainer}>
            <div className={styles.headerWrapper}>
                <div className={styles.headerTitle}>{HEALTH_INFO}</div>
                <div className={styles.editCTA} onClick={onEdit}>
                    <span>{"Edit"}</span>
                    <EditIcon />
                </div>
            </div>
            <div className={styles.inputBox}>
                <div className={styles.label}>{GENDER}</div>
                <div className={styles.value}>{gender}</div>
            </div>
            <div className={styles.adjacentInputs}>
                <div className={`${styles.inputBoxHalf} ${styles.inputBox}`}>
                    <div className={styles.label}>{BIRTHDATE}</div>
                    <div className={styles.value}>{birthdate && formatDate(birthdate)}</div>
                </div>
                <div className={`${styles.inputBoxHalf} ${styles.inputBox}`}>
                    <div className={styles.label}>{AGE}</div>
                    <div className={styles.value}>{birthdate && getAgeFromBirthDate(birthdate)}</div>
                </div>
            </div>
            <div className={styles.inputBox}>
                <div className={styles.label}>{HEIGHT}</div>
                <div className={styles.value}>{height}</div>
            </div>
            <div className={styles.inputBox}>
                <div className={styles.label}>{WEIGHT}</div>
                <div className={styles.value}>{weight}</div>
            </div>
            <div className={styles.inputBox}>
                <div className={styles.label}>{SMOKER}</div>
                <div className={styles.value}>{smoker}</div>
            </div>
        </div>
    )
}
ViewHealthInfo.propTypes = {
    birthdate: PropTypes.string,
    gender: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    weight: PropTypes.number,
    smoker: PropTypes.string,
    onEdit: PropTypes.func.isRequired
};