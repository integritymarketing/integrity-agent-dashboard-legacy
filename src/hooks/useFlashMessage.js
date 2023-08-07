import { useContext } from "react";
import FlashContext from "contexts/flash";

const useFlashMessage = () => {
  const [messageState, setMessageState] = useContext(FlashContext);

  return {
    ...messageState,
    show: (message, opts = {}) =>
      setMessageState({ message, isVisible: true, ...opts }),
    dismiss: () => setMessageState({ ...messageState, isVisible: false }),
  };
};

export default useFlashMessage;
