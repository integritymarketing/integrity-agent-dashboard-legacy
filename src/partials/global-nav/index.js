import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "contexts/auth";
import Media from "react-media";
import LargeFormatMenu from "./large-format";
import SmallFormatMenu from "./small-format";
import Logo from "partials/logo";
import Modal from "components/ui/modal";
import ContactInfo from "partials/contact-info";
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
        <ContactInfo />
      </Modal>
    </React.Fragment>
  );
};

export default ({
  color = "default",
  menuHidden = false,
  className = "",
  ...props
}) => {
  const auth = useContext(AuthContext);
  const [navOpen, setNavOpen] = useState(false);

  const menuProps = Object.assign(
    {
      navOpen,
      setNavOpen,
    },
    auth.isAuthenticated() && !menuHidden
      ? {
          primary: [
            {
              component: HelpButtonWithModal,
              label: "Need Help?",
              format: "large",
            },
            {
              component: Link,
              props: { to: "/resources" },
              label: "Learning Center",
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
    <header className={`global-nav ${className}`} {...props}>
      <h1 className="global-nav__title">
        <Link to="/">
          <Logo {...{ color }} />
        </Link>
      </h1>
      {auth.isAuthenticated() && !menuHidden && (
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
