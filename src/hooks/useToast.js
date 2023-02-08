import { useContext } from "react";
import ToastContext from "../components/ui/Toast/ToastContext";

export default function useToast() {
  return useContext(ToastContext);
}
