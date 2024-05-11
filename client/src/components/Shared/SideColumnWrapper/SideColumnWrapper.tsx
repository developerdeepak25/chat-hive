import  { ReactNode } from "react";

const SideColumnWrapper = ({ children }:{children:ReactNode}) => {
  return (
    <div className="w-[400px] h-full grid overflow-y-hidden border_r_stroke max-sm:w-full max-sm:relative top-0">
      <div className="w-full h-full flex flex-col  gap-7 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default SideColumnWrapper;
