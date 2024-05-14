import socket from "@/Socket";
import { useRef } from "react";

// making this function may be unnecessary  //? 

export const useTypingHandler = () => {
  const typingTimeout = useRef<NodeJS.Timeout>();
  return (
    Typing: boolean,
    setTyping: React.Dispatch<React.SetStateAction<boolean>>,
    chatId: string
  ) => {
    if (!Typing) {
      socket.emit("typing", chatId);
      setTyping(true); // Clear any existing timeout
    }
      console.log(typingTimeout.current);
      clearTimeout(typingTimeout.current); // Set a new timeout to set Typing to false after 900ms
      typingTimeout.current = setTimeout(() => {
        console.log(
          "timrout .................................................................."
        );
        setTyping(false);
        socket.emit("stop typing", chatId);
      }, 900);
    
  };
};
