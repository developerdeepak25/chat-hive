import { toast } from "sonner";
import CallToast from "../components/CallComponents/CallToast";
import { useCallback, useEffect, useState } from "react";
import { useCallToastContext } from "@/contexts/CallToastContext";
import { onAcceptCall, onRejectCall } from "@/utils/callFunctions";
import { useNavigate } from "react-router-dom";

type useGetLocalStreamParams = {
  onPermissionDenied: () => void;
};

export const useGetLocalStream = ({
  onPermissionDenied,
}: useGetLocalStreamParams) => {
  const [stream, setStream] = useState<MediaStream  | undefined>(undefined);
  const [err, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getStream = async () => {
      try {
        if (
          "mediaDevices" in navigator &&
          "getUserMedia" in navigator.mediaDevices
        ) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          setStream(stream);
        } else {
          throw new Error("getUserMedia does not exist");
        }
      } catch (err) {
        if (err instanceof Error) {
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            console.log('permission denied log from useGetLocalStream hook');
            
            onPermissionDenied();
          }
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
      }
    };
    getStream();
  }, []);

  return { stream, err };
};

export const useCallToast = () => {
  const { toastId, setToastId } = useCallToastContext();
const navigate = useNavigate()
  const showToast = useCallback(
    (callerName: string,roomId :string, callerId:string) => {
      const id = toast(
        <CallToast
          callerName={callerName}
          onAccept={() => onAcceptCall(roomId, callerId, navigate)} // probably this functions should be args of useCallToast
          onReject={() => onRejectCall()}
        />,
        {
          closeButton: false,
          dismissible: true,
          onDismiss: ()=> onRejectCall(),
          position: "top-right",
          duration: Infinity,
          // className: "bg_dark",
        }
      );

      console.log(id);
      setToastId(id);
    },
    [setToastId]
  );

  return { showToast, toastId };
};
