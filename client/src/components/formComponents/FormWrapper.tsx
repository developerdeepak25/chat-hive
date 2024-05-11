import { ReactNode } from "react";
import "./form.scss";

type FormWrapperProps = {
  children: ReactNode[];
};

const FormWrapper = ({ children }: FormWrapperProps) => {
  return (
    <div className="form_wrapper flex item-center  px-14 py-16 rounded-xl border-[1px] border-[#363636] max-sm:w-full max-sm:h-full max-sm:border-none max-sm:rounded-none max-sm:py-0 max-sm:px-5">
      <div className="form_inner flex justify-center w-[310px] flex-col gap-7 max-sm:w-full">
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
