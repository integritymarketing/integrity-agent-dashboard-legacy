import { useContext } from "react";
import FlashContext from "contexts/flash";

export default () => {
  const [messageState, setMessageState] = useContext(FlashContext);

  return {
    ...messageState,
    show: (message, opts = {}) =>
      setMessageState({ message, isVisible: true, ...opts }),
    dismiss: () => setMessageState({ ...messageState, isVisible: false }),
  };
};
