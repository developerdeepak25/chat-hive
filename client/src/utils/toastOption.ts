import { Bounce, ToastOptions } from "react-toastify";

export const errorToastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  theme: "dark",
  transition: Bounce,
};

export const successsToastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  theme: "dark",
  transition: Bounce,
};
