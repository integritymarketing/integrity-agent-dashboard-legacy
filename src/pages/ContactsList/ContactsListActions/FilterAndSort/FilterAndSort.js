import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";

import { useActiveFilters } from "hooks/useActiveFilters";

import ContactListFilterOptions from "packages/ContactListFilterOptions";
import ContactListSort from "packages/ContactListSort";
import Filter from "packages/Filter/Filter";

import CardView from "components/icons/version-2/CardView";
import FilterIcon from "components/icons/version-2/Filter";
import FilterActive from "components/icons/version-2/FilterActive";
import ListViewIcon from "components/icons/version-2/ListView";
import SortIcon from "components/icons/version-2/Sort";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";

const LIST_PATH = "/contacts/list";
const CARD_PATH = "/contacts/card";

function FilterAndSort() {
    const [sortToggle, setSortToggle] = useState(false);
    const [filterToggle, setFilterToggle] = useState(false);
    const { layout, setLayout, sort, setSort, resetData } = useContactsListContext();
    const { active = false } = useActiveFilters();
    const navigate = useNavigate();

    const switchLayout = () => {
        setLayout(layout === "list" ? "card" : "list");
        navigate(layout === "list" ? CARD_PATH : LIST_PATH);
        resetData();
    };

    return (
        <Box className={styles.customBox} display="flex" alignItems="flex-end">
            <Box className={styles.pointerBox}>
                <Box onClick={switchLayout}>{layout === "list" && <CardView />}</Box>
                <Box onClick={switchLayout} position="relative" top="7px">
                    {layout === "card" && <ListViewIcon />}
                </Box>
            </Box>
            <Filter
                Icon={SortIcon}
                ActiveIcon={SortIcon}
                heading="Sort by"
                open={sortToggle}
                onToggle={setSortToggle}
                filtered={active}
                content={<ContactListSort close={setSortToggle} sort={sort} setSort={(value) => setSort([value])} />}
            />
            <Filter
                Icon={FilterIcon}
                ActiveIcon={FilterActive}
                heading="Filter by"
                open={filterToggle}
                onToggle={setFilterToggle}
                filtered={active}
                content={<ContactListFilterOptions close={setFilterToggle} layout={layout} />}
            />
        </Box>
    );
}

export default FilterAndSort;
