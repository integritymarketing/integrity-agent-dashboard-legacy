import React, { useEffect, useState, useMemo } from "react";
import Container from "components/ui/container";
import StageSelect from "./StageSelect";
import { formatPhoneNumber } from "utils/phones";
import { getMMDDYY } from "utils/dates";
import styles from "../ContactsPage.module.scss";
import { formatAddress, getMapUrl } from "utils/address";
import Editicon from "components/icons/edit-details";
import CallScript from "components/icons/callScript";
import TagSvg from "components/icons/tag-svg";
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
import CheckBlue from "components/icons/check-blue";

const NOT_AVAILABLE = "N/A";

function TagsIcon({ leadsId, leadTags, onUpdateTags }) {
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [tagsByCategory, setTagsByCategory] = useState([]);
  const initialState = leadTags?.map((st) => st.tag.tagId) || [];
  const [selectedTagsIds, setSelectedTagsIds] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedList, setExpandedList] = useState({});
  const [serverTags, setServerTags] = useState([]);

  const [newTagVal, setNewTagVal] = useState('');
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

  function fetchTags() {
    console.log('fetch tags');
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
        acc[cat.tagCategoryId] = true;
        return acc;
      }, {})
    );
  }, [tagsByCategory]);
  useEffect(() => {
    if(tagModalOpen) {
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
    return str.match(/^[0-9a-zA-Z]+$/);
  }

  async function handleSaveNewTag(e, tagCategoryId) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if ((newTagVal || '').length > 10 || (newTagVal || '').length < 2 || !isAlphanumeric(newTagVal || '')) {
      alert('tag length should be between 1 and 10, and only allow alphanumeric');
      return;
    }
    
    try {
      // const resp = await clientsService.createTag({ tagCategoryId, newTagVal });
      // console.log({ resp });    
      // fetchTags();
      tagsByCategory.find(tg => tg.tagCategoryId === tagCategoryId).tags.push({tagId: Math.ceil(Math.random() * 10000), tagLabel: newTagVal});
      setTagsByCategory([...tagsByCategory]);        
      setIsShowingCreate(false);
      setNewTagVal('');
    } catch(e) {
      console.log(e);
      alert('Erro creating tag');
    }    
  }

  function handleEditTag(e, {tagCategoryId, tag}) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    setEditingTag({ tagCategoryId, tag, editVal: tag.tagLabel });
  }

  function handleChangeEdittagVal(e) {
    setEditingTag({ ...editingTag, editVal: e.target.value });
  }

  function handleDeleteTag(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    const currentCat = tagsByCategory.find(tg => tg.tagCategoryId === editingTag.tagCategoryId);
    const newTgas = currentCat.tags.filter(tg => tg.tagId !== editingTag.tag.tagId);
    currentCat.tags = newTgas;

    setTagsByCategory([...tagsByCategory]);      
    setSelectedTagsIds((selTagIds) => {
      return selTagIds.filter((id) => id !== editingTag.tag.tagId);
    });     
    setEditingTag(null); 
  }

  function handleSaveEditTag(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if ((editingTag.editVal || '').length > 10 || (editingTag.editVal || '').length < 2 || !isAlphanumeric(editingTag.editVal || '')) {
      alert('tag length should be between 1 and 10, and only allow alphanumeric');
      return;
    }
    
    try {
    tagsByCategory.find(tg => tg.tagCategoryId === editingTag.tagCategoryId).tags.find(tg => tg.tagId === editingTag.tag.tagId).tagLabel = editingTag.editVal;
    
    setTagsByCategory([...tagsByCategory]);            
    setEditingTag(null); 
    } catch(e) {
      console.log(e);
      alert('Erro editing tag');
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
                  <div>
                  <div className={styles.tagCategoryId}>
                    {tg.tags?.map((tag) => (
                      editingTag?.tag.tagId === tag.tagId ? <div>
                        <input type="text" value={editingTag.editVal} onChange={handleChangeEdittagVal} />
                        <span onClick={(e) => handleDeleteTag(e)}>D</span>
                        <span onClick={handleSaveEditTag}>S</span>

                      </div> :
                      <div
                        className={styles.tagRow}
                        onClick={(e) => toggleTagSelection(e, tag.tagId)}
                      >
                        <div className={styles.tagRowText}>
                          <span className={[styles.delSTyles, tg.tagCategoryName === 'Other' ? styles.rowHoverWrapper : ''].join(' ')}>
                            <span className={styles.tagIcon}>
                              <TagIcon />
                            </span>
                            {tg.tagCategoryName === 'Other' &&
                            <span className={styles.editIcon} onClick={(e) => handleEditTag(e, {tagCategoryId: tg.tagCategoryId, tag})}>
                              EDIT
                            </span>}
                          </span>
                          <span>{tag.tagLabel}</span>
                        </div>
                        <div>
                          {selectedTagsIds.includes(tag.tagId) && <Check />}
                        </div>
                      </div>
                    ))}
                    {tg.tagCategoryName === 'Other' && <div>
                      {isShowingCreate && <span><input type="text" value={newTagVal} onChange={(e) => setNewTagVal(e.target.value)} /><span onClick={(e) => handleSaveNewTag(e, tg.tagCategoryId)}><CheckBlue /></span></span>}                      
                    </div>}
                  </div>
                  {tg.tagCategoryName === 'Other' && !isShowingCreate && <button onClick={handleCreateTag} disabled={(tg.tags?.length || 0) >= 10} title={(tg.tags?.length || 0) >= 10 ? 'Maximum amount of custom tags has been reached' : ''}>+ Create Tag</button>}
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
          {/* {process.env.REACT_APP_FEATURE_FLAG === "show" && ( */}
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
          {/* )} */}
          {/* <div className="personalInfo personalInfoCallScriptIcon">
            <label className="text-bold">Tag</label>
            <TagsIcon
              leadTags={leadTags}
              leadsId={leadsId}
              onUpdateTags={refreshContactDetails}
            />
          </div> */}
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
