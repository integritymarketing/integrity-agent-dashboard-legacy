import { Link } from "react-router-dom";

import LoginLink from "components/ui/login-link";

import "./index.scss";

import MedicareCenterLogo from "../../images/medicare-center.png";

export const RegisterLink = (props) => {
    return (
        <a href={`${import.meta.env.VITE_AUTH_BASE_URL}/register?client_id=AEPortal`} {...props}>
            {props.children}
        </a>
    );
};

export default () => {
    return (
        <>
            <div className="public-nav">
                <h1 className="global-nav__title" data-gtm="nav-logo">
                    <Link to="/welcome">
                        <img src={MedicareCenterLogo} alt="Integrity - Integrity logo" />
                        <span className="visually-hidden">Integrity</span>
                    </Link>
                </h1>
                <div className="link-wrapper">
                    <LoginLink>
                        <span className="link">Login</span>
                    </LoginLink>
                    <div className="seperator" />
                    <RegisterLink>
                        <span className="link">Register</span>
                    </RegisterLink>
                </div>
            </div>
        </>
    );
};
