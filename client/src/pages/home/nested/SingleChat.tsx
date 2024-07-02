import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSelectedChat,
  removeUnreadMessages,
  setSelectedChatById,
} from "@/store/slices/chatsSlice";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageType } from "@/types/type";
import socket from "@/Socket";
import { playSound } from "@/utils/functions";
import ChatHeader from "@/components/SingleChatCompo/ChatHeader";
import ChatFeedBox from "@/components/SingleChatCompo/ChatFeedBox";
import ChatInput from "@/components/SingleChatCompo/ChatInput";

const SingleChat = () => {
  const { id } = useParams();
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false); // partenr typing state
  const [activeParticipants, setActiveParticipants] = useState<string[]>([]);
  const { selectedChat } = useAppSelector((state) => {
    return state.Chats;
  });
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector((state) => {
    return state.Auth;
  });
  const { profilePicture, username } = selectedChat?.chatPartner || {};

  useEffect(() => {
    const handleParticipantLeft = (userId: string) => {
      // console.log(" participant left the chat", userId);
      setActiveParticipants((prev) => {
        return prev.filter((particpantId) => particpantId !== userId);
      });
    };
    const handleParticipantJoined = (userIds: string[]) => {
      // console.log("new participant joined", userIds);
      setActiveParticipants(userIds);
    };

    socket.emit("join chat", selectedChat?._id);
    socket.on("participant joined", handleParticipantJoined);
    socket.on("participant left", handleParticipantLeft);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    return () => {
      socket.emit("leave chat", selectedChat?._id);
      socket.off("participant left", handleParticipantLeft);
      socket.off("typing", () => setIsTyping(true));
      socket.off("stop typing", () => setIsTyping(false));
      socket.off("participant joined", handleParticipantJoined);
    };
  }, [selectedChat?._id]);

  useEffect(() => {
    dispatch(setSelectedChatById(id!));
    dispatch(removeUnreadMessages(id!));

    return () => {
      dispatch(clearSelectedChat());
    };
  }, [dispatch, id]);

  useEffect(() => {
    const liveChathandler = (message: MessageType) => {
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

  return (
    <>
      <div className="  h-full grow flex flex-col items-center justify-center max-sm:w-full max-sm:z-50  max-sm:absolute top-0 bottom-0 bg_primary  overflow-hidden">
        <div className=" h-full flex flex-col w-full bg_primary ">
          <ChatHeader
            profilePicture={profilePicture}
            username={username}
            activeParticipants={activeParticipants}
            userId={userId}
            isTyping={isTyping}
            chatPartnerId={selectedChat?.chatPartner._id}
          />
          <ChatFeedBox
            scrollBottomRef={scrollBottomRef}
            selectedChatId={selectedChat?._id}
            messages={messages}
            setMessages={setMessages}
          />

          <ChatInput
            setTypedMessage={setTypedMessage}
            selectedChatId={selectedChat?._id}
            typedMessage={typedMessage}
            setMessages={setMessages}
            scrollBottomRef={scrollBottomRef}
          />
        </div>
      </div>
    </>
  );
};

export default SingleChat;
