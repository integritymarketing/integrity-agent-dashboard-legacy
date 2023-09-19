import { useState, useCallback } from "react";

function useLoadMore(initialData, itemsPerPage) {
  const [data, setData] = useState(initialData);
  const [visibleData, setVisibleData] = useState(
    initialData.slice(0, itemsPerPage)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.length > 5);

  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    const endIndex = nextPage * itemsPerPage;
    setVisibleData(data.slice(0, endIndex));
    setCurrentPage(nextPage);
    setHasMore(visibleData.length < initialData.length);
  }, []);

  return {
    visibleData,
    loadMore,
    hasMore,
  };
}

export default useLoadMore;
