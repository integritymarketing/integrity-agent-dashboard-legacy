import { useContext } from "react";
import { ToastContext } from "components/ui/Toast/ToastContextProvider";

export default function useToast() {
  return useContext(ToastContext);
}
