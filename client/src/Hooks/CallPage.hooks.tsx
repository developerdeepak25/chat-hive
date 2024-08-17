import { toast } from "sonner";
import CallToast from "../components/CallComponents/CallToast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCallToastContext } from "@/contexts/CallToastContext";
import { acceptCall, rejectCall } from "@/utils/callFunctions";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";

type PermissionStatus = "granted" | "denied" | "prompt" | "unknown";

type useGetLocalStreamParams = {
  onPermissionDenied: () => void;
};

//TODO make a cb for on permission granted or already have permission
export const useGetLocalStream = ({
  onPermissionDenied,
}: useGetLocalStreamParams) => {
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [err, setError] = useState<Error | null>(null);
  const [micPermission, setMicPermission] =
    useState<PermissionStatus>("unknown");
  const [videoPermission, setVideoPermission] =
    useState<PermissionStatus>("unknown");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const toggleAudio = useCallback(() => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  }, [stream]);

  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, [stream]);

  useEffect(() => {
    const getStream = async () => {
      try {
        if (
          "mediaDevices" in navigator &&
          "getUserMedia" in navigator.mediaDevices
        ) {
          // Check permissions first
          // mic permision
          const micPermission = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });
          setMicPermission(micPermission.state);

          //video permission
          const cameraPermission = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });
          setVideoPermission(cameraPermission.state);

          if (
            micPermission.state === "prompt" ||
            micPermission.state === "granted"
          ) {
            // If permission hasn't been granted yet or granted, try to get it
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: true,
              // audio: {
              //   echoCancellation: true,
              //   noiseSuppression: true,
              //   autoGainControl: true,
              // },
            });
            setStream(stream);

            // idk setting state this way is good or not bcuz it does't gaurentees that audio or video are there
            setMicPermission("granted");
            setVideoPermission("granted");
          } else {
            // if  Microphone permission denied or else
            setVideoPermission("denied");
            setMicPermission("denied");
            onPermissionDenied();
          }

          // const stream = await navigator.mediaDevices.getUserMedia({
          //   audio: true,
          //   video: true,
          // });
          // setStream(stream);
        } else {
          throw new Error("getUserMedia does not exist");
        }
      } catch (err) {
        if (err instanceof Error) {
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            console.log("permission denied log from useGetLocalStream hook");

            onPermissionDenied();
          }
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
      }
    };
    getStream();

    // return () => {
    //   if (stream) {
    //     stream.getTracks().forEach((track) => {
    //       track.stop();
    //     });
    //   }
    // };
  }, [onPermissionDenied]);

  return {
    stream,
    err,
    micPermission,
    videoPermission,
    toggleAudio,
    toggleVideo,
    isAudioMuted,
    isVideoOff,
  };
};

export const useCallToast = () => {
  const { toastId, setToastId } = useCallToastContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const toastIdRef = useRef(toastId);

  const showToast = useCallback(
    (callerName: string, callId: string, callerId: string) => {
      const id = toast(
        <CallToast
          callerName={callerName}
          onAccept={() =>
            acceptCall(callId, callerId, navigate, toastIdRef.current!)
          } // probably this functions should be args of useCallToast
          onReject={() => rejectCall(toastIdRef.current!, callId, dispatch)}
        />,
        {
          closeButton: false,
          dismissible: true,
          onDismiss: () => rejectCall(toastIdRef.current!, callId, dispatch),
          position: "top-right",
          duration: Infinity,
        }
      );

      console.log(id);
      setToastId(id);
    },
    [dispatch, navigate, setToastId]
  );

  return { showToast, toastId };
};
