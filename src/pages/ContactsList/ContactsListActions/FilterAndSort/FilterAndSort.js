import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import Button from "@mui/material/Button";
import { useActiveFilters } from "hooks/useActiveFilters";
import useAnalytics from "hooks/useAnalytics";

import ContactListSort from "packages/ContactListSort";
import Filter from "packages/FilterContacts/Filter";

import CardView from "components/icons/version-2/CardView";
import FilterIcon from "components/icons/version-2/Filter";
import FilterActive from "components/icons/version-2/FilterActive";
import ListViewIcon from "components/icons/version-2/ListView";
import SortIcon from "components/icons/version-2/Sort";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";
import ContactListFilterOptionsV2 from "packages/ContactListFilterOptionsV2";

const LIST_PATH = "/contacts/list";
const CARD_PATH = "/contacts/card";

function FilterAndSort() {
    const [sortToggle, setSortToggle] = useState(false);
    const { selectedFilterSections, setSelectedFilterSections } = useContactsListContext();
    const [filterToggle, setFilterToggle] = useState(false);
    const { layout, setLayout, sort, setSort, resetData } = useContactsListContext();
    const { active = false } = useActiveFilters();
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();

    const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
        () => ({
            [`& .${tooltipClasses.tooltip}`]: {
                backgroundColor: "transparent",
                color: "#717171",
                boxShadow: "none",
                fontSize: 12,
                border: "none",
            },
        })
    );

    const StyledBtn = styled(Button)(() => ({
        padding: 0,
        marginTop: "-5px",
        minWidth: "auto",
        "&:hover": {
            backgroundColor: "transparent",
        },
    }));

    const switchLayout = () => {
        setLayout(layout === "list" ? "card" : "list");
        navigate(layout === "list" ? CARD_PATH : LIST_PATH);
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
            <Box className={styles.pointerBox} onClick={switchLayout}>
                {layout === "list" && (
                    <LightTooltip title="Grid View" placement="top">
                        <StyledBtn>
                            <CardView />
                        </StyledBtn>
                    </LightTooltip>
                )}
                {layout === "card" && (
                    <LightTooltip title="List View" placement="top">
                        <StyledBtn>
                            <ListViewIcon />
                        </StyledBtn>
                    </LightTooltip>
                )}
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
