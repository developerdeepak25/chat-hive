import React, { useEffect } from "react";
import PeerUserWrapper from "../Shared/PeerUser/PeerUserWrapper";
import Profile from "../Shared/Profile/Profile";
import { ChatTypes } from "@/types/type";
import { formatTimestampForDisplay } from "@/utils/formatTimestampForDisplay";
import { useAppSelector } from "@/store/hooks";

const ResultChat: React.FC<{ chat: ChatTypes }> = ({ chat }) => {
  const { username, profilePicture: pic } = chat.chatPartner;
  const { createdAt, content } = chat?.latestMessage ?? {};
  const {userId } = useAppSelector((state)=>{
    return state.Auth;
  })

  //   put this logic in utility function
  //   const createdAt = "2024-04-16T15:47:26.915+00:00";
  // const createdAt = "2024-04-24T09:24:28.565Z";
  const createDateFormated = formatTimestampForDisplay(createdAt);
  const unreadMessageCount = chat.unreadMessages.filter(unreadMessage => unreadMessage.senderId._id !== userId ).length
  console.log(`unreadMessageCount`, unreadMessageCount);

  useEffect(() => {
    console.log(createDateFormated);
  }, [createDateFormated]);

  return (
    <>
      <div className="selected_bg_color_on_active">
        <PeerUserWrapper>
          <div className="flex gap-4 items-center">
            <Profile src={pic} alt="resultuser" h={"40"} />

            <div>
              <p>{username}</p>
              {content && <p className=" text-sm text-gray-400 ">{content}</p>}
            </div>
          </div>
          <div className="flex  h-full flex-col items-center gap-1">
           {createdAt && <p className=" text-xs text-gray-400 ">{createDateFormated}</p>}
            {!(unreadMessageCount <= 0 || !chat?.unreadMessages) && (
              <div className=" h-5 aspect-square  bg_main rounded-full flex items-center justify-center">
                {unreadMessageCount && <p className="text-xs text-gray-300 ">{unreadMessageCount}</p>}
              </div>
            )}
          </div>
        </PeerUserWrapper>
      </div>
    </>
  );
};

export default ResultChat;
