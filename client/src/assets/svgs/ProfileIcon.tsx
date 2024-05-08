import { SVGProps } from "@/types/type";
import { NavIconColor } from "@/utils/constant";

const ProfileIcon = ({
  height,
  fill = "#0C0C0C",
}: SVGProps & { fill?: string }) => {
  return (
    <svg
      width={height}
      height={height || "30"}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" shrink-0"
    >
      <path
        d="M30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15Z"
        fill={fill}
      />
      <path
        d="M5.53845 26.6402C6.35019 22.6454 10.2775 19.6154 15 19.6154C19.7225 19.6154 23.6498 22.6454 24.4616 26.6402C21.8804 28.7407 18.5873 30 15 30C11.4127 30 8.11956 28.7407 5.53845 26.6402Z"
        fill={NavIconColor}
      />
      <path
        d="M19.6154 12.9808C19.6154 15.5829 17.506 17.6923 14.9038 17.6923C12.3017 17.6923 10.1923 15.5829 10.1923 12.9808C10.1923 10.3787 12.3017 8.26923 14.9038 8.26923C17.506 8.26923 19.6154 10.3787 19.6154 12.9808Z"
        fill={NavIconColor}
      />
    </svg>
  );
};

export default ProfileIcon;
