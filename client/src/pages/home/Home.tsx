import socket from "@/Socket";
import Navbar from "@/components/navbar/Navbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addUnreadNotifications } from "@/store/slices/notificationSlice";
import { playSound } from "@/utils/functions";
import {  useEffect } from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  const { userId } = useAppSelector((state) => {
    return state.Auth;
  });
  // const { isInCall } = useAppSelector((state) => {
  //   return state.Call;
  // });
  const dispatch = useAppDispatch();
  // const { showToast } = useCallToast();

  useEffect(() => {
    socket.emit("setUp", userId);

    //  below code was probably unnecessary
    // return () => {
    //   socket.emit("leave chat", userId);
    // };
  }, [userId]);

  useEffect(() => {
    const handleNewNotification = (notif: string) => {
      const array = [notif];
      dispatch(addUnreadNotifications(array));
      playSound();
    };
    socket.on("newNotification", handleNewNotification);
    socket.on("newMessage", () => {
      console.log("playingsound");

      playSound();
    });
    return () => {
      socket.off("newNotification", handleNewNotification);
      socket.off("newMessage", () => playSound());
    };
  }, [dispatch]);

  // const handleIncomingCall = useCallback(
  //  (callId: string, sender:SenderType ) => {
  //   // if (isInCall) return  toast('person is busy')
  //   if (isInCall) return  socket.emit('callee-busy',sender.userId)

  //     playSound({ loop: true, type: "call" });
  //     dispatch(setStartCall());
  //     console.log("callroom id:", callId, " sender ID", sender.userId);
  //     console.log(sender.username, sender, "called you");
      
  //     showToast(sender.username, callId, sender.userId);
  //   },
  //   [dispatch, isInCall, showToast]
  // );
  // useEffect(() => {
  //   socket.on("incoming-call", handleIncomingCall);
  //   return () => {
  //     socket.off("incoming-call", handleIncomingCall);
  //   };
  // }, [handleIncomingCall]);

  return (
    <>
      <div className="w-full  overflow-hidden flex relative h-full bg_primary">
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};

export default Home;
