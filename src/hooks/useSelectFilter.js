import { useEffect, useState } from "react";

export const useSelectFilterToScroll = (options, isOpen, handler) => {
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    if (userInput !== "") {
      let filtered_value = options.filter((state) => {
        return state.label.toLowerCase().startsWith(userInput?.toLowerCase());
      });
      let filtered_label = filtered_value[0]?.label;
      if (filtered_label) {
        handler(filtered_label, () => setUserInput(""));
      }
    }
  }, [userInput, handler, options]);

  useEffect(() => {
    const listener = (event) => {
      if (isOpen) {
        let key = event.key;
        let isLetter =
          key && key.length === 1 && key.match(/[a-z]/i) ? true : false;
        if (isLetter) {
          setUserInput(userInput + key);
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [options, isOpen, handler, userInput]);
};
