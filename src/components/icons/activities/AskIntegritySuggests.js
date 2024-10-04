import PropTypes from "prop-types";

const AskIntegritySuggests = ({ color = "#052A63", bgColor = "#F1FAFF" }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill={bgColor} />
        <g clip-path="url(#clip0_11003_50522)">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20 32C26.6274 32 32 26.6274 32 20C32 13.3726 26.6274 8 20 8C13.3726 8 8 13.3726 8 20C8 26.6274 13.3726 32 20 32Z"
                fill={color}
            />
            <path
                d="M28.5 20C28.5 24.6944 24.6944 28.5 20 28.5C15.3056 28.5 11.5 24.6944 11.5 20C11.5 15.3056 15.3056 11.5 20 11.5C24.6944 11.5 28.5 15.3056 28.5 20Z"
                stroke="white"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19.6871 15.001L19.6905 24.9982L16.2534 24.9995L16.2531 24.6876C17.4606 24.687 18.4403 23.7054 18.4399 22.4992L18.4384 17.5006C18.4378 16.2934 17.4575 15.3147 16.25 15.315V15.0022L19.6871 15.001Z"
                fill="white"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.3105 15.0012L20.314 24.9985L23.7498 24.9972V24.6854C22.5436 24.686 21.563 23.7051 21.5627 22.4989L21.5611 17.5003C21.5605 16.2928 22.5405 15.3134 23.7467 15.3131V15L20.3105 15.0012Z"
                fill="white"
            />
        </g>
        <defs>
            <clipPath id="clip0_11003_50522">
                <rect width="24" height="24" fill="white" transform="translate(8 8)" />
            </clipPath>
        </defs>
    </svg>
);

AskIntegritySuggests.propTypes = {
    color: PropTypes.string,
    bgColor: PropTypes.string,
};

export default AskIntegritySuggests;
