import { MessageType } from "@/types/type";
import { formatTimestampForDisplay } from "@/utils/formatTimestampForDisplay";

type Props = {
  message: MessageType;
  loggedUserId: string;
};

const Message = ({ message, loggedUserId }: Props) => {
  const { content, createdAt, senderId: sender } = message;
  // console.log(message, loggedUserId);

  return (
    <div
      className={`flex  ${
        sender._id !== loggedUserId ? "justify-start" : " justify-end"
      }`}
    >
      <span
        className={`flex gap-1 flex-col rounded-xl py-1 px-3 max-w-[70%] break-words ${
          sender._id !== loggedUserId ? "incoming_msg_bg" : "msg_bg "
        }`}
      >
        {content}
        <span className=" text-xs text-gray-400 self-end ">
          {formatTimestampForDisplay(createdAt)}
        </span>
      </span>
    </div>
  );
};

export default Message;
