
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { Button } from "@mui/material";
import { faCircleArrowRight } from "@awesome.me/kit-7ab3488df1/icons/classic/light";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FooterButtons({ buttonOne, buttonTwo, dashBoardModal }) {
    return (
        <div className={styles.container}>
            <div className={styles.buttons}>
                <Button
                    variant="text"
                    size="large"
                    disabled={buttonOne.disabled}
                    onClick={() => {
                        buttonOne.onClick();
                    }}
                >
                    {buttonOne.text}
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    endIcon={<FontAwesomeIcon icon={faCircleArrowRight} size={"xl"} />}
                    disabled={buttonTwo.disabled}
                    onClick={() => {
                        buttonTwo.onClick();
                    }}
                >
                    {buttonTwo.text}
                </Button>
            </div>
            {dashBoardModal && (
                <p className={styles.helpTxt}>
                    *This is not your Integrity Agent Phone Number, which can be found on your Account Page.
                </p>
            )}
        </div>
    );
}

FooterButtons.propTypes = {
    buttonOne: PropTypes.shape({
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
    }).isRequired,
    buttonTwo: PropTypes.shape({
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
    }).isRequired,
    dashBoardModal: PropTypes.node,
};

export default FooterButtons;
