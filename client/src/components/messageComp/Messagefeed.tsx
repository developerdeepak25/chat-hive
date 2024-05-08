import { useAppSelector } from "@/store/hooks";
import { MessageType } from "@/types/type";
import ScrollableFeed from "react-scrollable-feed";
import Message from "./Message";

type Props = {
  messages: MessageType[];
  bottomDivRef: React.RefObject<HTMLDivElement>;
};

const Messagefeed = ({ messages, bottomDivRef }: Props) => {
  const { userId } = useAppSelector((state) => {
    return state.Auth;
  });
  //  const {_id,senderId} = messages
  console.log(messages);

  return (
    <ScrollableFeed>
      <div className="flex flex-col p-3 gap-3 justify-end min-h-full">
        {messages?.map((message) => {
          return (
            <Message
              message={message}
              loggedUserId={userId!}
              key={message._id}
            />
          );
        })}
        {/* <div className="flex">
                <span className="incoming_msg_bg  rounded-xl p-3 max-w-[70%]">
                hey there how are you whatsapp though we are not on Whatsapp
                ha ha ddddfdf dfg dfg dfh dfhdgfg
                </span>
              </div> */}
      </div>
              <div ref={bottomDivRef}></div>
    </ScrollableFeed>
  );
};

export default Messagefeed;
