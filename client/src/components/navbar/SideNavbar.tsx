import AppLogo from "@/assets/svgs/AppLogo";
import SearchIcon from "@/assets/svgs/SearchIcon";
import NavLinkIconWrapper from "../Shared/NavLinkIconWrapper/NavLinkIconWrapper";
import ChatIcon from "@/assets/svgs/ChatsIcon";
import NotificationIcon from "@/assets/svgs/NotificationIcon";
import LogoutIcon from "@/assets/svgs/LogoutIcon";
import ProfileIcon from "@/assets/svgs/ProfileIcon";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { authAxios } from "@/AxiosInstance/AxiosInstance";
import {  resetAuth } from "@/store/slices/authSlice";
import { resetChats } from "@/store/slices/chatsSlice";
import { resetNotifications } from "@/store/slices/notificationSlice";

const SideNavbar = () => {
  const { unreadNotificationsId } = useAppSelector((state) => {
    return state.Notification;
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      // Send a POST request to the server to sign out
      await authAxios.post("/signout");

      //  reset all state data from store
      // did like this because not found any better way 
      dispatch(resetAuth());
      dispatch(resetChats());
      dispatch(resetNotifications());

      //  navigate to signin page
      navigate("/auth/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle sign out error
    }
  };
  return (
    <div className="w-full h-full flex flex-col  items-center py-8 justify-between gap-16">
      <div className="nav_upper grid  gap-16">
        <div className="logo">
          <NavLink to={"/"}>
            <AppLogo />
          </NavLink>
        </div>
        <div className="Navbar_links grid gap-4">
          <NavLinkIconWrapper to={"/search"}>
            <SearchIcon />
          </NavLinkIconWrapper>
          <NavLinkIconWrapper to={"/"}>
            <ChatIcon />
          </NavLinkIconWrapper>
          <NavLinkIconWrapper
            to={"/notification"}
            notifications={unreadNotificationsId}
          >
            <NotificationIcon />
          </NavLinkIconWrapper>
        </div>
      </div>
      <div className="nav_lower flex flex-col gap-7  items-center ">
        <div
          className="logout_wrapper p-2  hover:bg-zinc-800 rounded-full cursor-pointer"
          onClick={handleSignOut}
        >
          <LogoutIcon />
        </div>
        <ProfileIcon />
      </div>
    </div>
  );
};

export default SideNavbar;
