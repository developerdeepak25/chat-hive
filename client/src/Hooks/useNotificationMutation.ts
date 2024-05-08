import socket from "@/Socket";
import { useAppDispatch } from "@/store/hooks";
import { removeNotification } from "@/store/slices/notificationSlice";
import { errorToastOptions, successsToastOptions } from "@/utils/toastOption";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface NotificationMutationProps {
  notificationId: string;
  fn: (friendId: string) => Promise<any>;
  successMsg: string;
  errorMsg: string;
}

export const useNotificationMutation = ({
  notificationId,
  fn,
  successMsg,
  errorMsg,
}: NotificationMutationProps) => {
  const dispatch = useAppDispatch();
  const mutationObject = useMutation({
    mutationFn: fn,
    retry: false,
    onSuccess: (data) => {
      console.log(data);
      if (data?.status === 200) {
        socket.emit("notification", data.data.notification);
        toast.success(successMsg, successsToastOptions);
        dispatch(removeNotification(notificationId));
      }
    },
    onError: (err) => {
      toast.error(errorMsg, errorToastOptions);
      console.log(err.message);
    },
  });
  return mutationObject;
};
