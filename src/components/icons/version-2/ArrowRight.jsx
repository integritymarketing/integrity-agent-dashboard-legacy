const ArrowRight = ({ strokeColor = "#4178ff" }) => {
    return (
        <svg
            id="Arrow_Point"
            data-name="Arrow Point"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
        >
            <g id="Button_-_BG" data-name="Button - BG">
                <rect id="bg" width="24" height="24" fill="#ff1717" opacity="0" />
            </g>
            <g id="Group_7197" data-name="Group 7197" transform="translate(-294 -632)">
                <line
                    id="Line_1152"
                    data-name="Line 1152"
                    x1="4.5"
                    y2="4.5"
                    transform="translate(312 649) rotate(180)"
                    fill="none"
                    stroke={strokeColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                />
                <line
                    id="Line_1153"
                    data-name="Line 1153"
                    x1="4.5"
                    y1="4.5"
                    transform="translate(312 644.5) rotate(180)"
                    fill="none"
                    stroke={strokeColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                />
                <line
                    id="Line_1154"
                    data-name="Line 1154"
                    x2="12"
                    transform="translate(312 644.5) rotate(180)"
                    fill="none"
                    stroke={strokeColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                />
            </g>
        </svg>
    );
};

export default ArrowRight;
