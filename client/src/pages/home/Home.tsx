import socket from "@/Socket";
import Navbar from "@/components/navbar/Navbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addUnreadNotifications } from "@/store/slices/notificationSlice";
import { playSound } from "@/utils/functions";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  const { userId } = useAppSelector((state) => {
    return state.Auth;
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.emit("setUp", userId);
    return () => {
      socket.emit("leave chat", userId);
    };
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
