import { Loader2, LucideProps } from "lucide-react";

type FallBackType = LucideProps & {
  className?: string;
};

const FallBack = ({ size = 30, className, ...props }: FallBackType) => {
  return (
    <div
      className={`w-full flex justify-center items-center pt-5 ${className}`}
    >
      <Loader2
        size={size}
        className={` aspect-square animate-spin `}
        {...props}
      />
    </div>
  );
};

export default FallBack;
