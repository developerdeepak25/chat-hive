import { apiAxios } from "@/AxiosInstance/AxiosInstance";
import socket from "@/Socket";
import ResultChat from "@/components/ChatpageComponents/ResultChat";
import UsersScrobleContainer from "@/components/Shared/UsersScrobleContainer/UsersScrobleContainer";
import SearchBar from "@/components/input/SearchBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setChats,
  updateChatLatestMessage,
  updateChatUnreadedMessage,
} from "@/store/slices/chatsSlice";
import { ChatTypes } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const ChatPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const { chats, selectedChat } = useAppSelector((state) => {
    return state.Chats;
  });

  const getChatsFromApi = async () => {
    const response = await apiAxios.get(`/chat/get-chats`);
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

  const filteredChats = chats?.filter((chat: ChatTypes) =>
    chat.chatPartner.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // console.log(filteredChats);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);
  useEffect(() => {
    const newMessageHandler = (message) => {
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
      <div className="w-[400px] h-full grid overflow-y-hidden border_r_stroke">
        <div className="w-full h-full flex flex-col  gap-7 overflow-y-auto">
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
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isError && (
              <p className="pt-5 text-center">No Chats present yet</p>
            )}
            {isSuccess &&
              data?.status === 200 &&
              (filteredChats.length !== 0 ? (
                filteredChats.map((chat: ChatTypes) => {
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
        </div>
      </div>
      <div className="  h-full grow flex flex-col items-center justify-center ">
        {/* <h1>i am empty but not shared</h1> */}
        {/* <h2 className=" text-lg">Select a chat to start chatting</h2> */}
        <Outlet />
      </div>
    </>
  );
};

export default ChatPage;
