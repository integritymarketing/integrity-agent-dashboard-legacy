import { TextButton } from "packages/Button";
import React from "react";

export default function CreateNewContact({ goToAddNewContactsPage }) {
  return (
    <TextButton
      onClick={goToAddNewContactsPage}
      variant={"outlined"}
      size={"large"}
    >
      Create new contact
    </TextButton>
  );
}
