import { useContext, useCallback } from "react";
import FlashContext from "contexts/flash";

const useFlashMessage = () => {
  const [messageState, setMessageState] = useContext(FlashContext);

  const onShow = (message, opts = {}) => {
    setMessageState({ message, isVisible: true, ...opts });
  };

  const onDismiss = useCallback(() => {
    setMessageState(prevState => ({ ...prevState, isVisible: false }));
  }, [setMessageState]);

  return {
    ...messageState,
    show: onShow,
    dismiss: onDismiss,
  };
};

export default useFlashMessage;
