import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type StreamVideoContextType = {
  videoRef: React.RefObject<HTMLVideoElement>;
  // stream: MediaStream | undefined;
};

const StreamVideoContext = createContext<StreamVideoContextType | null>(null);

type StreamVideoDisplayProps = {
  stream: MediaStream | undefined;
  children: ReactNode;
};

const StreamVideoDisplay: React.FC<StreamVideoDisplayProps> & {
  Video: typeof Video;
} = ({ stream, children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && videoRef?.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <StreamVideoContext.Provider value={{ videoRef }}>
      {children}
    </StreamVideoContext.Provider>
    // <div className=" absolute right-7 bottom-12 h-32  max-w-32 flex justify-center items-center">
    //   <CAMVideo videoRef={localVideoRef} muted={true} />
    // </div>
  );
};

type VideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  // videoRef: React.RefObject<HTMLVideoElement>;
  className?: string;
  mirrored?: boolean;
};
const Video = ({
  className,
  mirrored = false,
  muted = false,
  ...rest
}: VideoProps) => {
  const context = useContext(StreamVideoContext);
  if (!context)
    throw new Error("Video must be used within a StreamVideoDisplay");
  useEffect(() => {
    const videoElement = context?.videoRef?.current;
    if (!videoElement) return;
    if (muted) {
      videoElement.volume = 0;
      videoElement.muted = muted;
    } 
    // else {
    //   videoElement.volume = 1;
    //   videoElement.muted = muted;
    // }
  }, [context?.videoRef, muted]);
  return (
    <video
      ref={context.videoRef}
      className={cn(
        "max-w-full   h-full ",
        mirrored && "scale-x-[-1]",
        className
      )}
      autoPlay
      {...rest}
    ></video>
  );
};

StreamVideoDisplay.Video = Video;

export default StreamVideoDisplay;
