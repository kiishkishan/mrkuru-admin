import { showAlert, clearAlert } from "@/state/slices/alertSlice";
import toast from "react-hot-toast";
import { AppDispatch } from "@/app/redux";

// Thunk to show a toast and manage alert state
export const showToast =
  (message: string, type: "success" | "error" | "loading" | "info") =>
  (dispatch: AppDispatch) => {
    // Debug: Log to confirm the thunk is being executed
    console.log("showToast thunk called with:", { message, type });

    // Dispatch the showAlert action to update the Redux state
    dispatch(showAlert({ message, type }));

    // Show the toast using react-hot-toast
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "loading":
        toast.loading(message);
        break;
      case "info":
        toast(message, { icon: "ℹ️" });
        break;
      default:
        toast(message);
    }

    // Clear the alert after the toast is shown
    setTimeout(() => {
      dispatch(clearAlert());
    }, 5000);
  };
