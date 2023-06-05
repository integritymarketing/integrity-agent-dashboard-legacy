import React, { useState } from "react";
import Edit from "./Edit";
import Info from "./Info";
import SectionHeaderMobile from "mobile/Components/sectionHeader";
import EditIcon from "components/icons/icon-edit";
import styles from "./styles.module.scss";

const DetailsMobile = ({ isEdit, ...props }) => {
  const [isCollapse, setIsCollapse] = useState(false);
  return (
    <div className={styles.detailsMobile}>
      <SectionHeaderMobile
        title={"Contact Details"}
        actionTitle={isEdit ? "Cancel" : "Edit"}
        callBack={() => {
          props.setEdit(!isEdit);
        }}
        showLeft={true}
        ActionIcon={!isEdit ? <EditIcon /> : null}
        setIsCollapse={() => setIsCollapse(!isCollapse)}
        isCollapse={isCollapse}
        collapseContent={true}
        className={"shiftRight"}
      />
      {!isCollapse && (
        <div>{isEdit ? <Edit {...props} /> : <Info {...props} />}</div>
      )}
    </div>
  );
};

export default DetailsMobile;
