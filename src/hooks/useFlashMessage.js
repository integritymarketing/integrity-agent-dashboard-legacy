import { useContext } from "react";
import FlashContext from "contexts/flash";

export default () => {
  const [messageState, setMessageState] = useContext(FlashContext);

  return {
    ...messageState,
    show: (message) => setMessageState({ message, isVisible: true }),
    dismiss: () => setMessageState({ ...messageState, isVisible: false }),
  };
};
