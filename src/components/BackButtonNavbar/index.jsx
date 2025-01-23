import BackButton from "components/BackButton";
import styles from "./styles.module.scss";

function GoBackNavbar() {
    return (
        <div className={styles.navbar}>
            <BackButton />
        </div>
    );
}

export default GoBackNavbar;
