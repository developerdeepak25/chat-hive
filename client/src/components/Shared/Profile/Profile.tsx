import ProfileIcon from "@/assets/svgs/ProfileIcon";
import React from "react";

type ProfileProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  h?: string ;
};

const Profile: React.FC<ProfileProps> = ({ h='40', className,src, ...props }) => {
  return (
    <>
      {src ? (
        <div
          style={{ height: h+'px' }}
          className={`aspect-square rounded-full overflow-hidden   shrink-0`}
        >
          <img
            src={src}
            className={`object-cover min-h-full min-w-full object-center ${className} `}
            {...props}
          />
        </div>
      ) : (
        <ProfileIcon fill="#3a3a3a" height={h}  />
      )}
    </>
  ); 
}

export default Profile;
