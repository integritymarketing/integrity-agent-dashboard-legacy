export const PinMarkerSvg = (color = "#4178FF") => {
    return (
        `data:image/svg+xml;charset=UTF-8;base64,${btoa(
            `<svg width="48" height="48" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_13071_27802)">
            <path d="M16.0003 2C18.4756 2.00025 20.8494 2.98022 22.5997 4.72438C24.35 6.46854 25.3334 8.83406 25.3337 11.3007C25.3337 15.6986 18.4889 26.6531 16.5239 29.7144C16.4678 29.8021 16.3905 29.8743 16.2991 29.9244C16.2074 29.974 16.1047 30 16.0003 30C15.896 30 15.7933 29.974 15.7015 29.9244C15.6101 29.8743 15.5328 29.8021 15.4768 29.7144C13.5117 26.654 6.66699 15.6986 6.66699 11.3007C6.66724 8.83406 7.65065 6.46854 9.40094 4.72438C11.1512 2.98022 13.525 2.00025 16.0003 2Z" fill="white"/>
            </g>
            <path d="M12 11.3314C11.9996 12.2569 12.3201 13.1539 12.9069 13.8696C13.4938 14.5853 14.3106 15.0753 15.2183 15.2562C16.1259 15.437 17.0682 15.2976 17.8846 14.8615C18.7009 14.4255 19.3408 13.7199 19.6952 12.8649C20.0495 12.0099 20.0965 11.0585 19.828 10.1728C19.5594 9.28711 18.9921 8.52193 18.2226 8.00767C17.4531 7.49341 16.5291 7.26189 15.6081 7.35256C14.687 7.44324 13.8259 7.8505 13.1715 8.50495C12.8001 8.87599 12.5055 9.3166 12.3044 9.80159C12.1034 10.2866 12 10.8064 12 11.3314Z" fill="${color}"/>
            <defs>
            <filter id="filter0_d_13071_27802" x="3.86651" y="1.4399" width="24.268" height="33.601" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2.24038"/>
            <feGaussianBlur stdDeviation="1.40024"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_13071_27802"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_13071_27802" result="shape"/>
            </filter>
            </defs>
            </svg>
            `
        )}`
    );
};
