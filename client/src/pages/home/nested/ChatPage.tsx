import { privateAxios } from "@/AxiosInstance/AxiosInstance";
import socket from "@/Socket";
import ResultChat from "@/components/ChatpageComponents/ResultChat";
import FallBack from "@/components/Fallback/FallBack";
import SideColumnWrapper from "@/components/Shared/SideColumnWrapper/SideColumnWrapper";
import UsersScrobleContainer from "@/components/Shared/UsersScrobleContainer/UsersScrobleContainer";
import SearchBar from "@/components/input/SearchBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setChats,
  updateChatLatestMessage,
  updateChatUnreadedMessage,
} from "@/store/slices/chatsSlice";
import { ChatType, MessageType } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const ChatPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const { chats, selectedChat } = useAppSelector((state) => {
    return state.Chats;
  });

  const getChatsFromApi = async () => {
    const response = await privateAxios.get(`/chat/get-chats`);
    return response;
  };
  const { isPending, error, data, isSuccess, isError } = useQuery({
    queryKey: ["userChats"],
    queryFn: getChatsFromApi,
    retry: false,
  });
  useEffect(() => {
    if (isSuccess) {
      console.log("i am running", data?.data);

      dispatch(setChats(data?.data));
    }
  }, [data, dispatch, isSuccess]);

  const filteredChats = chats?.filter((chat: ChatType) =>
    chat.chatPartner.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // console.log(filteredChats);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);
  useEffect(() => {
    const newMessageHandler = (message: MessageType) => {
      console.log("i am running inside emit", message.chatId._id);
      dispatch(updateChatLatestMessage(message));
      if (selectedChat === null) {
        console.log("no chat selected", selectedChat);
        dispatch(updateChatUnreadedMessage(message));
        return;
      }
      if (message.chatId._id !== selectedChat._id) {
        console.log("chat selected but not same");
        dispatch(updateChatUnreadedMessage(message));
      }
    };
    socket.on("newMessage", newMessageHandler);
    return () => {
      socket.off("newMessage", newMessageHandler);
    };
  }, [dispatch, selectedChat, selectedChat?._id]);

  useEffect(() => {
    if (error) {
      // toast.error("Unable to Accept Right Now", errorToastOptions);
      console.log(error.message);
    }
  }, [error]);

  return (
    <>
      <SideColumnWrapper>
        <div className="flex flex-col gap-7">
          <div className="w-full  mt-6 px-4 ">
            <SearchBar
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Search"
            />
          </div>
          <h2 className=" text-2xl font-medium px-4">Chats</h2>
        </div>
        <UsersScrobleContainer>
          {isPending && <FallBack size={25}/>}
          {isError && <p className="pt-5 text-center">No Chats present yet</p>}
          {isSuccess &&
            data?.status === 200 &&
            (filteredChats.length !== 0 ? (
              filteredChats.map((chat: ChatType) => {
                return (
                  <NavLink key={chat._id} to={`/chats/${chat._id}`}>
                    <ResultChat chat={chat} />
                  </NavLink>
                );
              })
            ) : (
              <p className="pt-5 text-center">No Chats Found</p>
            ))}
        </UsersScrobleContainer>
      </SideColumnWrapper>
      {/* <h1>i am empty but not shared</h1> */}
      {/* <h2 className=" text-lg">Select a chat to start chatting</h2> */}
      <Outlet />
    </>
  );
};

export default ChatPage;
