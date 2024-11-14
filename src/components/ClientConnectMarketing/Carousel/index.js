import { useRef, useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import ChevronRight from "components/icons/Marketing/chevronRight";
import ChevronLeft from "components/icons/Marketing/chevronLeft";
import { Box, IconButton, styled } from "@mui/material";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const cardGap = 24;

export function ScrollerCard({ children }) {
    return <div className={styles.scrollerCard}>{children}</div>;
}

ScrollerCard.propTypes = {
    children: PropTypes.node.isRequired,
};

const CustomBox = styled(Box)(({ isHovered }) => ({
    "&::-webkit-scrollbar": {
        width: "12px",
        height: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: isHovered ? "#bdbdbd" : "white",
        borderRadius: "10px",
        cursor: "pointer",
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "#fff",
        borderRadius: "10px",
    },
    "@media (max-width: 480px)": {
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
        },
    },
}));

const Scroller = ({ cards, cardRenderer, isHovered }) => {
    const cardsContainerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showLeftScrollButton, setShowLeftScrollButton] = useState(false);
    const [showRightScrollButton, setShowRightScrollButton] = useState(false);
    const [dimensions, setDimensions] = useState({
        height: 0,
        width: 0,
    });

    const scrollerButtonHandler = useCallback(
        (direction) => {
            if (!cardsContainerRef.current || !cardsContainerRef.current.children[0]) {
                return;
            }
            const { width: scrollerCardWidth } = cardsContainerRef.current.children[0].getBoundingClientRect();
            const newIndex = currentIndex + direction;
            const maxIndex = Math.max(Math.min(cards.length - 1, newIndex), 0);
            setCurrentIndex(maxIndex);
            cardsContainerRef.current.scroll({
                top: 0,
                left: maxIndex * scrollerCardWidth + maxIndex * cardGap,
                behavior: "smooth",
            });
        },
        [currentIndex, cards.length],
    );

    useEffect(() => {
        const debouncedHandleResize = debounce(() => {
            if (!cardsContainerRef.current) {
                return;
            }
            const { height, width } = cardsContainerRef.current.getBoundingClientRect();
            setDimensions({ height, width });
        }, 1000);

        window.addEventListener("resize", debouncedHandleResize);
        debouncedHandleResize();

        return () => window.removeEventListener("resize", debouncedHandleResize);
    }, []);

    useEffect(() => {
        if (!cardsContainerRef.current || !cardsContainerRef.current.children[0]) {
            return;
        }
        const { width: scrollerCardWidth } = cardsContainerRef.current.children[0].getBoundingClientRect();
        setShowLeftScrollButton(currentIndex * scrollerCardWidth > 0);
        setShowRightScrollButton(
            (cards.length - currentIndex) * (scrollerCardWidth + cardGap) >= dimensions.width + cardGap,
        );
    }, [dimensions.width, currentIndex, cards.length, isHovered]);

    const handleScroll = () => {
        if (!cardsContainerRef.current || !cardsContainerRef.current.children[0]) {
            return;
        }
        const { scrollLeft, clientWidth, scrollWidth } = cardsContainerRef.current;
        const { width: scrollerCardWidth } = cardsContainerRef.current.children[0].getBoundingClientRect();
        const newIndex = Math.round(scrollLeft / (scrollerCardWidth + cardGap));
        setCurrentIndex(newIndex);
        setShowLeftScrollButton(scrollLeft > 0);
        setShowRightScrollButton(scrollLeft + clientWidth < scrollWidth - 1);
    };

    return (
        <Box className={styles.scroller}>
            {showLeftScrollButton && (
                <Box
                    className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
                    onClick={() => scrollerButtonHandler(-1)}
                >
                    <IconButton size="lg" className={`${styles.integrityIcon} ${styles.integrityIconBg}`}>
                        <ChevronLeft />
                    </IconButton>
                </Box>
            )}
            <CustomBox
                className={styles.scrollerCards}
                ref={cardsContainerRef}
                onScroll={handleScroll}
                isHovered={isHovered}
            >
                {cards.map((card, index) => cardRenderer(card, index))}
            </CustomBox>
            {showRightScrollButton && (
                <Box
                    className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
                    onClick={() => scrollerButtonHandler(1)}
                >
                    <IconButton size="lg" className={`${styles.integrityIcon} ${styles.integrityIconBg}`}>
                        <ChevronRight />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

Scroller.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
    cardRenderer: PropTypes.func.isRequired,
    isHovered: PropTypes.bool.isRequired,
};

export default Scroller;
