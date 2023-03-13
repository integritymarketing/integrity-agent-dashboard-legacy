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
import ConfirmationModal from "packages/ConfirmationModal";

const NOT_AVAILABLE = "N/A";
const RECOMMENDATIONS_TAG_NAME = "Recommendations";

function TagsIcon({
  leadsId,
  leadTags,
  onUpdateTags,
  setConfirmModalOpen,
  deleteTagFlag,
  setDeleteTagFlag,
}) {
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
  const [hasError, setHasError] = useState(false);

  const addToast = useToast();
  function toggleTagSelection(e, tagId) {
    e.stopPropagation();
    e.nativeEvent && e.nativeEvent.stopImmediatePropagation();
    setSelectedTagsIds((selTagIds) => {
      return selTagIds.includes(tagId)
        ? selTagIds.filter((id) => id !== tagId)
        : [...selTagIds, tagId];
    });
  }
  async function handleSaveTags(e, closeModal = true) {
    setIsProcessing(true);

    const otherCatId = tagsByCategory?.find(
      (t) => t.tagCategoryName === "Other"
    )?.tagCategoryId;
    const tagId = await handleSaveNewTag(e, otherCatId);
    const tagIds = selectedTagsIds;
    if (tagId) {
      toggleTagSelection(e, tagId);
      tagIds.push(tagId);
    }
    clientsService
      .updateLeadsTags(leadsId, tagIds)
      .then((data) => {
        setIsProcessing(false);
        if (closeModal) {
          setTagModalOpen(false);
          onUpdateTags();
          addToast({
            time: 10000,
            type: "success",
            message: "Successfully Updated the Tags",
          });
        }
      })
      .catch((error) => {
        setIsProcessing(false);
        Sentry.captureException(error);
        addToast({
          time: 10000,
          type: "error",
          message: "Error Updating the Tags",
        });
      });
  }
  function handleResetTags() {
    const recommendationTagIds = Object.fromEntries(
      (
        tagsByCategory.filter(
          (category) => category.tagCategoryName === RECOMMENDATIONS_TAG_NAME
        )?.[0]?.tags ?? []
      ).map(({ tagId }) => [tagId, true])
    );
    setSelectedTagsIds((selectedTagIds) => {
      return selectedTagIds.filter((id) => recommendationTagIds[id]);
    });
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
        if (
          cat.tagCategoryName === RECOMMENDATIONS_TAG_NAME &&
          leadTags?.some(
            (st) =>
              st.tag.tagCategory.tagCategoryName === RECOMMENDATIONS_TAG_NAME
          )
        ) {
          acc[cat.tagCategoryId] = true;
        }
        return acc;
      }, {})
    );
  }, [tagsByCategory, leadTags]);

  useEffect(() => {
    if (tagModalOpen) {
      fetchTags();
    }
  }, [tagModalOpen]);

  const totalTags = useMemo(() => {
    return selectedTagsIds && selectedTagsIds.length > 0
      ? selectedTagsIds?.length
      : "";
  }, [selectedTagsIds]);

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
    e.nativeEvent && e.nativeEvent.stopImmediatePropagation();

    if (newTagVal === "") return;

    if (
      (newTagVal || "").length > 10 ||
      (newTagVal || "").length < 2 ||
      !isAlphanumeric(newTagVal || "")
    ) {
      setHasError(true);
      addToast({
        time: 10000,
        type: "error",
        message:
          "Tag length should be between 2 and 10, and only allow alphanumeric, single space, single hyphen(-), single underscore(_)",
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
      setHasError(false);
      return resp?.tagId;
    } catch (e) {
      console.log(e);
      addToast({
        time: 10000,
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

  function handleChangeEditTagVal(e) {
    setIsProcessing(true);
    let tagValue = e.target.value;
    setEditingTag({ ...editingTag, editVal: tagValue });
    setHasError(
      (tagValue || "").length > 10 ||
        (tagValue || "").length < 2 ||
        !isAlphanumeric(tagValue || "")
    );
  }

  async function handleDeleteTag() {
    try {
      const resp = await clientsService.deleteTag({
        tagId: editingTag.tag.tagId,
      });
      if (!resp) {
        addToast({
          time: 10000,
          type: "error",
          message: "Error deleting tag",
        });
        return;
      }
      fetchTags();
    } catch (e) {
      console.log(e);
      addToast({
        time: 10000,
        type: "error",
        message: "Error deleting tag",
      });
    }

    setSelectedTagsIds((selTagIds) => {
      return selTagIds.filter((id) => id !== editingTag.tag.tagId);
    });
    setEditingTag(null);
    setDeleteTagFlag(false);
  }

  useEffect(() => {
    if (deleteTagFlag) {
      handleDeleteTag();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteTagFlag]);

  async function handleSaveEditTag(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (
      (editingTag.editVal || "").length > 10 ||
      (editingTag.editVal || "").length < 2 ||
      !isAlphanumeric(editingTag.editVal || "")
    ) {
      setHasError(true);
      addToast({
        time: 10000,
        type: "error",
        message:
          "Tag length should be between 2 and 10, and only allow alphanumeric, single space, single hyphen(-), single underscore(_)",
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
      setHasError(false);
    } catch (e) {
      console.log(e);
      addToast({
        time: 10000,
        type: "Error",
        message: "Error saving tag",
      });
    }
  }

  function handleOnChangeTag(e) {
    setIsProcessing(false);
    const newTagVal = e.target.value;
    setNewTagVal(newTagVal);
    setHasError(
      (newTagVal || "").length > 10 ||
        (newTagVal || "").length < 2 ||
        !isAlphanumeric(newTagVal || "")
    );
  }

  return (
    <TinyPopover
      onClickOutside={handleClose}
      isOpen={tagModalOpen}
      positions={["bottom", "top"]}
      content={
        <div className={styles.tagsModal}>
          <div className={styles.tagsModalHeader}>
            <div className={styles.title}>
              <h3 className={styles.tagHeader}>Manage Tags</h3>
              <div className={styles.tagCount}>
                {totalTags ? `(${totalTags})` : ""}
              </div>
            </div>
            <div
              onClick={handleClose}
              style={{
                cursor: "pointer",
              }}
            >
              <Close width="28px" height="28px" color="#0052ce" />
            </div>
          </div>
          {tagsByCategory?.map((tg) => {
            if (tg.tagCategoryName !== "Other" && !tg.tags?.length) {
              return null;
            }
            if (
              tg.tagCategoryName === RECOMMENDATIONS_TAG_NAME &&
              !leadTags?.some(
                (st) =>
                  st.tag.tagCategory.tagCategoryName ===
                  RECOMMENDATIONS_TAG_NAME
              )
            ) {
              return null;
            }
            const isReccommendations =
              tg.tagCategoryName === RECOMMENDATIONS_TAG_NAME;
            const isExpanded = expandedList[tg.tagCategoryId];
            const tags = tg.tags || [];

            return (
              <div key={tg.tagCategoryId}>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryName}>
                    {tg.tagCategoryName}
                  </div>
                  <div onClick={() => handleToggleExpand(tg.tagCategoryId)}>
                    {isExpanded ? (
                      <span className={styles.expandIcons}>-</span>
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
                              onChange={handleChangeEditTagVal}
                              className={[
                                hasError
                                  ? styles.errorInput
                                  : styles.createInpt,
                              ]}
                            />
                            <div className={styles.editActionContainer}>
                              {" "}
                              <span onClick={() => setConfirmModalOpen(true)}>
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
                                onChange={handleOnChangeTag}
                                className={[
                                  hasError
                                    ? styles.errorInput
                                    : styles.createInpt,
                                ]}
                              />
                              <span onClick={(e) => handleSaveTags(e, false)}>
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
  const addToast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteTagFlag, setDeleteTagFlag] = useState(false);

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
          <div className="customSelectbox personalInfo minWidth">
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
              setConfirmModalOpen={setConfirmModalOpen}
              deleteTagFlag={deleteTagFlag}
              setDeleteTagFlag={setDeleteTagFlag}
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
      <ConfirmationModal
        open={confirmModalOpen}
        title="Delete Tag"
        message="Are you sure you want to delete this tag?"
        cancelHandler={() => {
          setConfirmModalOpen(false);
        }}
        submitHandler={() => {
          setDeleteTagFlag(true);
          setConfirmModalOpen(false);
          addToast({
            time: 10000,
            type: "success",
            message: "Successfully deleted the Tags",
          });
        }}
      />
    </div>
  );
};
