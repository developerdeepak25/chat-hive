import { apiAxios } from "@/AxiosInstance/AxiosInstance";
import socket from "@/Socket";
import ChatPlaceHolder from "@/components/Shared/ChatplaceHolder/ChatPlaceHolder";
import Notification from "@/components/notification/Notification";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addNotifications,
  clearUnreadNotifications,
} from "@/store/slices/notificationSlice";
import { ApiResponse } from "@/types/type";
import { playSound } from "@/utils/functions";
import { useEffect } from "react";

type ResponeNotificationTypes = {
  _id: string;
  error: string;
  recipientId: string;
  senderId: { _id: string; username: string; profilePicture: string };
  type: "reqReceived" | "reqAccepted" | "reqRejected" ;
};

const NotificationPage = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => {
    return state.Notification;
  });
  const getAllNotifications = async () => {
    try {
      const res: ApiResponse<ResponeNotificationTypes[]> = await apiAxios.get(
        "/notification/get-notifications"
      );
      console.log(res);
      if (res.status !== 200) return;
      dispatch(addNotifications(res.data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // fetching all notifications on newNotification here as there will not be many notification so hiting a endpoint(to get notif.. and removing notif... from unreadnotif..) on new notification seems feasible
    const cb = () => {
      getAllNotifications();
      console.log("inside notification page new notification listner");
      dispatch(clearUnreadNotifications());
      playSound()
    };
    socket.on("newNotification", cb);
    return () => {
      socket.off("newNotification", cb);
    };
  });

  useEffect(() => {
    getAllNotifications();
    dispatch(clearUnreadNotifications());        
  }, []);
  return (
    <>
      <div className="w-[400px] h-full grid overflow-y-hidden border_r_stroke">
        <div className="w-full h-full flex flex-col  gap-7 overflow-y-auto">
          <div className=" mt-6 ">
            <h2 className=" text-2xl font-medium px-4">Notifications</h2>{" "}
          </div>
          <div className="border_t_stroke">
            {notifications.length !== 0 ? (
              notifications.map((notification) => {
                return <Notification data={notification} key={notification._id} />;
              })
            ) : (
              <p className="pt-5 text-center">No Notifications yet</p>
            )}
          </div>
        </div>
      </div>
      <ChatPlaceHolder />
    </>
  );
};

export default NotificationPage;
