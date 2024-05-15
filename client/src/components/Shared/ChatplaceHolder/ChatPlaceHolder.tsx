import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

const ChatPlaceHolder = () => {
  return (
    <div className="  h-full grow flex flex-col items-center justify-center gap-3  max-sm:hidden">
      <h2 className="text-lg text-center">Your Chats apper here</h2>
      <NavLink to={"/chats"}>
        <Button variant="myMain" size="sm" className=" rounded-full px-5 h-8">
          Go to Chats
        </Button>
      </NavLink>
    </div>
  );
};

export default ChatPlaceHolder;
