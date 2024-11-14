import { useState, useCallback } from "react";

const useHover = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    return {
        isHovered,
        handleMouseEnter,
        handleMouseLeave,
    };
};

export default useHover;
