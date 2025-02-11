import React from "react";

export const EditWithIcon = function () {
    return <svg xmlns="http://www.w3.org/2000/svg" width="99" height="62" viewBox="0 0 99 62">
        <defs>
            <filter id="btn" x="0" y="0" width="99" height="62" filterUnits="userSpaceOnUse">
                <feOffset dy="3" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feFlood flood-opacity="0.161" />
                <feComposite operator="in" in2="blur" />
                <feComposite in="SourceGraphic" />
            </filter>
        </defs>
        <g id="Button_Icon_Secondary_SM" data-name="Button Icon Secondary SM" transform="translate(15 12)">
            <g id="Group_7223" data-name="Group 7223" opacity="0">
                <g id="Button_BG" data-name="Button BG" opacity="0">
                    <g transform="matrix(1, 0, 0, 1, -15, -12)" filter="url(#btn)">
                        <rect id="btn-2" data-name="btn" width="69" height="32" rx="16" transform="translate(15 12)" fill="#4178ff" />
                    </g>
                </g>
                <g id="Button_BG-2" data-name="Button BG">
                    <rect id="btn-3" data-name="btn" width="69" height="32" rx="16" fill="#fff" />
                </g>
            </g>
            <g id="Edit" transform="translate(41 4)">
                <g id="Button_-_BG" data-name="Button - BG">
                    <rect id="bg" width="24" height="24" fill="#ff1717" opacity="0" />
                </g>
                <path id="icons_Edit.svg" data-name="icons/Edit.svg" d="M3783.063,519.974a3.146,3.146,0,0,1-3.186-3.1v-8.083a3.147,3.147,0,0,1,3.186-3.1h4.95a.487.487,0,1,1,0,.973h-4.95a2.16,2.16,0,0,0-2.186,2.128v8.083a2.16,2.16,0,0,0,2.186,2.127h8.306a2.159,2.159,0,0,0,2.186-2.127v-4.817a.5.5,0,0,1,1,0v4.817a3.147,3.147,0,0,1-3.186,3.1Zm2.895-6.343a.478.478,0,0,1-.127-.478l.853-2.91a.474.474,0,0,1,.127-.209l5.767-5.615a1.564,1.564,0,0,1,1.1-.445h0a1.566,1.566,0,0,1,1.1.445l.641.623a1.488,1.488,0,0,1,0,2.143l-.852.83,0,0,0,0-4.911,4.781a.49.49,0,0,1-.215.123l-2.991.832a.487.487,0,0,1-.137.019A.51.51,0,0,1,3785.958,513.631Zm1.653-3-.572,1.947,2-.558,4.467-4.349-1.429-1.391Zm5.676-5.526-.5.488,1.43,1.391.5-.488a.534.534,0,0,0,0-.767l-.641-.623a.568.568,0,0,0-.788,0Z" transform="translate(-3775.877 -499.974)" fill="#4178ff" />
            </g>
            <text id="Edit-2" data-name="Edit" transform="translate(16 21)" fill="#4178ff" font-size="14" font-family="Lato-Semibold, Lato" font-weight="600" letter-spacing="0.01em"><tspan x="0" y="0">Edit</tspan></text>
        </g>
    </svg>
}