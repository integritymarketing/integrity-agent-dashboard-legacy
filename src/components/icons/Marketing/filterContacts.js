import PropTypes from "prop-types";

const FilterContacts = ({ width = "32", height = "32" }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 11.3334H24" stroke="#4178FF" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8 16H24" stroke="#4178FF" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8 20.6666H24" stroke="#4178FF" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M11.9998 12.6667C12.7362 12.6667 13.3332 12.0697 13.3332 11.3333C13.3332 10.597 12.7362 10 11.9998 10C11.2635 10 10.6665 10.597 10.6665 11.3333C10.6665 12.0697 11.2635 12.6667 11.9998 12.6667Z"
            fill="#F1F1F1"
            stroke="#4178FF"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M19.3333 17.3333C20.0697 17.3333 20.6667 16.7363 20.6667 16C20.6667 15.2636 20.0697 14.6666 19.3333 14.6666C18.597 14.6666 18 15.2636 18 16C18 16.7363 18.597 17.3333 19.3333 17.3333Z"
            fill="#F1F1F1"
            stroke="#4178FF"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M13.9998 22C14.7362 22 15.3332 21.4031 15.3332 20.6667C15.3332 19.9303 14.7362 19.3334 13.9998 19.3334C13.2635 19.3334 12.6665 19.9303 12.6665 20.6667C12.6665 21.4031 13.2635 22 13.9998 22Z"
            fill="#F1F1F1"
            stroke="#4178FF"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
);

FilterContacts.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
};

export default FilterContacts;
