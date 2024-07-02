import ProfileIcon from "@/assets/svgs/ProfileIcon";
import React from "react";

type ProfileProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  height?: string ;
};

const Profile: React.FC<ProfileProps> = ({ height='40', className,src, ...props }) => {
  return (
    <>
      {src ? (
        <div
          style={{ height: height+'px' }}
          className={`aspect-square rounded-full overflow-hidden   shrink-0`}
        >
          <img
            src={src}
            className={`object-cover min-h-full min-w-full object-center ${className} `}
            {...props}
          />
        </div>
      ) : (
        <ProfileIcon fill="#3a3a3a" height={height}  />
      )}
    </>
  ); 
}

export default Profile;
