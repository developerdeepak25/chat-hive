import { privateAxios } from "@/AxiosInstance/AxiosInstance";

export const sendMessage = async (typedMessage:string, selectedChatId:string) => {
  if (typedMessage.length <= 0) return console.log("message can not be empty"); // TODO: show error message

  const response = await privateAxios.post(`/message/send`, {
    chatId: selectedChatId,
    text: typedMessage,
  });
  return response;
};
