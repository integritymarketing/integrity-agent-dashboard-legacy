import React, { createContext, useState, useMemo } from "react";

const BackNavContext = createContext({
    pages: [],
});

export const BackNavProvider = (props) => {
    const [pages, setPages] = useState([]);

    const previousPage = useMemo(() => {
        return pages[1] || "";
    }, [pages]);

    const setCurrentPage = (page) => {
        setPages((pages) => {
            return [
                page,
                pages[0], // Removeining pages many not be required at this point.
            ];
        });
    };
    return <BackNavContext.Provider value={{ previousPage, setCurrentPage }} {...props} />;
};

export default BackNavContext;
