export const Add = ({ color = "#ff1717" }) => {
    return (
        <svg
            id="Circle_Icon"
            data-name="Circle Icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
        >
            <g id="Add">
                <g id="Button_-_BG" data-name="Button - BG">
                    <rect id="bg" width="24" height="24" fill={color} opacity="0" />
                </g>
                <g id="icon" transform="translate(0.5 0.5)">
                    <line
                        id="Line_653"
                        data-name="Line 653"
                        y2="10"
                        transform="translate(11.5 6.5)"
                        fill="none"
                        stroke={color}
                        strokeLinecap="round"
                        strokeWidth="1"
                    />
                    <line
                        id="Line_654"
                        data-name="Line 654"
                        x2="10"
                        transform="translate(6.5 11.5)"
                        fill="none"
                        stroke={color}
                        strokeLinecap="round"
                        strokeWidth="1"
                    />
                </g>
            </g>
            <g id="Path_21294" data-name="Path 21294" fill="none" strokeLinecap="round">
                <path d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Z" stroke="none" id="Icon_Add_path" />
                <path
                    id="Icon_circle_path"
                    d="M 12 1 C 9.061790466308594 1 6.299449920654297 2.144199371337891 4.221820831298828 4.221820831298828 C 2.144199371337891 6.299449920654297 1 9.061790466308594 1 12 C 1 14.93820953369141 2.144199371337891 17.7005500793457 4.221820831298828 19.77817916870117 C 6.299449920654297 21.85580062866211 9.061790466308594 23 12 23 C 14.93820953369141 23 17.7005500793457 21.85580062866211 19.77817916870117 19.77817916870117 C 21.85580062866211 17.7005500793457 23 14.93820953369141 23 12 C 23 9.061790466308594 21.85580062866211 6.299449920654297 19.77817916870117 4.221820831298828 C 17.7005500793457 2.144199371337891 14.93820953369141 1 12 1 M 12 0 C 18.62742042541504 0 24 5.372579574584961 24 12 C 24 18.62742042541504 18.62742042541504 24 12 24 C 5.372579574584961 24 0 18.62742042541504 0 12 C 0 5.372579574584961 5.372579574584961 0 12 0 Z"
                    stroke="none"
                    fill={color}
                />
            </g>
        </svg>
    );
};
