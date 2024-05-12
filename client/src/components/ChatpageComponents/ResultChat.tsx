import React, { useEffect } from "react";
import PeerUserWrapper from "../Shared/PeerUser/PeerUserWrapper";
import Profile from "../Shared/Profile/Profile";
import { ChatTypes } from "@/types/type";
import { formatTimestampForDisplay } from "@/utils/formatTimestampForDisplay";
import { useAppSelector } from "@/store/hooks";

const ResultChat: React.FC<{ chat: ChatTypes }> = ({ chat }) => {
  const { username, profilePicture: pic } = chat.chatPartner;
  const { createdAt, content } = chat?.latestMessage ?? {};
  const { userId } = useAppSelector((state) => {
    return state.Auth;
  });

  //   put this logic in utility function
  //   const createdAt = "2024-04-16T15:47:26.915+00:00";
  // const createdAt = "2024-04-24T09:24:28.565Z";
  const createDateFormated = formatTimestampForDisplay(createdAt);
  const unreadMessageCount = chat.unreadMessages.filter(
    (unreadMessage) => unreadMessage.senderId._id !== userId
  ).length;
  console.log(`unreadMessageCount`, unreadMessageCount);

  useEffect(() => {
    console.log(createDateFormated);
  }, [createDateFormated]);

  return (
    <>
      <div className="selected_bg_color_on_active w-full">
        <PeerUserWrapper>
          <div className=" w-full flex min-w-0 gap-4 justify-between">
            <div className="flex gap-4 items-center w-full min-w-0">
              <Profile src={pic} alt="resultuser" h={"40"} />

              <div className="  min-w-0">
                <p>{username}</p>
                {content && (
                  <p className=" text-sm text-gray-400 text-nowrap text-ellipsis min-w-0 overflow-hidden ">
                    {content}
                  </p>
                )}
              </div>
            </div>
            <div className="flex   flex-col items-center justify-center gap-1 shrink-0">
              {createdAt && (
                <p className=" text-xs text-gray-400   shrink-0">
                  {createDateFormated}
                </p>
              )}
              {!(unreadMessageCount <= 0 || !chat?.unreadMessages) && (
                <div className=" h-5 aspect-square  bg_main rounded-full flex items-center justify-center">
                  {/* {unreadMessageCount && ( */}
                    <p className="text-xs text-gray-300 ">
                      {unreadMessageCount}
                    </p>
                  {/* )} */}
                </div>
              )}
            </div>
          </div>
        </PeerUserWrapper>
      </div>
    </>
  );
};

export default ResultChat;
