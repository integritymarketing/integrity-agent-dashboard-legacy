import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "contexts/auth";
import Media from "react-media";
import LargeFormatMenu from "./large-format";
import SmallFormatMenu from "./small-format";
import Logo from "partials/logo";
import Modal from "components/ui/modal";
import "./index.scss";

const HelpButtonWithModal = ({ ...props }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <React.Fragment>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        {...props}
      ></button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="hdg hdg--2 mb-1">Contact Support</div>
        <p className="mb-4">
          Call or email one of our support representatives to help resolve your
          issue.
        </p>
        <div className="hdg hdg--3 mb-1">Phone Number</div>
        <p className="mb-4">
          <a href="tel:+1-651-555-1234" className="link">
            651-555-1234
          </a>
        </p>
        <div className="hdg hdg--3 mb-1">Email</div>
        <p className="mb-4">
          <a href="mailto:support@medicarecenter.com" className="link">
            support@medicarecenter.com
          </a>
        </p>
      </Modal>
    </React.Fragment>
  );
};

export default () => {
  const auth = useContext(AuthContext);
  const [navOpen, setNavOpen] = useState(false);

  const menuProps = Object.assign(
    {
      navOpen,
      setNavOpen,
    },
    auth.isAuthenticated()
      ? {
          primary: [
            {
              component: HelpButtonWithModal,
              label: "Need Help?",
              format: "large",
            },
            {
              component: Link,
              props: { to: "/training" },
              label: "Resources",
            },
          ],
          secondary: [
            {
              component: Link,
              props: { to: "/account" },
              label: "Edit Account",
            },
            {
              component: "button",
              props: {
                type: "button",
                onClick: () => auth.logout(),
              },
              label: "Logout",
            },
          ],
        }
      : {
          primary: [],
          secondary: [],
        }
  );

  return (
    <header className="global-nav">
      <h1 className="global-nav__title">
        <Link to="/">
          <Logo />
        </Link>
      </h1>
      {auth.isAuthenticated() && (
        <nav className="global-nav__links">
          {/*
          Causes console error in dev env only due to this issue
          https://github.com/ReactTraining/react-media/issues/139
        */}
          <Media
            queries={{
              small: "(max-width: 767px)",
            }}
          >
            {(matches) => (
              <React.Fragment>
                {matches.small && <SmallFormatMenu {...menuProps} />}
                {!matches.small && <LargeFormatMenu {...menuProps} />}
              </React.Fragment>
            )}
          </Media>
        </nav>
      )}
    </header>
  );
};
