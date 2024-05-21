import socket from "@/Socket";
import { useAppDispatch } from "@/store/hooks";
import { updateChatLatestMessage } from "@/store/slices/chatsSlice";
import { MessageType } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

type useMessageSendType = {
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  setTypedMessage: React.Dispatch<React.SetStateAction<string>>;
  fn: () => Promise<void | AxiosResponse<any, any>>;
};

export const useSendMessage = ({
  fn,
  setMessages,
  setTypedMessage,
}: useMessageSendType) => {
  const dispatch = useAppDispatch();
  const mutateObj = useMutation({
    mutationFn: fn,
    retry: false,
    onSuccess: (data) => {
      setTypedMessage(""); // Clear the input field after successful send
      if (data && data.status === 200) {
        console.log("insise useMutaion onSuccess", data.data);
        socket.emit("message", data.data);
        setMessages((prevMessages) => [...prevMessages, data.data]);
        dispatch(updateChatLatestMessage(data.data));
      }
    },
  });
  return mutateObj;
};
