import { useEffect, useState } from "react";
import MessageTextArea from "../messageComp/MessageTextArea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import SendIcon from "@/assets/svgs/SendIcon";
import { useTypingHandler } from "@/Hooks/useTypingHandler";
import { useSendMessage } from "@/Hooks/SingleChat.hooks";
import { sendMessage } from "@/utils/apiFunctions";
import { MessageType } from "@/types/type";

type ChatInputProps = {
  setTypedMessage: React.Dispatch<React.SetStateAction<string>>;
  selectedChatId: string | undefined;
  typedMessage: string;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  scrollBottomRef: React.RefObject<HTMLElement>;
};

const ChatInput = ({
  setTypedMessage,
  selectedChatId,
  typedMessage,
  setMessages,
  scrollBottomRef,
}:
ChatInputProps) => {
  const [typing, setTyping] = useState(false); // current user typing state
  const typingHandler = useTypingHandler();
  
  const sendMessageOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("entered");
      mutate();
    }
  };


  const { mutate, isPending, isSuccess } = useSendMessage({
    fn: () => sendMessage(typedMessage, selectedChatId!),
    setMessages,
    setTypedMessage,
  });

  useEffect(() => {
    // did not used after sendMessage success beacuse ui is not rendered immediately, so below code scrolls to one msg less to the bottom thats why used in useEffect
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isSuccess, scrollBottomRef]);

  return (
    <div className="message-input-container p-6 border_t_stroke  ">
      <div className="flex gap-3">
        <MessageTextArea
          className=" rounded-2xl resize-none py-3 outline-none px-5 selected_bg_color  font-medium grow block"
          onChange={(e) => {
            setTypedMessage(e.target.value);
            if (selectedChatId) {
              typingHandler(typing, setTyping, selectedChatId);
            }
          }}
          onKeyDown={sendMessageOnEnter}
          value={typedMessage}
        />
        <Button
          className="p-[14px] rounded-2xl h-12 flex item-center justify-center flex-col aspect-square  "
          onClick={() => mutate()}
          variant="myMain"
        >
          {isPending ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : (
            <SendIcon />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
