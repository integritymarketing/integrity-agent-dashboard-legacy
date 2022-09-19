import React, { useState, useContext, useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import clientService from "services/clientsService";
import * as Sentry from "@sentry/react";
import FooterButtons from "packages/FooterButtons";
import StageStatusContext from "contexts/stageStatus";
import FilterTypeMenu from "./FilterTypeMenu";
import Reminders from "./Reminders";
import Stages from "./Stages";
import Tags from "./Tags";

export default function ContactListFilterOptions({ close, setFiltered }) {
  const [filterType, setFilterType] = useState("Stage");
  const [reminder, setReminder] = useState("");
  const [stages, setStages] = useState([]);
  const [tags, setTags] = useState([]);
  const { statusOptions } = useContext(StageStatusContext);

  const history = useHistory();
  const location = useLocation();

  const [tagsList, setTagsList] = useState([]);

  useEffect(() => {
    const getTags = async () => {
      try {
        const res = await clientService.getAllTagsByGroups();
        setTagsList([...res]);
      } catch (error) {
        Sentry.captureException(error);
      }
    };
    getTags();
  }, []);

  const TAGS = useMemo(() => {
    let list = [];
    tagsList.map((item, i) => {
      list = [...list, ...item.tags];
      return item;
    });
    return list;
  }, [tagsList]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const stages = queryParams.get("Stage");
    const tags = queryParams.get("Tags");
    let hasReminder = queryParams.get("HasReminder");
    hasReminder =
      hasReminder && hasReminder === "false"
        ? false
        : hasReminder === "true"
        ? true
        : null;
    let hasOverdueReminder = queryParams.get("HasOverdueReminder");
    hasOverdueReminder =
      hasOverdueReminder && hasOverdueReminder === "false"
        ? false
        : hasOverdueReminder === "true"
        ? true
        : null;
    let stageValues = stages ? stages.split(",").map(Number) : [];
    let tagValues = tags ? tags.split(",").map(Number) : [];

    let reminderValue;
    if (hasReminder) {
      reminderValue = "Active Reminders";
    } else if (hasOverdueReminder) {
      reminderValue = "Overdue Reminders";
    } else if (hasReminder === false && hasOverdueReminder === null) {
      reminderValue = "No Reminders Added";
    }
    if (
      (stages && stageValues.length > 0) ||
      (tags && tagValues.length > 0) ||
      hasOverdueReminder ||
      hasReminder
    ) {
      setReminder(reminderValue);
      setStages([...stageValues]);
      setTags([...tagValues]);
      setFiltered(true);
    } else {
      setReminder("");
      setStages([]);
      setTags([]);
      setFiltered(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const selectStage = (id) => {
    let isExist = stages?.findIndex((statusId) => statusId === id);
    let newStages = stages.slice();
    if (isExist > -1) {
      newStages.splice(isExist, 1);
    } else {
      newStages.push(id);
    }
    setStages([...newStages]);
  };

  const selectTag = (id) => {
    let isExist = tags?.findIndex((tagId) => tagId === id);
    let newTags = tags.slice();
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
    history.push(`/contacts/list`);
  };

  const onApply = () => {
    let pathname = location.pathname;
    let searchParams = new URLSearchParams(location.search);
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

    history.push({
      pathname: pathname,
      search: searchParams.toString(),
    });
    close();
  };

  const disableApplyButton =
    reminder === "" && stages?.length === 0 && tags?.length === 0;

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
      {filterType === "Reminders" && (
        <Reminders reminder={reminder} setReminder={setReminder} />
      )}
      {filterType === "Stage" && (
        <Stages
          statusOptions={statusOptions}
          selectStage={selectStage}
          stages={stages}
        />
      )}
      {filterType === "Tags" && (
        <Tags selectTag={selectTag} tags={tags} TAGS={TAGS} />
      )}

      <FooterButtons buttonOne={BUTTONS.reset} buttonTwo={BUTTONS.apply} />
    </>
  );
}
