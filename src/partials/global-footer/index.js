import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { Link } from 'react-router-dom';
import Logo from 'partials/logo';
import Media from 'react-media';
import analyticsService from 'services/analyticsService';
import usePortalUrl from 'hooks/usePortalUrl';
import { MobileFooter } from 'mobile/MobileFooter';

const GlobalFooter = ({ className = '', hideMedicareIcon, ...props }) => {
  const portalUrl = usePortalUrl();
  const [isMobile, setIsMobile] = useState(false);

  return (
    <>
      <Media
        query={'(max-width: 500px)'}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      {isMobile ? (
        <MobileFooter />
      ) : (
        <footer
          className={`global-footer text-muted  ${className}`}
          data-gtm="footer-wrapper"
          {...props}
        >
          <div className="global-footer__content sf-text-center">
            {hideMedicareIcon && (
              <Link to="/">
                <span className="visually-hidden">Medicare Center</span>
                <Logo aria-hidden="true" id="footerLogo" />
              </Link>
            )}
            <nav className="global-footer__links mt-4">
              <h2 className="visually-hidden">Additional Navigation</h2>
              <ul className="divided-hlist">
                <Media
                  queries={{
                    small: '(max-width: 767px)',
                  }}
                >
                  {(matches) =>
                    !matches.small ? (
                      <>
                        <li>
                          <Link
                            to="/help"
                            className={`link link--inherit ${analyticsService.clickClass(
                              'help-footer'
                            )}`}
                          >
                            Need Help?
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/learning-center"
                            className={`link link--inherit ${analyticsService.clickClass(
                              'learningcenter-footer'
                            )}`}
                          >
                            Learning Center
                          </Link>
                        </li>
                      </>
                    ) : null
                  }
                </Media>
                <li>
                  <a
                    href={`${portalUrl || ''}/terms`}
                    rel="noopener noreferrer"
                    className="link link--inherit"
                  >
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a
                    href={`${portalUrl || ''}/privacy`}
                    rel="noopener noreferrer"
                    className="link link--inherit"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </nav>
            <small className="global-footer__legal mt-4">
              <span>&copy; {new Date().getFullYear()}</span> <span>Integrity.</span> <span>All rights reserved.</span>
            </small>
          </div>
        </footer>
      )}
    </>
  );
};

GlobalFooter.propTypes = {
  className: PropTypes.string,
  hideMedicareIcon: PropTypes.bool
};

export default GlobalFooter;
