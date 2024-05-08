import React from "react";

type PropsTypes = {
    children: React.ReactNode
}

const UsersScrobleContainer: React.FC<PropsTypes> = ({ children }) => {
  return (
    <div className="flex flex-col border_t_stroke overflow-y-hidden">
      <div className=" overflow-y-auto ">{children}</div>
    </div>
  );
};

export default UsersScrobleContainer
