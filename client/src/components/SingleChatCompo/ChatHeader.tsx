import { hasOtherElements } from "@/utils/functions";
import Profile from "../Shared/Profile/Profile";
import VideoCallIcon from "@/assets/svgs/VideoCallIcon";
import { useToast } from "../ui/use-toast";
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

  const {toast} =  useToast()


  return (
    <div className=" py-3 border_b_stroke flex px-6 items-center  justify-between ">
      <div className=" flex gap-3 ">
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
      <div className="side_options">
        <div
          className=" cursor-pointer p-2 hover:bg-zinc-800 rounded-full"
          onClick={() => toast({ onClose: () => console.log("lolo") })}
        >
          <VideoCallIcon height={25} />
        </div>
      </div>
    </div>
  );
};

export default SingleChatHeader

