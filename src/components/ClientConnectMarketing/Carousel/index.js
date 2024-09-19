import { useRef, useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import ChevronRight from "components/icons/Marketing/chevronRight";
import ChevronLeft from "components/icons/Marketing/chevronLeft";
import { Box, IconButton } from "@mui/material";
import styles from "./styles.module.scss";

export function ScrollerCard(props) {
    return <div className={styles.scorllerCard}>{props.children}</div>;
}

const Scroller = ({ cards, cardRenderer }) => {
    const cardsContainerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showLeftScrollButton, setShowLeftScrollButton] = useState(false);
    const [showRightScrollButton, setShowRightScrollButton] = useState(false);
    const [dimensions, setDimensions] = useState({
        height: 0,
        width: 0,
    });

    const scrollerButtonHandler = useCallback((direction, action) => {
        setCurrentIndex((val) => {
            const newIndex = val + direction;
            if (cards.length - 2 == newIndex && action === "right") {
                return Math.max(Math.max(cards.length, newIndex), 0);
            }
            return Math.max(Math.min(cards.length - 1, newIndex), 0);
        });
    }, []);

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            const { height, width } = cardsContainerRef.current.getBoundingClientRect();
            setDimensions({
                height,
                width,
            });
        }, 1000);
        window.addEventListener("resize", debouncedHandleResize);
        debouncedHandleResize();
        return () => {
            window.removeEventListener("resize", debouncedHandleResize);
        };
    }, []);

    useEffect(() => {
        const { width: scrollerCardWidth } = cardsContainerRef.current.children[0].getBoundingClientRect();
        setShowLeftScrollButton(currentIndex * scrollerCardWidth > 0);
        setShowRightScrollButton((cards.length - currentIndex) * (scrollerCardWidth + 10) > dimensions.width + 10);
        cardsContainerRef.current.scroll({
            top: 0,
            left: currentIndex * scrollerCardWidth + currentIndex * 10,
            behavior: "smooth",
        });
    }, [dimensions.height, dimensions.width, currentIndex, cards.length]);

    return (
        <Box className={styles.scroller}>
            {showLeftScrollButton && (
                <Box
                    className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
                    onClick={() => scrollerButtonHandler(-1, "left")}
                >
                    <IconButton size="lg" className={`${styles.integrityIcon} ${styles.integrityIconBg}`}>
                        <ChevronLeft />
                    </IconButton>
                </Box>
            )}
            <Box className={styles.scrollerCards} ref={cardsContainerRef}>
                {cards.map((card, index) => cardRenderer(card))}
            </Box>
            {showRightScrollButton && (
                <Box
                    className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
                    onClick={() => scrollerButtonHandler(1, "right")}
                >
                    <IconButton size="lg" className={`${styles.integrityIcon} ${styles.integrityIconBg}`}>
                        <ChevronRight />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default Scroller;
