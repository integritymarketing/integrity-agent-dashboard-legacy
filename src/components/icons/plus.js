const PlusIcon = ({ disabled, strokeColor = "#0052CE" }) => {
    const stroke = disabled ? "#94A3B8" : strokeColor;
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 0.875V13.125" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0.875 7H13.125" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default PlusIcon;
