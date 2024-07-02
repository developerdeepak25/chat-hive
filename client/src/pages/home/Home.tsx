import { useCallToast } from "@/Hooks/CallPage.hooks";
import socket from "@/Socket";
import Navbar from "@/components/navbar/Navbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { startCall } from "@/store/slices/callSlice";
import { addUnreadNotifications } from "@/store/slices/notificationSlice";
import { playSound } from "@/utils/functions";
import { useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  const { userId } = useAppSelector((state) => {
    return state.Auth;
  });
  const dispatch = useAppDispatch();
  const { showToast } = useCallToast();

  useEffect(() => {
    socket.emit("setUp", userId);

    //  below code was probably unnecessary
    // return () => {
    //   socket.emit("leave chat", userId);
    // };
  }, [userId]);

  useEffect(() => {
    const cb = (notif: string) => {
      const array = [notif];
      dispatch(addUnreadNotifications(array));
      playSound();
    };
    socket.on("newNotification", cb);
    socket.on("newMessage", () => {
      console.log("playingsound");

      playSound();
    });
    return () => {
      socket.off("newNotification", cb);
      socket.off("newMessage", () => playSound());
    };
  }, [dispatch]);

  const handleIncomingCall = useCallback(
   (callId: string, senderId: string) => {
      playSound({ loop: true, type: "call" });
      dispatch(startCall())
      console.log("callroom id:", callId, " sender ID", senderId);
      showToast("john john", callId, senderId);
    },
    [dispatch, showToast]
  );
  useEffect(() => {
    socket.on("incoming-call", handleIncomingCall);
    return () => {
      socket.off("incoming-call", handleIncomingCall);
    };
  }, [handleIncomingCall]);

  return (
    <>
      <div className="w-full  overflow-hidden flex relative h-full ">
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};

export default Home;
