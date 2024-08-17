import CallEndIcon from "@/assets/svgs/CallEndIcon";
import Profile from "../Shared/Profile/Profile";
import { Button } from "../ui/button";
import CallIcon from "@/assets/svgs/CallIcon";
import { useCallToastContext } from "@/contexts/CallToastContext";
import { useEffect } from "react";

type CallToastProps = {
  callerName: string;
  callerPic?: string | undefined;
  onAccept: () => void;
  onReject: () => void;
};

const CallToast = ({
  callerName,
  callerPic,
  onAccept,
  onReject,
}: CallToastProps) => {
  const { toastId } = useCallToastContext();
  useEffect(() => {
    console.log(toastId);
  }, [toastId]);

  return (
    <>
      <div className="flex justify-between w-full">
        <div className="caller_details flex gap-4 items-center">
          <Profile src={callerPic} height={"35"} />
          <p className=" text-base">{callerName}</p>
        </div>
        <div className="answer_options flex gap-4">
          <Button variant="myMain" size="sm" onClick={onAccept}>
            <div className="call_icon_wrapper w-5 grid place-content-center">
              <CallIcon width={15} />{" "}
            </div>
          </Button>
          <Button variant={"mySecondary"} size="sm" onClick={onReject}>
            <div className="call_icon_wrapper w-5 grid place-content-center">
              <CallEndIcon width={20} />
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CallToast;
