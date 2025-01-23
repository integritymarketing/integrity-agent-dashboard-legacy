import React, { useState } from "react";
import FooterButtons from "packages/FooterButtons";
import SortList from "./SortList";

export default function ContactListSort({ close, setSort }) {
  const [selected, setSelected] = useState("");

  const onApply = () => {
    setSort(selected);
    close();
  };
  const onReset = () => {
    setSort("createDate:desc");
  };
  const BUTTONS = {
    reset: {
      text: "Reset",
      onClick: onReset,
      disabled: false,
    },
    apply: {
      text: "Apply",
      onClick: onApply,
      disabled: !selected || selected === "",
    },
  };
  return (
    <>
      <SortList selected={selected} setSelected={setSelected} />

      <FooterButtons buttonOne={BUTTONS.reset} buttonTwo={BUTTONS.apply} />
    </>
  );
}
