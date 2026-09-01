import { toast } from "react-toastify";

export const myToast = {
  success: (message) => {
    toast.success(message, {
      className: "fable-toast success-toast",
    });
  },

  error: (message) => {
    toast.error(message, {
      className: "fable-toast error-toast",
    });
  },

  info: (message) => {
    toast.info(message, {
      className: "fable-toast info-toast",
    });
  },
};
