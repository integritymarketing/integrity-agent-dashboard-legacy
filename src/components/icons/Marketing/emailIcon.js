import PropTypes from "prop-types";

const EmailIcon = ({ width = "32", height = "32" }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_4800_50080)">
            <rect width={width} height={height} rx="16" fill="#F1FAFF" />
            <path
                d="M9.25 10.2949C8.61719 10.2949 8.125 10.8223 8.125 11.4199V12.8262L14.9805 17.8887C15.5781 18.3105 16.3867 18.3105 16.9844 17.8887L23.875 12.8262V11.4199C23.875 10.8223 23.3477 10.2949 22.75 10.2949H9.25ZM8.125 14.2324V20.4199C8.125 21.0527 8.61719 21.5449 9.25 21.5449H22.75C23.3477 21.5449 23.875 21.0527 23.875 20.4199V14.2324L17.6523 18.8027C16.668 19.5059 15.2969 19.5059 14.3125 18.8027L8.125 14.2324ZM7 11.4199C7 10.1895 7.98438 9.16992 9.25 9.16992H22.75C23.9805 9.16992 25 10.1895 25 11.4199V20.4199C25 21.6855 23.9805 22.6699 22.75 22.6699H9.25C7.98438 22.6699 7 21.6855 7 20.4199V11.4199Z"
                fill="#4178FF"
            />
        </g>
        <defs>
            <clipPath id="clip0_4800_50080">
                <rect width={width} height={height} rx="16" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

EmailIcon.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
};

export default EmailIcon;
