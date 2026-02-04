import Swal, {
  SweetAlertIcon,
  SweetAlertPosition,
  SweetAlertResult,
} from "sweetalert2";

type BaseOptions = {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  background?: string;
  color?: string;
};

/* ---------------- TOAST ---------------- */
type ToastOptions = BaseOptions & {
  position?: SweetAlertPosition;
  timer?: number;
};

export const toast = ({
  title = "",
  text = "",
  icon = "success",
  position = "top-end",
  timer = 2000,
  background,
  color,
}: ToastOptions) => {
  return Swal.fire({
    title,
    text,
    icon,
    position,
    timer,
    toast: true,
    showConfirmButton: false,
    background,
    color,
  });
};

/* ---------------- MODAL ---------------- */
export const modal = ({
  title = "",
  text = "",
  icon = "info",
  background,
  color,
}: BaseOptions) => {
  return Swal.fire({
    title,
    text,
    icon,
    position: "center",
    showConfirmButton: true,
    toast: false,
    background,
    color,
  });
};

/* ---------------- CONFIRM ---------------- */
type ConfirmOptions = BaseOptions & {
  confirmText?: string;
  cancelText?: string;
};

export const confirm = ({
  title = "Are you sure?",
  text = "",
  icon = "warning",
  confirmText = "Yes",
  cancelText = "Cancel",
  background,
  color,
}: ConfirmOptions): Promise<SweetAlertResult> => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    background,
    color,
  });
};

/* ---------------- LOADING ---------------- */
export const loading = (title = "Please wait...") => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeAlert = () => Swal.close();
