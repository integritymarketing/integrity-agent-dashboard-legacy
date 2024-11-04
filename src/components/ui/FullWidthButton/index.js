import React from "react";
import PropTypes from "prop-types";
import { Button } from "../Button";

function FullWidthButton({
    type,
    label,
    iconPosition,
    icon,
    iconOnly,
    href,
    linkTo,
    className,
    disabled,
    onClick,
    ...props
}) {
    return (
        <>
            <Button
                fullWidth
                type={type}
                label={label}
                disabled={disabled}
                onClick={onClick}
                icon={icon}
                iconPosition={iconPosition}
                iconOnly={iconOnly}
                href={href}
                linkTo={linkTo}
                className={className}
                {...props}
            />
        </>
    );
}

FullWidthButton.propTypes = {

    type: PropTypes.oneOf(["primary", "secondary", "tertiary"]),

    label: PropTypes.string.isRequired,

    onClick: PropTypes.func,

    disabled: PropTypes.bool,

    icon: PropTypes.node,

    iconPosition: PropTypes.oneOf(["left", "right"]),

    iconOnly: PropTypes.bool,

    href: PropTypes.string,

    linkTo: PropTypes.string,

    className: PropTypes.string,
};

FullWidthButton.defaultProps = {
    type: "primary",
    onClick: undefined,
    disabled: false,
    iconPosition: "left",
    iconOnly: false,
    href: null,
    linkTo: null,
    className: "",
};

export default FullWidthButton;
