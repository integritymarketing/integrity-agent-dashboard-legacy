import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "contexts/auth";
import Media from "react-media";
import LargeFormatMenu from "./large-format";
import SmallFormatMenu from "./small-format";
import Logo from "partials/logo";
import "./index.scss";

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
              component: Link,
              props: { to: "/help" },
              label: "Need Help?",
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
          primary: [
            {
              component: Link,
              props: { to: "/" },
              label: "Login",
            },
          ],
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
    </header>
  );
};
