import { apiAxios } from "@/AxiosInstance/AxiosInstance";
import SendIcon from "@/assets/svgs/SendIcon";
import MessageTextArea from "@/components/messageComp/MessageTextArea";
import Profile from "@/components/Shared/Profile/Profile";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSelectedChat,
  removeUnreadMessages,
  setSelectedChatById,
  updateChatLatestMessage,
} from "@/store/slices/chatsSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Messagefeed from "@/components/messageComp/Messagefeed";
import { Loader2 } from "lucide-react";
import { MessageType } from "@/types/type";
import socket from "@/Socket";
import { playSound } from "@/utils/functions";

const SingleChat = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { selectedChat } = useAppSelector((state) => {
    return state.Chats;
  });
  const scrollBottomRef = useRef<HTMLDivElement>(null);

  const { profilePicture, username } = selectedChat?.chatPartner || {};

  const getChatMessagesFromApi = async () => {
    const response = await apiAxios.get(
      `/message/getMessages/${selectedChat?._id}`
    );
    return response;
  };

  const postChatMessage = async () => {
    if (typedMessage.length <= 0)
      return console.log("message can not be empty"); // TODO: show error message

    const response = await apiAxios.post(`/message/send`, {
      chatId: selectedChat?._id,
      text: typedMessage,
    });
    return response;
  };
  // }, [selectedChat]);

  const { isLoading, isSuccess, data, isError, error } = useQuery({
    queryKey: ["chatMessages" + selectedChat?._id],
    queryFn: getChatMessagesFromApi,
    enabled: !!selectedChat?._id, // Enable the query only when selectedChat._id is available
    retry: false
  });
  const {
    mutate,
    isPending,
    // error: postError,
    // data: sendedMessageData,
    isSuccess: isMutationSuccess,
    // isError: isPostError,
  } = useMutation({
    mutationFn: postChatMessage,
    retry:false,
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

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isMutationSuccess]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);
  useEffect(() => {
    // console.log(data?.data);
    // console.log(messages);
    setMessages(data?.data);
    dispatch(removeUnreadMessages(id!));
  }, [data]);

  useEffect(() => {
    socket.emit("join chat", selectedChat?._id);

    return () => {
      socket.emit("leave chat", selectedChat?._id);
    };
  }, [selectedChat?._id]);

  useEffect(() => {
    dispatch(setSelectedChatById(id!));
    return () => {
      dispatch(clearSelectedChat());
    };
  }, [dispatch, id]);

  useEffect(() => {
    const liveChathandler = (message:MessageType) => {
      console.log(`newMessage is emited for me`);
      if (!selectedChat) return;
      if (message.chatId._id !== selectedChat._id) return;
      setMessages((prevMessages) => [...prevMessages, message]);
      playSound();
    };
    socket.on("newMessage", liveChathandler);
    return () => {
      socket.off("newMessage", liveChathandler);
    };
  }, [selectedChat]);
  // useEffect(() => {
  //   console.log(typedMessage);
  // }, [typedMessage]);

  return (
    <>
      <div className=" h-full flex flex-col w-full">
        <div className=" py-5 border_b_stroke flex px-6 items-center gap-3">
          <Profile src={profilePicture} />
          <h3 className=" text-lg">{username}</h3>
        </div>
        <div className="message-feed grow  bg_dark overflow-y-hidden flex flex-col max-h-full items-center justify-center">
          {/* <div className=" overflow-y-auto"> */}
          {isLoading && <Loader2 className="h-10 w-10 animate-spin" />}
          {isError && (
            <p className="pt-5 text-center">messages can't be loaded</p>
          )}
          {isSuccess &&
            data.status === 200 &&
            (messages?.length !== 0 ? (
              <div className="flex  flex-col  justify-end h-full w-full ">
                <Messagefeed
                  messages={messages}
                  bottomDivRef={scrollBottomRef}
                />
              </div>
            ) : (
              <p className="pt-5 text-center">No Messages yet</p>
            ))}
          {/* </div> */}
        </div>

        <div className="message-input-container p-6 border_t_stroke ">
          <div className="flex gap-3">
            <MessageTextArea
              className=" rounded-2xl resize-none py-3 outline-none px-5 selected_bg_color  font-medium grow block"
              onChange={(e) => setTypedMessage(e.target.value)}
              value={typedMessage}
            />
            <Button
              className="p-[14px] rounded-2xl h-12 flex item-center justify-center flex-col aspect-square  "
              onClick={() => mutate()}
              variant="myMain"
            >
              {isPending ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <SendIcon />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleChat;
