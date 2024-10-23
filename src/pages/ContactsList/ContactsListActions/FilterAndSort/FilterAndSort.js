import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";


import { useActiveFilters } from "hooks/useActiveFilters";
import useAnalytics from "hooks/useAnalytics";

import ContactListSort from "packages/ContactListSort";
import Filter from "packages/FilterContacts/Filter";


import FilterIcon from "components/icons/version-2/Filter";
import FilterActive from "components/icons/version-2/FilterActive";
import SortIcon from "components/icons/version-2/Sort";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";
import ContactListFilterOptionsV2 from "packages/ContactListFilterOptionsV2";
import ContactLayoutViewDropdown from "packages/ContactLayoutViewDropdown/ContactLayoutViewDropdown";

const LIST_PATH = "/contacts/list";
const CARD_PATH = "/contacts/card";
const MAP_PATH = "/contacts/map";

function FilterAndSort() {
    const [sortToggle, setSortToggle] = useState(false);
    const { selectedFilterSections, setSelectedFilterSections } = useContactsListContext();
    const [filterToggle, setFilterToggle] = useState(false);
    const { layout, setLayout, sort, setSort, resetData } = useContactsListContext();
    const { active = false } = useActiveFilters();
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();


    const switchLayout = (newLayout) => {
        setLayout(newLayout);
        navigate(newLayout === "card" ? CARD_PATH : newLayout === "list" ? LIST_PATH : MAP_PATH);
        if (selectedFilterSections.length === 0) {
            resetData();
        }
    };

    const handleOnFilterToggle = (value) => {
        setFilterToggle(value);
        fireEvent("Closed Tag Filter");
        if (value === false) {
            const hasUnfinishedFilterSections = selectedFilterSections.filter(
                (item) => !item.selectedFilterOption
            ).length;
            if (hasUnfinishedFilterSections) {
                const newSelectedFilterSections = selectedFilterSections.filter((item) => item.selectedFilterOption);
                setSelectedFilterSections(newSelectedFilterSections);
            }
        }
    };

    const selectedFilterSectionsCount = selectedFilterSections.filter((item) => item.selectedFilterOption).length;

    return (
        <Box className={styles.customBox} display="flex" alignItems="flex-end">
            <ContactLayoutViewDropdown onSwitchLayout={switchLayout} currentLayout={layout} />
            <Filter
                Icon={SortIcon}
                ActiveIcon={SortIcon}
                heading="Sort by"
                open={sortToggle}
                onToggle={setSortToggle}
                isDisabled={layout === "map"}
                filtered={active}
                content={<ContactListSort close={setSortToggle} sort={sort} setSort={(value) => setSort([value])} />}
            />
            <Filter
                Icon={FilterIcon}
                ActiveIcon={FilterActive}
                filterOverrideClass={selectedFilterSectionsCount >= 1 ? styles.selectedFilterOneSection : ""}
                heading="Filter Contacts"
                open={filterToggle}
                selectedFilterSections={selectedFilterSections}
                countToDisplay={selectedFilterSectionsCount > 1 ? selectedFilterSectionsCount : null}
                onToggle={handleOnFilterToggle}
                filtered={active}
                content={<ContactListFilterOptionsV2 onFilterCountChange={setSelectedFilterSections} />}
            />
        </Box>
    );
}

export default FilterAndSort;
