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
      </div>
      <div ref={bottomDivRef}></div>
    </ScrollableFeed>
  );
};

export default Messagefeed;
