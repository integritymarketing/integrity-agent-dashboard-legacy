import { useState, useEffect } from 'react';

function useLoadMore(initialItems, itemsPerPage) {
  const [items, setItems] = useState(initialItems);
  const [visibleItems, setVisibleItems] = useState(initialItems.slice(0, itemsPerPage));

  useEffect(() => {
    setItems(initialItems);
    setVisibleItems(initialItems.slice(0, itemsPerPage));
  }, [initialItems, itemsPerPage]);

  const loadMore = () => {
    const currentLastIndex = visibleItems.length;
    const newLastIndex = currentLastIndex + itemsPerPage;
    const newVisibleItems = items.slice(0, newLastIndex);
    setVisibleItems(newVisibleItems);
  };

  return {
    visibleItems,
    loadMore,
    hasMore: visibleItems.length < items.length,
  };
}

export default useLoadMore;
