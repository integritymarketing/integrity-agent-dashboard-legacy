import {useEffect, useRef} from "react";
import PropTypes from "prop-types";
import Styles from "./AvailabilityOverlay.module.scss";
import Arrow from "./arrow.svg";
import Box from "./box.svg";
import {useOnClickOutside} from "hooks/useOnClickOutside";

export default function AvailabilityOverlay({hideModal, onDismissed}) {
    const modalRef = useRef(null);
    useOnClickOutside(modalRef, hideModal);

    useEffect(() => {
        const positionModal = () => {
            try {
                const availabilityWrapper = document.getElementById("availabilityWrapper");
                const buttonElement = document.getElementById("myButton");

                if (availabilityWrapper && buttonElement) {
                    availabilityWrapper.style.top = `${buttonElement.offsetTop - 38}px`;

                    if (window.innerWidth > 480) {
                        availabilityWrapper.style.right = "-15px";
                    } else {
                        availabilityWrapper.style.left = `${buttonElement.offsetLeft - 123}px`;
                    }
                }
            } catch (error) {
                console.error("Error positioning modal:", error);
            }
        };

        positionModal();
    }, []);

    return (
        <div className={Styles.wrapper}>
            <div id="availabilityWrapper" className={Styles.outerWrapper} ref={modalRef}>
                <div className={Styles.innerWrapper}>
                    <div className={Styles.arrowBox}>
                        <img src={Box} alt="Background Box"/>
                        <br/>
                        <img src={Arrow} className={Styles.box} alt="Arrow Indicator"/>
                    </div>
                    <div className={Styles.body}>
                        <div className={Styles.header}>“Check In” has been updated.</div>
                        <div className={Styles.content}>
                            Set your availability for access to{" "}
                            <a
                                href="https://learningcenter.tawebhost.com/MedicareCENTER-Real-Time-Leads-User-Guide.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={Styles.link}
                            >
                                real-time leads
                            </a>
                            . Availability Preferences are found on your{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = `${process.env.REACT_APP_AUTH_PAW_REDIRECT_URI}/agent-profile`;
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={Styles.link}
                            >
                                Account Page
                            </a>
                            .
                            <button className={Styles.button} onClick={onDismissed}>
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

AvailabilityOverlay.propTypes = {
    hideModal: PropTypes.func.isRequired,
    onDismissed: PropTypes.func.isRequired,
};