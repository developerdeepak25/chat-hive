import { privateAxios } from "@/AxiosInstance/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Messagefeed from "../messageComp/Messagefeed";
import { useEffect } from "react";
import { MessageType } from "@/types/type";

type ChatFeedBoxProps = {
  scrollBottomRef: React.RefObject<HTMLDivElement>;
  selectedChatId: string | undefined;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
};

const ChatFeedBox = ({
  scrollBottomRef,
  selectedChatId,
  messages,
  setMessages,
}: ChatFeedBoxProps) => {
  const getChatMessagesFromApi = async () => {
    const response = await privateAxios.get(
      `/message/getMessages/${selectedChatId}`
    );
    return response;
  };
  const { isLoading, isSuccess, data, isError, error } = useQuery({
    queryKey: ["chatMessages" + selectedChatId],
    queryFn: getChatMessagesFromApi,
    enabled: !!selectedChatId, // Enable the query only when selectedChat._id is available
    retry: false,
  });

  useEffect(() => {
    if (data?.data) {
      setMessages(data?.data);
    }
    if (error) {
      console.log(error);
    }
  }, [data, error, setMessages]);
  //   useEffect(() => {
  //   }, [error]);
  return (
    <div className="message-feed grow  bg_dark overflow-y-hidden flex flex-col max-h-full items-center justify-center">
      {/* <div className=" overflow-y-auto"> */}
      {isLoading && <Loader2 className="h-10 w-10 animate-spin" />}
      {isError && <p className="pt-5 text-center">messages can't be loaded</p>}
      {isSuccess &&
        data.status === 200 &&
        (messages?.length !== 0 ? (
          <div className="flex  flex-col  justify-end h-full w-full ">
            <Messagefeed messages={messages} bottomDivRef={scrollBottomRef} />
          </div>
        ) : (
          <p className="pt-5 text-center">No Messages yet</p>
        ))}
      {/* </div> */}
    </div>
  );
};

export default ChatFeedBox;
