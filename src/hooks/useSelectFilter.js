import { useEffect } from "react";

export const useSelectFilterToScroll = (options, isOpen, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (isOpen) {
        const lettersOnly = () => {
          var charCode = event.keyCode;
          if (
            (charCode > 64 && charCode < 91) ||
            (charCode > 96 && charCode < 123) ||
            charCode === 8
          )
            return true;
          else return false;
        };
        if (lettersOnly) {
          event.preventDefault();
          let filtered_value = options.filter(
            (x) => x.label[0] === event.key.toUpperCase()
          )[0]?.label;
          handler(filtered_value);
        }
      }
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [options, isOpen, handler]);
};
