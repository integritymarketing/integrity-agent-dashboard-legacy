import { useEffect, useState } from "react";

export const useSelectFilterToScroll = (options, isOpen, handler) => {
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    if (userInput !== "") {
      const timer = setTimeout(() => {
        handler(userInput, () => setUserInput(""));
        setUserInput("");
      }, 800);
      return () => clearTimeout(timer);
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
