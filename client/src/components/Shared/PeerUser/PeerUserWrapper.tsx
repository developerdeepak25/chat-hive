import { ReactNode } from "react";

type PeerTypes = {
  children: ReactNode;
};

const PeerUserWrapper = ({ children }: PeerTypes) => {
  return (
    <div className="border_b_stroke px-4 min-h-16 flex items-center ">
      <div className="flex justify-between w-full items-center gap-4">
        {children}
      </div>
    </div>
  );
};

export default PeerUserWrapper;
