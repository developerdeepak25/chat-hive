import { cn } from "@/lib/utils";

type CAMVideoProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  className?: string;
};
const CAMVideo = ({ videoRef, className }: CAMVideoProps) => {
  return (
    <video
      ref={videoRef}
      className={cn("max-w-full   h-full ", className)}
      autoPlay
    ></video>
  );
};

export default CAMVideo