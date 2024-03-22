import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Box from "@mui/material/Box";

import Button from '@mui/material/Button';
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
    const LightTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(() => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "transparent",
            color: '#717171',
            boxShadow: "none",
            fontSize: 12,
            border: "none"
        },
    }));

    const StyledBtn = styled(Button)(() => ({
        '&:hover': {
            backgroundColor: "transparent",
        },
    }));

    const switchLayout = () => {
        setLayout(layout === "list" ? "card" : "list");
        navigate(layout === "list" ? CARD_PATH : LIST_PATH);
        resetData();
    };

    return (
        <Box className={styles.customBox} display="flex" alignItems="flex-end">
            <Box className={styles.pointerBox}>
                <Box onClick={switchLayout}>
                    {layout === "list" && <LightTooltip title="Grid View" placement="top"><StyledBtn><CardView /></StyledBtn></LightTooltip>}
                </Box>
                <Box onClick={switchLayout}>
                    {layout === "card" && <LightTooltip title="List View" placement="top"><StyledBtn><ListViewIcon /></StyledBtn></LightTooltip>}
                </Box>
            </Box>
            <LightTooltip title="Sort" placement="top">
                <StyledBtn>
                    <Filter
                        Icon={SortIcon}
                        ActiveIcon={SortIcon}
                        heading="Sort by"
                        open={sortToggle}
                        onToggle={setSortToggle}
                        filtered={active}
                        content={<ContactListSort close={setSortToggle} sort={sort} setSort={(value) => setSort([value])} />}
                    />
                </StyledBtn>
            </LightTooltip>
            <LightTooltip title="Filter" placement="top">
                <StyledBtn>
                    <Filter
                        Icon={FilterIcon}
                        ActiveIcon={FilterActive}
                        heading="Filter by"
                        open={filterToggle}
                        onToggle={setFilterToggle}
                        filtered={active}
                        content={<ContactListFilterOptions close={setFilterToggle} layout={layout} />}
                    />
                </StyledBtn>
            </LightTooltip>
        </Box >
    );
}

export default FilterAndSort;