import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type LateResponseMsgType = {
  isLoading: boolean;
  className?: string;
};

const LateResponseMsg = ({ isLoading, className }: LateResponseMsgType) => {
  const [showLateResponseMsg, setShowLateResponseMsg] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isLoading) {
      timer = setTimeout(() => {
        setShowLateResponseMsg(true);
      }, 4000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isLoading]);

  return showLateResponseMsg ? (
    <p className={cn(" text-base flex justify-center text-center", className)}>
      initial request may experience a delay of up to 1 minute due to hosting
      limitations.
    </p>
  ) : null;
};

export default LateResponseMsg;
