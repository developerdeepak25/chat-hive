import { ReactNode } from "react";
import "./form.scss";

type FormWrapperProps = {
  children: ReactNode[];
};

const FormWrapper = ({ children }: FormWrapperProps) => {
  return (
    <div className="form_wrapper  px-14 py-16 rounded-xl border-[1px] border-[#363636]">
      <div className="form_inner flex justify-center w-[310px] flex-col gap-7">
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
