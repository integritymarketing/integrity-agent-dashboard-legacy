import React, { useEffect, useState, useMemo } from "react";
import Container from "components/ui/container";
import StageSelect from "./StageSelect";
import { formatPhoneNumber } from "utils/phones";
import { getMMDDYY } from "utils/dates";
import styles from "../ContactsPage.module.scss";
import { formatAddress, getMapUrl } from "utils/address";
import Editicon from "components/icons/edit-details";
import CallScriptSvg from "images/call-script.svg";
import TagSvg from "components/icons/tag-svg";
import TagIcon from "components/icons/tag-icon";
import ButtonExpand from "components/icons/btn-expand";
import RoundCheck from "components/icons/round-check";
import RoundClose from "components/icons/round-close";
import TagEdit from "images/tag-edit.svg";
import { CallScriptModal } from "packages/CallScriptModal";
import PrimaryContactPhone from "pages/contacts/PrimaryContactPhone";
import { Popover as TinyPopover } from "react-tiny-popover";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import Check from "components/icons/check-blue";
import { Button } from "components/ui/Button";
import useToast from "hooks/useToast";
import Close from "components/icons/close";

const NOT_AVAILABLE = "N/A";
const RECOMMENDATIONS_TAG_NAME = "Recommendations";

function TagsIcon({ leadsId, leadTags, onUpdateTags }) {
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [tagsByCategory, setTagsByCategory] = useState([]);
  const initialState = leadTags?.map((st) => st.tag.tagId) || [];
  const [selectedTagsIds, setSelectedTagsIds] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedList, setExpandedList] = useState({});
  const [serverTags, setServerTags] = useState([]);

  const [newTagVal, setNewTagVal] = useState("");
  const [isShowingCreate, setIsShowingCreate] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const addToast = useToast();
  function toggleTagSelection(e, tagId) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setSelectedTagsIds((selTagIds) => {
      return selTagIds.includes(tagId)
        ? selTagIds.filter((id) => id !== tagId)
        : [...selTagIds, tagId];
    });
  }
  async function handleSaveTags(e) {
    const otherCatId = tagsByCategory?.find(
      (t) => t.tagCategoryName === "Other"
    )?.tagCategoryId;

    await handleSaveNewTag(e, otherCatId);

    setIsProcessing(true);
    clientsService
      .updateLeadsTags(leadsId, selectedTagsIds)
      .then((data) => {
        setTagModalOpen(false);
        setIsProcessing(false);
        onUpdateTags();
        addToast({
          type: "success",
          message: "Successfully Updated the Tags",
        });
      })
      .catch((error) => {
        setIsProcessing(false);
        Sentry.captureException(error);
        addToast({
          type: "error",
          message: "Error Updating the Tags",
        });
      });
  }
  function handleResetTags() {
    setSelectedTagsIds([]);
  }

  function fetchTags() {
    clientsService
      .getTagsGroupByCategory()
      .then((data) => {
        setServerTags(JSON.parse(JSON.stringify(data)));
        setTagsByCategory(data);
      })
      .catch((error) => {
        Sentry.captureException(error);
      });
  }
  useEffect(() => {
    setExpandedList(
      tagsByCategory.reduce((acc, cat) => {
        if (cat.tagCategoryName === RECOMMENDATIONS_TAG_NAME) {
          acc[cat.tagCategoryId] = true;
        }
        return acc;
      }, {})
    );
  }, [tagsByCategory]);
  useEffect(() => {
    if (tagModalOpen) {
      fetchTags();
    }
  }, [tagModalOpen]);
  const totalTags = useMemo(() => {
    return tagsByCategory?.reduce(
      (acc, item) => acc + item.tags?.length || 0,
      0
    );
  }, [tagsByCategory]);
  function handleClose() {
    if (isProcessing) return;
    setSelectedTagsIds(initialState);
    setTagsByCategory(serverTags);
    setTagModalOpen(false);
    setEditingTag(null);
    setIsShowingCreate(false);
    setNewTagVal("");
  }
  function handleToggleExpand(catId) {
    setExpandedList((expList) => ({ ...expList, [catId]: !expList[catId] }));
  }

  function handleCreateTag(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsShowingCreate(true);
  }

  function isAlphanumeric(str) {
    if (!str) return false;

    if (isRepeating(str, " ")) {
      return false;
    }

    if (isRepeating(str, "-")) {
      return false;
    }

    if (isRepeating(str, "_")) {
      return false;
    }

    return str.match(/^[a-zA-Z0-9-_\s]+$/);
  }

  function isRepeating(str, char) {
    return str.split(char).length > 2;
  }

  async function handleSaveNewTag(e, tagCategoryId) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (newTagVal === "") return;

    if (
      (newTagVal || "").length > 10 ||
      (newTagVal || "").length < 2 ||
      !isAlphanumeric(newTagVal || "")
    ) {
      addToast({
        type: "error",
        message:
          "Tag length should be between 2 and 10, and only allow alphanumeric, single space, single hyphen(-), single underscore(_)",
        time: 3000,
      });
      return Promise.reject();
    }

    try {
      const resp = await clientsService.saveTag({
        leadsId,
        tagCategoryId,
        tagLabel: newTagVal,
      });
      console.log({ resp });
      fetchTags();
      setIsShowingCreate(false);
      setNewTagVal("");
    } catch (e) {
      console.log(e);
      addToast({
        type: "error",
        message: "Error creating tag",
      });
    }
  }

  function handleEditTag(e, { tagCategoryId, tag }) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    setEditingTag({ tagCategoryId, tag, editVal: tag.tagLabel });
  }

  function handleChangeEdittagVal(e) {
    setEditingTag({ ...editingTag, editVal: e.target.value });
  }

  async function handleDeleteTag(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    try {
      const resp = await clientsService.deleteTag({
        tagId: editingTag.tag.tagId,
      });
      if (!resp) {
        addToast({
          type: "error",
          message: "Error deleting tag",
        });
        return;
      }
      fetchTags();
    } catch (e) {
      console.log(e);
      addToast({
        type: "error",
        message: "Error deleting tag",
      });
    }

    setSelectedTagsIds((selTagIds) => {
      return selTagIds.filter((id) => id !== editingTag.tag.tagId);
    });
    setEditingTag(null);
  }

  async function handleSaveEditTag(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (
      (editingTag.editVal || "").length > 10 ||
      (editingTag.editVal || "").length < 2 ||
      !isAlphanumeric(editingTag.editVal || "")
    ) {
      addToast({
        type: "error",
        message:
          "Tag length should be between 2 and 10, and only allow alphanumeric, single space, single hyphen(-), single underscore(_)",
        time: 3000,
      });
      return;
    }

    try {
      const resp = await clientsService.saveTag({
        tagId: editingTag.tag.tagId,
        leadsId,
        tagCategoryId: editingTag.tagCategoryId,
        tagLabel: editingTag.editVal,
      });
      console.log({ resp });
      fetchTags();
      setEditingTag(null);
    } catch (e) {
      console.log(e);
      addToast({
        type: "Error",
        message: "Error saving tag",
      });
    }
  }

  return (
    <TinyPopover
      onClickOutside={handleClose}
      isOpen={tagModalOpen}
      positions={["bottom", "top"]}
      content={
        <div className={styles.tagsModal}>
          <div
            onClick={handleClose}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Close />
          </div>
          <div className={styles.tagsModalHeader}>
            <h1 className={styles.tagHeader}>Manage Tags</h1>
            <div className={styles.tagCount}>{totalTags}</div>
          </div>
          {tagsByCategory?.map((tg) => {
            if (!tg.tagCategoryName === "Other" && !tg.tags?.length) {
              return null;
            }
            const isReccommendations = tg.tagCategoryName === "Recommendations";
            const isExpanded =
              isReccommendations || expandedList[tg.tagCategoryId];
            const tags = tg.tags || [];

            if (!tags.length) {
              return null;
            }

            return (
              <div key={tg.tagCategoryId}>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryName}>
                    {tg.tagCategoryName}
                  </div>
                  <div onClick={() => handleToggleExpand(tg.tagCategoryId)}>
                    {isExpanded ? (
                      tg.tagCategoryName !== RECOMMENDATIONS_TAG_NAME ? (
                        <span className={styles.expandIcons}>-</span>
                      ) : null
                    ) : (
                      <span className={styles.expandIcons}>+</span>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <div>
                    <div className={styles.tagCategoryId}>
                      {tags.map((tag) =>
                        editingTag?.tag.tagId === tag.tagId ? (
                          <div
                            key={tag.tagId}
                            className={styles.createInputTagContainer}
                          >
                            <input
                              type="text"
                              value={editingTag.editVal}
                              onChange={handleChangeEdittagVal}
                              className={styles.createInpt}
                            />
                            <div className={styles.editActionContainer}>
                              {" "}
                              <span onClick={(e) => handleDeleteTag(e)}>
                                <RoundClose />
                              </span>
                              <span onClick={handleSaveEditTag}>
                                <RoundCheck />
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={tag.tagId}
                            data-disabled={
                              isReccommendations ? "disabled" : false
                            }
                            className={styles.tagRow}
                            onClick={(e) =>
                              isReccommendations
                                ? undefined
                                : toggleTagSelection(e, tag.tagId)
                            }
                          >
                            <div className={styles.tagRowText}>
                              <span
                                className={[
                                  styles.tagNameContainer,
                                  tg.tagCategoryName === "Other"
                                    ? styles.rowHoverWrapper
                                    : "",
                                ].join(" ")}
                              >
                                <span className={styles.tagIcon}>
                                  <TagIcon />
                                </span>
                                {tg.tagCategoryName === "Other" && (
                                  <span
                                    className={styles.editIcon}
                                    onClick={(e) =>
                                      handleEditTag(e, {
                                        tagCategoryId: tg.tagCategoryId,
                                        tag,
                                      })
                                    }
                                  >
                                    <img src={TagEdit} alt="editTags"></img>
                                  </span>
                                )}
                              </span>
                              <span className={styles.tagNameSpan}>
                                {tag.tagLabel}
                              </span>
                            </div>
                            <div>
                              {selectedTagsIds?.includes(tag.tagId) && (
                                <Check />
                              )}
                            </div>
                          </div>
                        )
                      )}
                      {tg.tagCategoryName === "Other" && (
                        <div>
                          {isShowingCreate && (
                            <span className={styles.createInputTagContainer}>
                              <input
                                type="text"
                                value={newTagVal}
                                onChange={(e) => setNewTagVal(e.target.value)}
                                className={styles.createInpt}
                              />
                              <span
                                onClick={(e) =>
                                  handleSaveNewTag(e, tg.tagCategoryId)
                                }
                              >
                                <RoundCheck />
                              </span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {tg.tagCategoryName === "Other" && !isShowingCreate && (
                      <button
                        onClick={handleCreateTag}
                        disabled={(tg.tags?.length || 0) >= 10}
                        title={
                          (tg.tags?.length || 0) >= 10
                            ? "Maximum amount of custom tags has been reached"
                            : ""
                        }
                        className={styles.createTagContainer}
                      >
                        <ButtonExpand />{" "}
                        <span className={styles.createTag}>Create Tag</span>
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
          <div className={styles.tagFooter}>
            <Button
              label="Reset"
              type={"secondary"}
              onClick={handleResetTags}
              disabled={isProcessing}
            />
            <Button
              label="Apply"
              type={"primary"}
              onClick={handleSaveTags}
              disabled={isProcessing}
            />
          </div>
        </div>
      }
    >
      <div
        onClick={() => {
          setTagModalOpen(true);
        }}
      >
        <TagSvg />
      </div>
    </TinyPopover>
  );
}

export default ({
  personalInfo,
  isEdit,
  setEdit,
  setDisplay,
  leadsId,
  refreshContactDetails,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  let {
    firstName = "",
    lastName = "",
    middleName = "",
    emails = [],
    phones = [],
    addresses = [],
    createDate = "",
    statusName = "",
    contactRecordType = "",
    contactPreferences,
    leadTags,
  } = personalInfo;

  emails = emails.length > 0 ? emails[0].leadEmail : NOT_AVAILABLE;

  let phonesData = phones?.filter((phone) => {
    return phone?.leadPhone && phone?.leadPhone !== "" ? phone : null;
  });
  let phone = phonesData?.length > 0 ? phonesData[0]?.leadPhone : null;
  addresses = addresses.length > 0 ? addresses[0] : null;

  const isPrimary =
    contactPreferences && contactPreferences.primary
      ? contactPreferences.primary
      : "";

  const goToEditPage = () => {
    setDisplay("Details");
    setEdit(true);
  };

  return (
    <div className="nameCard">
      <Container className={styles.container}>
        <div className="nameCardSection1">
          <div className="mob-contact-edit-row nameCardHeading">
            <h2>{`${firstName}  ${
              middleName ? middleName + "." : ""
            } ${lastName}`}</h2>

            {!isEdit && (
              <button className="desktop-hide send-btn" onClick={goToEditPage}>
                <Editicon />
                <span className="edit-btn-text">Edit</span>
              </button>
            )}
          </div>
          <div className="personalinfoname nameCardpara">
            <h2>
              {contactRecordType || "Prospect"} | Created Date &nbsp;
              {getMMDDYY(createDate)}
            </h2>
          </div>
        </div>
        <div className="nameCardSection2">
          <div className=" customSelectbox personalInfo">
            <label className="text-bold">Stage</label>
            <StageSelect value={statusName} original={personalInfo} />
          </div>
          <div
            className="personalInfo personalInfoCallScriptIcon"
            style={{ height: "55px", justifyContent: "space-between" }}
          >
            <label className="text-bold">Tags</label>
            <TagsIcon
              leadTags={leadTags}
              leadsId={leadsId}
              onUpdateTags={refreshContactDetails}
            />
          </div>
          <div className="personalInfo personalInfoCallScriptIcon">
            <label className="text-bold">Call Script</label>
            <div
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <img src={CallScriptSvg} alt="Call Script" />
            </div>
          </div>
          <div className="desktop-select-show personalInfo">
            <label className="text-bold">
              Email {isPrimary === "email" && "(Primary)"}
            </label>

            <div className="personalInfoEmailText">
              <a className="info-link hover-line" href={`mailto:${emails}`}>
                {emails}
              </a>
            </div>
          </div>
          <div className="desktop-select-show personalInfo">
            <label className="text-bold">
              Phone {isPrimary === "phone" && "(Primary)"}
            </label>
            <div className="personalInfoText mobile-hide">
              {phone ? (
                <PrimaryContactPhone phone={phone} leadsId={leadsId} />
              ) : (
                NOT_AVAILABLE
              )}
            </div>
            <div className="personalInfoText desktop-hide">
              {phone ? (
                <a
                  className="info-link"
                  href={`tel:${formatPhoneNumber(phone)}`}
                >
                  {formatPhoneNumber(phone)}
                </a>
              ) : (
                NOT_AVAILABLE
              )}
            </div>
          </div>

          <div className=" desktop-select-show personalInfo">
            <label className="text-bold">Address</label>
            <div className="personalInfoText mobile-hide">
              {formatAddress(addresses)}
            </div>
            <div className="personalInfoText desktop-hide">
              <a
                className="info-link"
                href={`${getMapUrl()}?q=${formatAddress(addresses)}`}
              >
                {formatAddress(addresses)}
              </a>
            </div>
          </div>
        </div>
      </Container>
      <CallScriptModal
        modalOpen={modalOpen}
        handleClose={() => {
          setModalOpen(false);
        }}
      />
    </div>
  );
};
