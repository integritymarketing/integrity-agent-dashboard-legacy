export const ClusterSvg = (text) =>
    "data:image/svg+xml;charset=UTF-8;base64," +
    btoa(
        `<svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g>
                <rect width="40" height="40" rx="20" fill="#1157EE" />
                <text
                    x="50%"
                    y="50%"
                    fill="white"
                    dominant-baseline="middle"
                    text-anchor="middle"
                >
                    ${text || ""}
                </text>
            </g>
        </svg>`
    );
