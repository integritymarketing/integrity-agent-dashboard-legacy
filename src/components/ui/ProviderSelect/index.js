import React, { useState } from "react";
import { useCombobox } from "downshift";
import Close from "../../icons/input-clear";

import "./index.scss";

const items = [
  {
    name: "Joe McKnight",
    npi: "65656154",
    specialization: "General Practitioner",
    address: {
      addressid: "",
      address1: "12345",
      address2: "Address St NW",
      city: "Brooklyn",
      stateCode: "NY",
      postalCode: "11222",
    },
  },
  {
    name: "Raja Test",
    npi: "65656154",
    specialization: "General Practitioner",
    address: {
      addressid: "",
      address1: "12345",
      address2: "Address St NW",
      city: "Brooklyn",
      stateCode: "NY",
      postalCode: "11222",
    },
  },
  {
    name: "Joe McKnight 1",
    npi: "65656154",
    specialization: "General Practitioner",
    address: {
      addressid: "",
      address1: "12345",
      address2: "Address St NW",
      city: "Brooklyn",
      stateCode: "NY",
      postalCode: "11222",
    },
  },
  {
    name: "Joe McKnight 2",
    npi: "65656154",
    specialization: "General Practitioner",
    address: {
      addressid: "",
      address1: "12345",
      address2: "Address St NW",
      city: "Brooklyn",
      stateCode: "NY",
      postalCode: "11222",
    },
  },
  {
    name: "Joe McKnight 3",
    npi: "65656154",
    specialization: "General Practitioner",
    address: {
      addressid: "",
      address1: "12345",
      address2: "Address St NW",
      city: "Brooklyn",
      stateCode: "NY",
      postalCode: "11222",
    },
  },
];

export default function ProviderSelect({ label }) {
  const [inputItems, setInputItems] = useState(items);
  const itemToString = (item) => item?.name || "";
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    selectItem,
    closeMenu,
  } = useCombobox({
    itemToString,
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items.filter((item) =>
          itemToString(item).toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    },
  });
  return (
    <div className="container">
      {label && (
        <label className="label-name" {...getLabelProps()}>
          {label}
        </label>
      )}
      <div className="sub-container" {...getComboboxProps()}>
        <input
          className="provider-input"
          {...getInputProps({ placeholder: "Start typing a provider’s name" })}
        />
        <div
          className="label-close"
          onClick={() => {
            selectItem(null);
            closeMenu();
          }}
        >
          <Close />
        </div>
      </div>
      <ul
        {...getMenuProps()}
        className={
          isOpen ? "provider-dropdown label-dropdown" : "provider-dropdown"
        }
      >
        {isOpen && !inputItems.length && (
          <div>No search results available in the selected area</div>
        )}
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              className={`provider-section ${
                selectedItem?.name === item.name ? "selected" : ""
              }`}
              key={`${item.name}${index}`}
              {...getItemProps({ item, index })}
            >
              <div className="provider-name">{item.name}</div>
              <div className="provider-info">{item.specialization}</div>
              <div className="provider-info">
                {[
                  item.address.addressid,
                  item.address.address1,
                  item.address.address2,
                  item.address.city,
                  item.address.stateCode,
                  item.address.postalCode,
                ]
                  .filter(Boolean)
                  .join(",")}
              </div>
            </li>
          ))}
      </ul>
      {selectedItem && (
        <div className="selected-provider">
          <div className="provider-name">{selectedItem.name}</div>
          <div className="provider-info">{selectedItem.specialization}</div>
          <div className="provider-info">
            {[
              selectedItem.address.addressid,
              selectedItem.address.address1,
              selectedItem.address.address2,
              selectedItem.address.city,
              selectedItem.address.stateCode,
              selectedItem.address.postalCode,
            ]
              .filter(Boolean)
              .join(",")}
          </div>
        </div>
      )}
    </div>
  );
}
