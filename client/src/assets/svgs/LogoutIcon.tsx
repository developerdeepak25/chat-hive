import { SVGProps } from "@/types/type";
import { NavIconColor } from "@/utils/constant";

const LogoutIcon = ({ height }: SVGProps) => {
  return (
    <svg
      // width="30"
      height={height || "30"}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.25 20L26.25 15M26.25 15L21.25 10M26.25 15H8.75M16.25 20V21.25C16.25 23.3211 14.5711 25 12.5 25H7.5C5.42894 25 3.75 23.3211 3.75 21.25V8.75C3.75 6.67894 5.42894 5 7.5 5H12.5C14.5711 5 16.25 6.67894 16.25 8.75V10"
        stroke={NavIconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LogoutIcon