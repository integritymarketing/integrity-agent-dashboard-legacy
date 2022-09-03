import React, { useEffect, useState, useMemo } from "react";
import Container from "components/ui/container";
import StageSelect from "./StageSelect";
import { formatPhoneNumber } from "utils/phones";
import { getMMDDYY } from "utils/dates";
import styles from "../ContactsPage.module.scss";
import { formatAddress, getMapUrl } from "utils/address";
import Editicon from "components/icons/edit-details";
import CallScript from "components/icons/callScript";
import TagIcon from "components/icons/tag-icon";
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

function TagsIcon({ leadsId, leadTags, onUpdateTags }) {
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [tagsByCategory, setTagsByCategory] = useState([]);
  const initialState = leadTags?.map((st) => st.tag.tagId) || [];
  const [selectedTagsIds, setSelectedTagsIds] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedList, setExpandedList] = useState({});
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
  function handleSaveTags() {
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
  useEffect(() => {
    setExpandedList(
      tagsByCategory.reduce((acc, cat) => {
        acc[cat.tagCategoryId] = true;
        return acc;
      }, {})
    );
  }, [tagsByCategory]);
  useEffect(() => {
    clientsService
      .getTagsGroupByCategory()
      .then((data) => {
        setTagsByCategory(data);
      })
      .catch((error) => {
        Sentry.captureException(error);
      });
  }, []);
  const totalTags = useMemo(() => {
    return tagsByCategory?.reduce(
      (acc, item) => acc + item.tags?.length || 0,
      0
    );
  }, [tagsByCategory]);
  function handleClose() {
    if (isProcessing) return;
    setSelectedTagsIds(initialState);
    setTagModalOpen(false);
  }
  function handleToggleExpand(catId) {
    setExpandedList((expList) => ({ ...expList, [catId]: !expList[catId] }));
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
            if (!tg.tags?.length) {
              return null;
            }
            const isExpanded = expandedList[tg.tagCategoryId];
            return (
              <div>
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
                  <div className={styles.tagCategoryId}>
                    {tg.tags?.map((tag) => (
                      <div
                        className={styles.tagRow}
                        onClick={(e) => toggleTagSelection(e, tag.tagId)}
                      >
                        <div className={styles.tagRowText}>
                          <span className={styles.delSTyles}>
                            <TagIcon />
                          </span>
                          <span>{tag.tagLabel}</span>
                        </div>
                        <div>
                          {selectedTagsIds.includes(tag.tagId) && <Check />}
                        </div>
                      </div>
                    ))}
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
              disable={isProcessing}
            />
            <Button
              label="Apply"
              type={"primary"}
              onClick={handleSaveTags}
              disable={isProcessing}
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
        <CallScript />
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
  phones = phones.length > 0 ? phones[0].leadPhone : null;
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
          {process.env.REACT_APP_FEATURE_FLAG === "show" && (
            <div className="personalInfo personalInfoCallScriptIcon">
              <label className="text-bold">Tag</label>
              <TagsIcon
                leadTags={leadTags}
                leadsId={leadsId}
                onUpdateTags={refreshContactDetails}
              />
            </div>
          )}
          <div className="personalInfo personalInfoCallScriptIcon">
            <label className="text-bold">Call Script</label>
            <div
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <CallScript />
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
              {phones ? (
                <PrimaryContactPhone phone={phones} leadsId={leadsId} />
              ) : (
                NOT_AVAILABLE
              )}
            </div>
            <div className="personalInfoText desktop-hide">
              {phones ? (
                <a
                  className="info-link"
                  href={`tel:${formatPhoneNumber(phones)}`}
                >
                  {formatPhoneNumber(phones)}
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
