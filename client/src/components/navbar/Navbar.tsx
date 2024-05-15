import AppLogo from "@/assets/svgs/AppLogo";
import SearchIcon from "@/assets/svgs/SearchIcon";
import NavLinkIconWrapper from "../Shared/NavLinkIconWrapper/NavLinkIconWrapper";
import ChatIcon from "@/assets/svgs/ChatsIcon";
import NotificationIcon from "@/assets/svgs/NotificationIcon";
import LogoutIcon from "@/assets/svgs/LogoutIcon";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { authAxios } from "@/AxiosInstance/AxiosInstance";
import { resetAuth } from "@/store/slices/authSlice";
import { resetChats } from "@/store/slices/chatsSlice";
import { resetNotifications } from "@/store/slices/notificationSlice";
import useMobileView from "@/Hooks/useMobileView";
import { useEffect } from "react";
import Profile from "../Shared/Profile/Profile";

type NavbarViewsType = {
  unreadNotificationsId: string[];
  handleSignOut: () => Promise<void>;
  userPic:string;
};

const Navbar = () => {
  const { unreadNotificationsId } = useAppSelector((state) => {
    return state.Notification;
  });
  const { userPic} = useAppSelector((state) => {
    return state.Auth;
  });
  const isMobile = useMobileView();
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
  useEffect(() => {
    if (isMobile) {
      console.log(isMobile, "mobile view");
    } else {
      console.log(isMobile, "desktop view");
    }
  });
  return isMobile ? (
    <MobileView
      unreadNotificationsId={unreadNotificationsId}
      handleSignOut={handleSignOut}
      userPic={userPic!}
      />
    ) : (
      <DesktopView
      unreadNotificationsId={unreadNotificationsId}
      handleSignOut={handleSignOut}
      userPic={userPic!}
    />
  );
};

const MobileView = ({
  unreadNotificationsId,
  handleSignOut,userPic
}: NavbarViewsType) => {
  return (
    <div className=" w-full  h-20 border_t_stroke fixed bottom-0 left-0 right-0 z-30 bg_primary">
      <div className="w-full h-full flex  ">
        {/* <div className="nav_upper grid  gap-16"> */}
        {/* <div className="logo">
          <NavLink to={"/"}>
            <AppLogo />
          </NavLink>
        </div> */}
        <div className="Navbar_links flex  w-full  items-center gap-4 justify-evenly">
          <div className=" p-[5px]">
            <Profile src={userPic} alt="resultuser" h={"30"} />
          </div>

          <NavLinkIconWrapper to={"/search"}>
            <SearchIcon />
          </NavLinkIconWrapper>
          <NavLinkIconWrapper to={"/chats"}>
            <ChatIcon />
          </NavLinkIconWrapper>
          <NavLinkIconWrapper
            to={"/notification"}
            notifications={unreadNotificationsId}
          >
            <NotificationIcon />
          </NavLinkIconWrapper>

          {/* <div className="nav_lower flex flex-col gap-7  items-center "> */}
          <div
            className="logout_wrapper p-[5px]  hover:bg-zinc-800 rounded-full cursor-pointer"
            onClick={handleSignOut}
          >
            <LogoutIcon />
          </div>
        </div>
      </div>
      {/* </div>*/}
    </div>
  );
};
const DesktopView = ({
  unreadNotificationsId,
  handleSignOut,
  userPic,
}: NavbarViewsType) => {
  return (
    <>
      <div className=" w-20  h-full border_r_stroke">
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
              <NavLinkIconWrapper to={"/chats"}>
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
            <div className=" p-[5px]">
              <Profile src={userPic} alt="resultuser" h={"30"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
