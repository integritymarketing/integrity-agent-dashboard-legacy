import React, { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClientServiceContext } from "services/clientServiceProvider";
import * as Sentry from "@sentry/react";
import FooterButtons from "packages/FooterButtons";
import StageStatusContext from "contexts/stageStatus";
import FilterTypeMenu from "./FilterTypeMenu";
import Reminders from "./Reminders";
import Stages from "./Stages";
import TagsByCategory from "./Tags";
import { useActiveFilters } from "hooks/useActiveFilters";

export default function ContactListFilterOptions({ close, layout }) {
    const [filterType, setFilterType] = useState("Stage");
    const [reminder, setReminder] = useState("");
    const [stages, setStages] = useState([]);
    const [tags, setTags] = useState([]);
    const { statusOptions } = useContext(StageStatusContext);
    const { tagValue = [], stageValue = [], reminderValue = "" } = useActiveFilters();
    const { clientsService } = useClientServiceContext();

    const navigate = useNavigate();
    const location = useLocation();

    const [tagsList, setTagsList] = useState([]);

    useEffect(() => {
        if (stageValue.length > 0 || tagValue.length > 0 || reminderValue !== "") {
            setReminder(reminderValue);
            setStages([...stageValue]);
            setTags([...tagValue]);
        } else {
            setReminder("");
            setStages([]);
            setTags([]);
        }
    }, [tagValue, stageValue, reminderValue]);

    useEffect(() => {
        const getTags = async () => {
            try {
                const res = await clientsService.getAllTagsByGroups();
                setTagsList([...res]);
            } catch (error) {
                Sentry.captureException(error);
            }
        };
        getTags();
    }, []);

    const selectStage = (id) => {
        const isExist = stages?.findIndex((statusId) => statusId === id);
        const newStages = stages.slice();
        if (isExist > -1) {
            newStages.splice(isExist, 1);
        } else {
            newStages.push(id);
        }
        setStages([...newStages]);
    };

    const defaultOpenDetails = useMemo(() => {
        const D_options = tagsList.map((item, i) => {
            const selected = item?.tags?.filter((a) => tags?.includes(a?.tagId));
            if (selected?.length > 0) {
                return {
                    key: item.tagCategoryName,
                    length: selected.length,
                };
            } else {
                return null;
            }
        });
        const filterValid = D_options?.filter((each) => each && each?.key);
        return filterValid;
    }, [tagsList, tags]);

    const selectTag = (id) => {
        const isExist = tags?.findIndex((tagId) => tagId === id);
        const newTags = tags.slice();
        if (isExist > -1) {
            newTags.splice(isExist, 1);
        } else {
            newTags.push(id);
        }
        setTags([...newTags]);
    };

    const onReset = () => {
        setReminder("");
        setStages([]);
        setTags([]);
        if (layout === "list") {
            navigate(`/contacts/list`);
        } else {
            navigate(`/contacts/card`);
        }
    };

    const onApply = () => {
        const pathname = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("Stage", stages);
        searchParams.set("Tags", tags);
        searchParams.delete("HasReminder");
        searchParams.delete("HasOverdueReminder");
        if (reminder === "Active Reminders") {
            searchParams.set("HasReminder", true);
        } else if (reminder === "Overdue Reminders") {
            searchParams.set("HasOverdueReminder", true);
        } else if (reminder === "No Reminders Added") {
            searchParams.set("HasReminder", false);
            searchParams.set("HasOverdueReminder", null);
        }

        navigate({
            pathname: pathname,
            search: searchParams.toString(),
        });
        close();
    };

    const disableApplyButton = reminder === "" && stages?.length === 0 && tags?.length === 0;

    const BUTTONS = {
        reset: {
            text: "Reset",
            onClick: onReset,
            disabled: false,
        },
        apply: {
            text: "Apply",
            onClick: onApply,
            disabled: disableApplyButton,
        },
    };
    return (
        <>
            <FilterTypeMenu filterType={filterType} setFilterType={setFilterType} />
            {filterType === "Reminders" && <Reminders reminder={reminder} setReminder={setReminder} />}
            {filterType === "Stage" && (
                <Stages statusOptions={statusOptions} selectStage={selectStage} stages={stages} />
            )}
            {filterType === "Tags" && (
                <TagsByCategory
                    selectTag={selectTag}
                    tags={tags}
                    TAGS={tagsList}
                    defaultOpenedList={defaultOpenDetails}
                />
            )}

            <FooterButtons buttonOne={BUTTONS.reset} buttonTwo={BUTTONS.apply} />
        </>
    );
}
