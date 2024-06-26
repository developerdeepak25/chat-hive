import { privateAxios } from "@/AxiosInstance/AxiosInstance";
import socket from "@/Socket";
import ChatPlaceHolder from "@/components/Shared/ChatplaceHolder/ChatPlaceHolder";
import SideColumnWrapper from "@/components/Shared/SideColumnWrapper/SideColumnWrapper";
import Notification from "@/components/notification/Notification";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addNotifications,
  clearUnreadNotifications,
} from "@/store/slices/notificationSlice";
import { playSound } from "@/utils/functions";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

// type ResponeNotificationTypes = {
//   _id: string;
//   error: string;
//   recipientId: string;
//   senderId: { _id: string; username: string; profilePicture: string };
//   type: "reqReceived" | "reqAccepted" | "reqRejected";
// };

const NotificationPage = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => {
    return state.Notification;
  });
 
  const {mutate} =  useMutation({
    mutationFn:async()=>{
     const res=  await privateAxios.get("/notification/get-notifications");
     return res;
    },
    onSuccess:(res)=>{
      console.log(res);
      if (res.status !== 200) return;
      dispatch(addNotifications(res.data));
    },
    onError:(err)=>{
      console.error(err);
    },
    retry:false
  })
  useEffect(() => {
    // fetching all notifications on newNotification here as there will not be many notification so hiting a endpoint(to get notif.. and removing notif... from unreadnotif..) on new notification seems feasible
    const cb = () => {
      mutate();
      console.log("inside notification page new notification listner");
      dispatch(clearUnreadNotifications());
      playSound();
    };
    socket.on("newNotification", cb);
    return () => {
      socket.off("newNotification", cb);
    };
  },[dispatch, mutate]);

  useEffect(() => {
    mutate();
    dispatch(clearUnreadNotifications());
  }, []);
  return (
    <>
      <SideColumnWrapper>
        <div className=" mt-6 ">
          <h2 className=" text-2xl font-medium px-4">Notifications</h2>{" "}
        </div>
        <div className="border_t_stroke">
          {notifications.length !== 0 ? (
            notifications.map((notification) => {
              return (
                <Notification data={notification} key={notification._id} />
              );
            })
          ) : (
            <p className="pt-5 text-center">No Notifications yet</p>
          )}
        </div>
      </SideColumnWrapper>
      <ChatPlaceHolder />
    </>
  );
};

export default NotificationPage;
