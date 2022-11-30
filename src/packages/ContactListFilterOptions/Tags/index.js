import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import styles from "./styles.module.scss";
import CheckMark from "../CheckMarkIcon/CheckMark";
import TagIcon from "components/icons/tag";

const StageList = ({ row, selectTag, tags }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "8px 2px",
        cursor: "pointer",
        borderBottom: "1px solid lightgrey",
        "&:last-child": {
          borderBottom: "unset",
        },
      }}
      onClick={() => selectTag(row?.tagId)}
      key={row.tagLabel}
    >
      <div>
        <Typography
          sx={{ color: "#434A51", fontSize: "16px" }}
          variant={"subtitle1"}
        >
          <div className={styles.stageFilters}>
            <TagIcon /> <span className={styles.tagName}>{row.tagLabel}</span>
          </div>
        </Typography>
      </div>

      <CheckMark
        show={tags?.findIndex((id) => id === row?.tagId) > -1 ? true : false}
      />
    </Box>
  );
};

function Tags({ tags, selectTag, TAGS }) {
  const length = TAGS?.length;
  const halfLength = Math.round(length / 2);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        borderRadius: 3,
        marginTop: "18px",
        justifyContent: "space-between",
      }}
    >
      <div className={styles.listContainer}>
        {TAGS &&
          TAGS.map((row, i) => {
            if (i >= 0 && i < halfLength) {
              return (
                <StageList
                  row={row}
                  selectTag={selectTag}
                  tags={tags}
                  key={`firstTags-${i}`}
                />
              );
            } else return null;
          })}
      </div>
      <div className={styles.listContainer}>
        {TAGS &&
          TAGS.map((row, i) => {
            if (i >= halfLength && i < length) {
              return (
                <StageList
                  row={row}
                  selectTag={selectTag}
                  tags={tags}
                  key={`secondTags-${i}`}
                />
              );
            } else return null;
          })}
      </div>
    </Box>
  );
}

export default function TagsByCategory({
  tags,
  selectTag,
  TAGS,
  defaultOpenedList,
}) {
  const [openTags, setOpenTags] = useState([...defaultOpenedList]);

  const handleOpenTags = (tag) => {
    if (openTags.includes(tag)) {
      let index = openTags.indexOf(tag);
      openTags.splice(index, 1);
      setOpenTags([...openTags]);
    } else {
      setOpenTags([...openTags, tag]);
    }
  };

  const isOpen = (item) => {
    return openTags?.includes(item) ? true : false;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: 3,
        marginTop: "18px",
        justifyContent: "space-between",
      }}
    >
      {TAGS &&
        TAGS.map((row, i) => {
          return (
            <div key={`categoris-${i}`}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  borderRadius: 3,
                  marginTop: "18px",
                  justifyContent: "space-between",
                }}
              >
                <p className={styles.tagCategoryName}>{row?.tagCategoryName}</p>
                <div
                  className={styles.openClose}
                  onClick={() => handleOpenTags(row?.tagCategoryName)}
                >
                  {isOpen(row?.tagCategoryName) ? "-" : "+"}
                </div>
              </Box>
              {isOpen(row?.tagCategoryName) && (
                <Tags TAGS={row?.tags} selectTag={selectTag} tags={tags} />
              )}
            </div>
          );
        })}
    </Box>
  );
}