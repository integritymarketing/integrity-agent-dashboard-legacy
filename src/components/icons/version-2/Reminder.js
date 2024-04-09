export const Reminder = ({ color = "#4178FF" }) => (
    <svg
        id="Reminder_Status"
        data-name="Reminder Status"
        xmlns="http://www.w3.org/2000/svg"
        width="52"
        height="40"
        viewBox="0 0 28 40"
    >
        <g id="Group_9227" data-name="Group 9227">
            <g id="IconCircleBG">
                <circle id="Ellipse_299" data-name="Ellipse 299" cx="20" cy="20" r="20" fill="#f1faff" />
            </g>
            <g id="IconCircleBG-2" data-name="IconCircleBG" transform="translate(8 8)">
                <g id="Ellipse_299-2" data-name="Ellipse 299" fill="#fff" stroke={color} stroke-width="1">
                    <circle cx="12" cy="12" r="12" stroke="none" />
                    <circle cx="12" cy="12" r="11.5" fill="none" />
                </g>
            </g>
            <g id="Reminder_Updated" data-name="Reminder Updated" transform="translate(8 8)">
                <g id="Button_-_BG" data-name="Button - BG">
                    <rect id="bg" width="24" height="24" fill="#ff1717" opacity="0" />
                </g>
                <g id="icon" transform="translate(5 4)">
                    <path
                        id="Path_22065"
                        data-name="Path 22065"
                        d="M6.5.5a.5.5,0,0,1,1,0v.525A5,5,0,0,1,12,6v.909a5.165,5.165,0,0,0,1.509,3.644l.088.088A1.383,1.383,0,0,1,12.618,13H1.384a1.385,1.385,0,0,1-.977-2.365l.087-.088A5.162,5.162,0,0,0,2,6.909V6A5,5,0,0,1,6.5,1.025ZM7,2A4,4,0,0,0,3,6v.909A6.145,6.145,0,0,1,1.2,11.26l-.084.084A.379.379,0,0,0,1,11.615.384.384,0,0,0,1.384,12H12.616a.385.385,0,0,0,.272-.656l-.088-.088A6.154,6.154,0,0,1,11,6.906V6A4,4,0,0,0,7,2ZM6.056,14.334a1,1,0,0,0,1.888,0,.5.5,0,0,1,.944.332,2,2,0,0,1-3.775,0,.5.5,0,1,1,.943-.332"
                        fill={color}
                    />
                </g>
            </g>
            <g id="StatusCount" transform="translate(36 12)" opacity="0">
                <g id="Ellipse_720" data-name="Ellipse 720" fill="#f1faff" stroke="#fff" stroke-width="1">
                    <circle cx="8" cy="8" r="8" stroke="none" />
                    <circle cx="8" cy="8" r="7.5" fill="none" />
                </g>
                <text
                    id="_3"
                    data-name="3"
                    transform="translate(4 13)"
                    fill={color}
                    font-size="13"
                    font-family="Lato-Regular, Lato"
                >
                    <tspan x="0" y="0">
                        3
                    </tspan>
                </text>
            </g>
        </g>
    </svg>
);