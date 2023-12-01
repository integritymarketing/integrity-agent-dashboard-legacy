export const Complete = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="141" height="62" viewBox="0 0 141 62">
        <defs>
            <filter id="btn" x="0" y="0" width="141" height="62" filterUnits="userSpaceOnUse">
                <feOffset dy="3" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feFlood flood-opacity="0.251" />
                <feComposite operator="in" in2="blur" />
                <feComposite in="SourceGraphic" />
            </filter>
        </defs>
        <g id="Group_7223" data-name="Group 7223" transform="translate(15 12)">
            <g id="Button_BG" data-name="Button BG" opacity="0">
                <g transform="matrix(1, 0, 0, 1, -15, -12)" filter="url(#btn)">
                    <rect id="btn-2" data-name="btn" width="111" height="32" rx="16" transform="translate(15 12)" fill="#4178ff" />
                </g>
            </g>
            <g id="Button_BG-2" data-name="Button BG">
                <rect id="btn-3" data-name="btn" width="111" height="32" rx="16" fill="#4178ff" />
            </g>
        </g>
    </svg>
)