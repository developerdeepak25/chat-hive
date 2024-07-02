import { hasOtherElements } from "@/utils/functions";
import Profile from "../Shared/Profile/Profile";
import VideoCallIcon from "@/assets/svgs/VideoCallIcon";
import { v4 as uuidv4 } from "uuid";
import socket from "@/Socket";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { startCall } from "@/store/slices/callSlice";

type SingleChatHeaderProps = {
  profilePicture: string | undefined;
  username: string | undefined;
  activeParticipants: string[];
  userId: string | undefined;
  isTyping: boolean;
  chatPartnerId: string | undefined;
};

const SingleChatHeader = ({
  profilePicture,
  username,
  activeParticipants,
  userId,
  isTyping,
  chatPartnerId,
}: SingleChatHeaderProps) => {
  // const { setToastId } = useCallToastContext();
  const { isInCall } = useAppSelector((state) => {
    return state.Call;
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleVideoCall = () => {
    if (isInCall) return toast("User is busy", {
      dismissible: true,
      position: "bottom-right",
    });
    const callId = uuidv4();
    navigate(`/call/${callId}`);
    socket.emit("outgoing-call", callId, chatPartnerId);
    dispatch(startCall());
    // toast for on call/videocall
    // const id = toast(<CallToast callerName="john john" onAccept={acceptCall}  onReject={rejectCall}/>, {
    //   closeButton: false,
    //   dismissible: true,
    //   onDismiss: () => console.log("lolo"),
    //   position: "top-right",
    //   duration: Infinity,
    // });

    // console.log(id);
    // setToastId(id);
  };

  return (
    <div className="py-3 border_b_stroke flex px-6 items-center justify-between">
      <div className="flex gap-3">
        <Profile src={profilePicture} />
        <div className="flex flex-col">
          <h3 className="text-lg">{username}</h3>
          {/* checking whether other chat partner is active beside the current */}
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
          className="cursor-pointer p-2 hover:bg-zinc-800 rounded-full"
          onClick={handleVideoCall}
        >
          <VideoCallIcon height={25} />
        </div>
      </div>
    </div>
  );
};

export default SingleChatHeader;
