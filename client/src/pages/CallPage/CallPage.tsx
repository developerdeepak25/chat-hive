import { useGetLocalStream } from "@/Hooks/CallPage.hooks";
import socket from "@/Socket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCallStage, setEndCall } from "@/store/slices/callSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MediaConnection, Peer } from "peerjs";
import { Button } from "@/components/ui/button";
import CallEndIcon from "@/assets/svgs/CallEndIcon";
import StreamVideoDisplay from "@/components/CallComponents/StreamVideoDisplay";
import MicIcon from "@/assets/svgs/MicIcon";
import VideoCallIcon from "@/assets/svgs/VideoCallIcon";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import MicOffIcon from "@/assets/svgs/MicOffIcon";
import VideoOffIcon from "@/assets/svgs/VideoOffIcon";
// import { toast } from "react-toastify";

const CallPage = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isInCall, callStage } = useAppSelector((state) => {
    return state.Call;
  });
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();
  const peer = useRef<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | undefined>();
  // const [callState, setCallState] = useState<
  //   "ringing" | "waiting" | "connecting" | "connected" | "ended"
  // >("connecting");
  const [shouldShowDialog, setShouldShowDialog] = useState(false);

  const onPermissionDeniedHandler = useCallback(() => {
    console.error("Camera permission denied");
    // Use a proper toast library instead of alert
    alert("Camera permission not given");
    navigate("/");
  }, [navigate]);

  const {
    stream,
    err,
    micPermission,
    isAudioMuted,
    isVideoOff,
    toggleAudio,
    toggleVideo,
  } = useGetLocalStream({
    onPermissionDenied: onPermissionDeniedHandler,
  });

  // !TODO handleCallToPeer shpuld work only if micpermission is granted to do so may be add state for user connected on the 'user-connected' event of the socket and call handleCallToPeer is the useEffect with if constion with micpermission and and user connected state --  done probably

  const handleCalltoPeer = useCallback(
    
    (peerId: string) => {
      dispatch(setCallStage("connecting"));
      
      const call = peer.current?.call(peerId, stream!);
      console.log('calling peerId: ' + peerId, call);
      call?.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
        // dispatch(setCallStage("connecting"));
        dispatch(setCallStage("connected"));
      });
    },
    [dispatch, stream]
  );

  const endCall = useCallback(() => {
    console.log("end call handler");
    setShouldShowDialog(false);

    if (peer.current) {
      peer.current.destroy();
      peer.current = null;
    }

    // Stop the local media stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setRemoteStream(undefined);

    // fire event for server to notif other peer that call is ended
    if (callId) {
      socket.emit("end-call", callId);
    }

    //  Dispatch end call action to update global state
    dispatch(setEndCall());

    // navigate("/");
    console.log("end call handler end");
  }, [stream, callId, dispatch]);

  useEffect(() => {
    if (!isInCall) {
      // toast.success("isIncall is false", successsToastOptions);
      console.log("no call navigating -1");
      // setShouldShowDialog(false)
      navigate(-1);
      return;
    }
    dispatch(setCallStage("waiting"));
    setShouldShowDialog(true);
    return () => {
      endCall();
    };
  }, [isInCall, navigate, dispatch]); // * array has some missing dependency which is intentional so that cleanup function does not runs prematurely
  useEffect(() => {
    // if (!isInCall) {
    //   // toast.success("isIncall is false", successsToastOptions);
    //   navigate(-1);
    //   return;
    // }
    peer.current = new Peer();

    const handleOpen = (id: string) => {
      console.log("peer id from open", id);
      setPeerId(id);
    };

    const handleCall = (call: MediaConnection) => {
      console.log("answering call with stream");
      call.answer(stream);
      dispatch(setCallStage("connecting"));

      call.on("stream", (remoteStream) => {
        console.log("getting remote steam");
        setRemoteStream(remoteStream);
        dispatch(setCallStage("connected"));
      });
    };

    const handleConnection = () => {
      console.log("peer connected");
      // toast.success("peer connected", successsToastOptions);
    };

    peer.current.on("open", handleOpen);
    peer.current.on("call", handleCall);
    peer.current.on("connection", handleConnection);

    // const handlePeerClose = () => {
    //   console.log("here inside peer close listener");
    //   if (!peer.current && isInCall) return;
    //   toast.success("end call from close lis");
    //   endCall();
    // };

    // const handlePeerDisconnected = () => {
    //   console.log("Peer disconnected");
    //   if (!peer.current && isInCall) return;
    //   toast.success("end call from disconnected lis", successsToastOptions);
    //   endCall();
    // };

    //TODO: add reconnect feature probably. For no, just ended call on disconnect
    // * Close event works when current peer is closed not the remote peer
    // peer.current.on("close", handlePeerClose);

    // * disconnect event too cannot tell is remote peer is destroyed
    // peer.current.on("disconnected", handlePeerDisconnected);

    const handleEndCall = () => {
      console.log("end call emited");
      endCall();
      // toast.success("end call from end-call event");
    };
    socket.on("end-call", handleEndCall);

    return () => {
      // if (!peer.current) { // implemented if because it was cutting call without everhappening
      //   endCall();
      // }
      socket.off("end-call", handleEndCall);
      // toast.success(
      //   "end call from dispatch in cleanup func",
      //   successsToastOptions
      // );
      if (!peer.current || !peer) return;
      // peer.current.off("close", handlePeerClose);
      // peer.current.off("disconnected", handlePeerDisconnected);
      peer.current.off("open", handleOpen);
      peer.current.off("call", handleCall);
      peer.current.off("connection", handleConnection);
    };
  }, [dispatch, endCall, stream]);

  useEffect(() => {
    socket.on("user-connected", handleCalltoPeer); // this event  will happen for caller only
    return () => {
      socket.off("user-connected", handleCalltoPeer);
    };
  }, [handleCalltoPeer]);

  useEffect(() => {
    console.log(callId, "peer id", peerId);
    console.log("mic permission granted", micPermission);
    if (!peerId) return;
    socket.emit("join-call", callId, peerId);
    if (micPermission !== "granted" && micPermission !== "prompt") {
      // // * temporarily disabled
      endCall();
    }
    //  // TODO else condition will be here for this if statement not writen now for some reason
  }, [callId, endCall, micPermission, peerId]);

  //! this useEffect logic should be at top level
  useEffect(() => {
    const handleCalleeBusy = () => {
      endCall();
      toast("person is busy");
    };
    socket.on("callee-busy", handleCalleeBusy);

    return () => {
      socket.off("callee-busy", handleCalleeBusy);
    };
  }, [endCall]);
  useEffect(() => {
    console.log("confimation dialog state", shouldShowDialog);
  }, [shouldShowDialog]);

  return (
    <>
      <ConfirmationDialog
        message="Are you sure you want to exit the Call?"
        triggerValue={shouldShowDialog}
      />
      <div className="w-full   flex relative h-full bg_primary overflow-hidden justify-center items-center">
        {/* <h1 className=" text-4xl ">Call page</h1> */}
        {err ? (
          <h1 className=" text-4xl ">
            {/* {err.message} */}
            {/* {err.name} */}
            {err.stack}
          </h1>
        ) : null}
        {callStage === "waiting" && <p>Waiting for peer to join...</p>}
        {callStage === "connecting" && <p>Connecting to peer...</p>}

        {/* <CameraViews localStream={stream} remoteStream={remoteStream} /> */}

        {/* Remote stream */}
        {callStage === "connected" && (
          <div className="w-full h-full flex items-center justify-center relative">
            <StreamVideoDisplay stream={remoteStream}>
              <StreamVideoDisplay.Video className="h-full" mirrored={true} />
            </StreamVideoDisplay>
          </div>
        )}

        <div className=" absolute w-full bottom-0 flex  flex-col items-end ">
          <div className=" pr-2">
            <div className=" h-28   max-w-24 flex justify-end">
              <StreamVideoDisplay stream={stream}>
                <StreamVideoDisplay.Video
                  className="h-full"
                  muted={true}
                  mirrored={true}
                />
              </StreamVideoDisplay>
            </div>
          </div>
          <div className="w-full py-6 flex  justify-center">
            <div className="flex items-center w-44 justify-between">
              <div
                onClick={toggleAudio}
                className=" w-11 flex justify-center items-center cursor-pointer"
              >
                {isAudioMuted ? (
                  <MicOffIcon height={28} />
                ) : (
                  <MicIcon height={28} />
                )}
              </div>
              <Button
                size="lg"
                onClick={() => endCall()}
                className="rounded-full p-0 aspect-square "
              >
                <CallEndIcon width={22} />
              </Button>
              <div
                onClick={toggleVideo}
                className=" w-11 flex justify-center items-center cursor-pointer"
              >
                {isVideoOff ? (
                  <VideoOffIcon height={28} />
                ) : (
                  <VideoCallIcon height={28} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallPage;
