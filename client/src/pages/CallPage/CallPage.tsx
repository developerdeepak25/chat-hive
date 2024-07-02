import { useGetLocalStream } from "@/Hooks/CallPage.hooks";
import socket from "@/Socket";
import CameraViews from "@/components/CallComponents/CameraViews";
import { useAppDispatch } from "@/store/hooks";
import { endCall } from "@/store/slices/callSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Peer } from "peerjs";

const CallPage = () => {
  const { callId } = useParams();
  const { stream, err } = useGetLocalStream({
    onPermissionDenied: onPermissionDeniedHandler,
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const peer = useRef<Peer | null>(null);

  function onPermissionDeniedHandler() {
    // to be handled properly in the future just to test now
    console.log("permission denied");

    alert("camera permission not given"); // a toast will be shown
    navigate("/");
  }

  useEffect(() => {
    peer.current = new Peer();
    peer?.current?.on("call", (call) => {
      // Answer the call and send our local stream
      call.answer(stream);

      // Handle receiving the remote stream
      call.on("stream", (remoteStream) => {
        // Display remote video
        setRemoteStream(remoteStream);
      });
    });
  }, [peer, stream]);

  const handleCalltoPeer = useCallback(
    (peerId: string) => {
      const call = peer.current?.call(peerId, stream!);
      call?.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });
    },
    [stream]
  );
  useEffect(() => {
    socket.on("user-connected", handleCalltoPeer);
    return () => {
      socket.off("user-connected", handleCalltoPeer);
    };
  }, [handleCalltoPeer]);

  useEffect(() => {
    console.log(callId);
    socket.emit("join-call", callId, peer.current?.id);
    return () => {
      dispatch(endCall());
    };
  }, [callId, dispatch]);

  return (
    <div className="w-full   flex relative h-full bg_primary overflow-hidden">
      {/* <h1 className=" text-4xl ">Call page</h1> */}
      {err ? (
        <h1 className=" text-4xl ">
          {/* {err.message} */}
          {/* {err.name} */}
          {err.stack}
        </h1>
      ) : null}
      {/* {log && <h1>{log}</h1>} */}
      {/* <button onClick={() => getStream()}>Start Camera</button> */}
      <CameraViews localStream={stream} remoteStream={stream} />
    </div>
  );
};

export default CallPage;
