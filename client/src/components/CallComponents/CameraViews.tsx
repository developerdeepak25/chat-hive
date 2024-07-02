import { useEffect, useRef } from "react";
import CAMVideo from "./CAMVideo";
// import videoSrc from "../../assets/recording (10).mp4";

type CameraViewsProps = {
  remoteStream: MediaStream | undefined;
  localStream: MediaStream | undefined;
};

const CameraViews = ({ remoteStream, localStream }: CameraViewsProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (localStream && localVideoRef?.current) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteStream && remoteVideoRef?.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {
        // localStream?
        <CAMVideo videoRef={localVideoRef} />
        // : <h1>no stream</h1>
      }
      <div className=" absolute right-7 bottom-12 h-32  max-w-32 flex justify-center items-center">
        <CAMVideo videoRef={remoteVideoRef} className="h-full" />
      </div>
    </div>
  );
};

export default CameraViews;
