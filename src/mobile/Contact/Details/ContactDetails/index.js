import React from "react";
import Edit from "./Edit";
import Info from "./Info";
import SectionHeaderMobile from "mobile/Components/sectionHeader";
import EditIcon from "components/icons/icon-edit";
import styles from "./styles.module.scss";

const DetailsMobile = ({ isEdit, ...props }) => {
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
      />
      <div>{isEdit ? <Edit {...props} /> : <Info {...props} />}</div>
    </div>
  );
};

export default DetailsMobile;
