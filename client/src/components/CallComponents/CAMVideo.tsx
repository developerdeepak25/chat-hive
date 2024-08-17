import { cn } from "@/lib/utils";

type CAMVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  videoRef: React.RefObject<HTMLVideoElement>;
  className?: string;
} 

//  no need fo this component anymore compund component inside streamVideoDisplay component has taken its place
const CAMVideo = ({ videoRef, className, ...rest }: CAMVideoProps) => {
  return (
    <video
      ref={videoRef}
      className={cn("max-w-full   h-full ", className)}
      autoPlay
      {...rest}
    ></video>
  );
};

export default CAMVideo