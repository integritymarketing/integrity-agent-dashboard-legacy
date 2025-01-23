import React from "react";
import { Link } from "react-router-dom";

import Logo from "partials/logo";
import SimpleFooter from "partials/simple-footer";

import "./maintenancepage.scss";

export default function MaintenancePage() {
    return (
        <>
            <div className="maintenance--header">
                <Link to="/">
                    <span className="visually-hidden">Integrity</span>
                    <Logo aria-hidden="true" className="mt-4 ml-4 maintenace--logo" />
                </Link>
            </div>
            <section className="maintenance--body">
                <h3 style={{ color: "#1B1B1B" }} className="hdg--3 pt-1 pl-5 pr-5">
                    Integrity is currently down for maintenance.
                </h3>
                <p style={{ color: "#6A6A6A" }} className="pt-2">
                    We will be back online shortly.
                </p>
            </section>
            <SimpleFooter className="global-footer--simple" />
        </>
    );
}
