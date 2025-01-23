import Styles from "./AvailabilityOverlay.module.scss";
import { useEffect } from "react";
import Arrow from "./arrow.svg";
import Box from "./box.svg";
import ClickAwayListener from "react-click-away-listener";

export default function AvailabilityOverlay({ hideModal, onDismissed }) {
    // Click away handle
    const handleClickAway = () => {
        hideModal();
    };
    useEffect(() => {
        try {
            document.getElementById("availabilityWrapper").style.top = `${
                document.getElementById("myButton").offsetTop - 38
            }px`;
            if (window.innerWidth > 480) {
                document.getElementById("availabilityWrapper").style.right = "-15px";
            } else {
                document.getElementById("availabilityWrapper").style.left = `${
                    document.getElementById("myButton").offsetLeft - 123
                }px`;
            }
        } catch {}
    });
    return (
        <div className={Styles.wrapper}>
            <div id="availabilityWrapper" className={Styles.outerWrapper}>
                <div className={Styles.innerWrapper}>
                    <div className={Styles.arrowBox}>
                        <img src={Box} alt="" />
                        <br />
                        <img src={Arrow} className={Styles.box} alt="" />
                    </div>
                    <ClickAwayListener onClickAway={handleClickAway}>
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
                                        window.location.href = `${import.meta.env.VITE_AUTH_PAW_REDIRECT_URI}/agent-profile`;
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
                    </ClickAwayListener>
                </div>
            </div>
        </div>
    );
}
