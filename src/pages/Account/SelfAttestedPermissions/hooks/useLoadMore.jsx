import { useEffect, useState } from "react";

function useLoadMore(initialItems, itemsPerPage) {
    const [items, setItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState([]);

    useEffect(() => {
        if (Array.isArray(initialItems)) {
            setItems(initialItems);
            setVisibleItems(initialItems.slice(0, itemsPerPage));
        }
    }, [initialItems, itemsPerPage]);

    const loadMore = () => {
        if (items.length) {
            const currentLastIndex = visibleItems.length;
            const newLastIndex = currentLastIndex + itemsPerPage;
            const newVisibleItems = items.slice(0, newLastIndex);
            setVisibleItems(newVisibleItems);
        }
    };

    return {
        visibleItems,
        loadMore,
        hasMore: visibleItems.length < items.length,
    };
}

export default useLoadMore;
