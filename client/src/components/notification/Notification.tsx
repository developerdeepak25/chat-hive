import { NotificationType } from "@/types/type";
import PeerUserWrapper from "../Shared/PeerUser/PeerUserWrapper";
import Profile from "../Shared/Profile/Profile";
import { Button } from "../ui/button";
import TickIcon from "@/assets/svgs/TickIcon";
import CrossIcon from "@/assets/svgs/CrossIcon";
import { privateAxios } from "@/AxiosInstance/AxiosInstance";
import { Loader2 } from "lucide-react";
import { useNotificationMutation } from "@/Hooks/useNotificationMutation";

const Notification = ({ data }: { data: NotificationType }) => {
  //   if (data.type === "reqReceived") {
  //     return (
  //       <div>Notification</div>
  //     )
  //   }
  return (
    <PeerUserWrapper>
      <NotificationVarient notification={data} />
    </PeerUserWrapper>
  );
};

const NotificationVarient = ({
  notification,
}: {
  notification: NotificationType;
}) => {

  const { senderId: sender, type, _id } = notification;

  //
  const acceptRequest = async (id: string) => {
    const response = await privateAxios.get(`/notification/accept-request/${id}`);
    return response;
  };

  //
  const rejectRequest = async (id: string) => {
    const response = await privateAxios.get(`/notification/reject-request/${id}`);
    return response;
  };

  //
  const { mutate: acceptMutate, isPending: isAcceptPending } =
    useNotificationMutation({
      notificationId: _id,
      fn: acceptRequest,
      errorMsg: "Unable to Accept Right Now",
      successMsg: "Request Accepted",
    });

  //
  const { mutate: rejectMutate, isPending: isRejectPending } =
    useNotificationMutation({
      notificationId: _id,
      fn: rejectRequest,
      errorMsg: "Unable to Reject Right Now",
      successMsg: "Request Rejected",
    });

  // const { mutate, isPending, error, data, isSuccess } = useMutation({
  //   mutationFn: acceptRequest,
  //   retry: false,
  //   onSuccess: (data) => {
  //     if ( data?.status === 200) {
  //       toast.success("Request Accepted", successsToastOptions);
  //       dispatch(removeNotification(_id));
  //     }
  //   },
  // });

  const getNotificationMessage = () => {
    switch (type) {
      case "reqReceived":
        return "requested to become friends";
      case "reqAccepted":
        return "accepted your friend request";
      case "reqRejected":
        return "rejected your friend request";
      default:
        return "";
    }
  };

  //  useEffect(() => {
  //    console.log(data, isPending);

  //    if (isSuccess && data?.status === 200) {
  //      toast.success("Request Accepted", successsToastOptions);
  //      dispatch(removeNotification(_id));
  //    }
  //  }, [_id, data, dispatch, isPending, isSuccess]);

  // useEffect(() => {
  //   if (error) {
  //     toast.error("Unable to Accept Right Now", errorToastOptions);
  //     console.log(error.message);
  //   }
  // }, [error]);

  // if (type === "reqReceived") {
  return (
    <>
      {/* <div className="flex  gap-4"> */}
      <div className="flex  items-center gap-4 ">
        <Profile src={sender.profilePicture} alt="resultuser" h={"40"} />

        {/* <img src={user.pic} alt="resultuser" /> */}
        <div className="py-2">
          <span>{sender.username} </span>
          <span className=" text-sm text-gray-400 ">
            {getNotificationMessage()}
          </span>
        </div>
      </div>
      {type === "reqReceived" && (
        <div className="flex gap-2">
          <Button
            variant="myMain"
            size="sm"
            className=" rounded-full px-5 h-8"
            onClick={() => acceptMutate(sender._id)}
            disabled={isAcceptPending}
          >
            {isAcceptPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TickIcon height={15} />
            )}
          </Button>
          <Button
            variant={"mySecondary"}
            size="sm"
            className=" rounded-full px-5 h-8"
            onClick={() => rejectMutate(sender._id)}
            disabled={isRejectPending}
          >
            {isRejectPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CrossIcon />
            )}
          </Button>
        </div>
      )}
      {/* </div> */}
    </>
  );
  // }
  return null;
};

export default Notification;
