import { NavIconColor } from "@/utils/constant";
import { SVGProps } from "react";

const VideoCallIcon = ({ height = "10" }: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" id="video" height={height} fill={NavIconColor}>
      <g>
        <path d="M21 7.15a1.7 1.7 0 0 0-1.85.3l-2.15 2V8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-1.45l2.16 2a1.74 1.74 0 0 0 1.16.45 1.68 1.68 0 0 0 .69-.15 1.6 1.6 0 0 0 1-1.48V8.63A1.6 1.6 0 0 0 21 7.15z"></path>
      </g>
    </svg>
  );
};

export default VideoCallIcon;
