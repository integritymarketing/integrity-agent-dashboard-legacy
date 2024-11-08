import { useRef, useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import ChevronRight from "components/icons/Marketing/chevronRight";
import ChevronLeft from "components/icons/Marketing/chevronLeft";
import { Box, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const cardGap = 24;

export function ScrollerCard({ children }) {
    return <div className={styles.scrollerCard}>{children}</div>;
}

ScrollerCard.propTypes = {
    /** Content of the card */
    children: PropTypes.node.isRequired,
};

const Scroller = ({ cards, cardRenderer }) => {
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
            if (!cardsContainerRef.current || !cardsContainerRef.current.children[0]) return;
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
        [currentIndex, cards.length]
    );

    useEffect(() => {
        const debouncedHandleResize = debounce(() => {
            if (!cardsContainerRef.current) return;
            const { height, width } = cardsContainerRef.current.getBoundingClientRect();
            setDimensions({ height, width });
        }, 1000);

        window.addEventListener("resize", debouncedHandleResize);
        debouncedHandleResize();

        return () => window.removeEventListener("resize", debouncedHandleResize);
    }, []);

    useEffect(() => {
        if (!cardsContainerRef.current || !cardsContainerRef.current.children[0]) return;
        const { width: scrollerCardWidth } = cardsContainerRef.current.children[0].getBoundingClientRect();
        setShowLeftScrollButton(currentIndex * scrollerCardWidth > 0);
        setShowRightScrollButton(
            (cards.length - currentIndex) * (scrollerCardWidth + cardGap) >= dimensions.width + cardGap
        );
    }, [dimensions.width, currentIndex, cards.length]);

    const handleScroll = () => {
        if (!cardsContainerRef.current || !cardsContainerRef.current.children[0]) return;
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
            <Box className={styles.scrollerCards} ref={cardsContainerRef} onScroll={handleScroll}>
                {cards.map((card, index) => cardRenderer(card))}
            </Box>
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
    /** Array of card data objects to render */
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
    /** Function to render each card component */
    cardRenderer: PropTypes.func.isRequired,
};

export default Scroller;
