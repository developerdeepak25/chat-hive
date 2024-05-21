import { hasOtherElements } from "@/utils/functions";
import Profile from "../Shared/Profile/Profile";
type SingleChatHeaderProps = {
    profilePicture: string | undefined;
    username: string | undefined;
    activeParticipants: string[];
    userId: string| undefined;
    isTyping: boolean;
  
};


const SingleChatHeader = ({
  profilePicture,
  username,
  activeParticipants,
  userId,
  isTyping,
}: SingleChatHeaderProps) => {
  return (
    <div className=" py-5 border_b_stroke flex px-6 items-center gap-3 ">
      <Profile src={profilePicture} />
      <div className="flex flex-col">
        <h3 className=" text-lg">{username}</h3>
        {/* checking weather other chat partner is active beside the current */}
        {hasOtherElements(activeParticipants, userId!) ? (
          isTyping ? (
            <p className="text-sm font-normal text-gray-400">typing...</p>
          ) : (
            <p className="text-sm font-normal text-gray-400">online</p>
          )
        ) : (
          <p className="text-sm font-normal text-gray-400">offline</p>
        )}
      </div>
    </div>
  );
};

export default SingleChatHeader

