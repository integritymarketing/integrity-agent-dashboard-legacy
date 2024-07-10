import Styles from "./Notice.module.scss";
import { useLocation } from "react-router-dom";
import ClickAwayListener from "react-click-away-listener";

export default function Notice({ hideModal }) {
    const location = useLocation();
    const redirectToAccount = () => {
        window.location.href = `${process.env.REACT_APP_AUTH_PAW_REDIRECT_URI}`;
    };
    return (
        <div className={Styles.wrapper}>
            <ClickAwayListener onClickAway={hideModal}>
                <div className={Styles.body}>
                    <div className={Styles.header}>
                        Set your Availability Preferences
                        <button onClick={hideModal}>
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
                    <div className={Styles.content}>
                        To receive leads please turn on at least one Lead Source. Availability Preferences can be found
                        on your Account Page.
                    </div>
                    {location.pathname !== "/account" && (
                        <button className={Styles.button} onClick={redirectToAccount}>
                            View Account
                        </button>
                    )}
                </div>
            </ClickAwayListener>
        </div>
    );
}
