import { ReactNode } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import "./NavLinkWrapper.css";

interface NavlinkWrapperType extends NavLinkProps {
  children: ReactNode;
  notifications?: string[];
}

const NavLinkIconWrapper = ({
  children,
  to,
  notifications = [],
}: NavlinkWrapperType) => {
  return (
    <NavLink to={to}>
      <div className="navlink_content_wrap">
        <div className=" relative">
          {!(notifications.length <= 0) && (
            <div className=" absolute h-4 aspect-square  bg_main rounded-full flex items-center justify-center right-[-6px] top-[-5px]">
              <p className="text-sm text-gray-300  font-bold">
                {notifications.length}
              </p>
            </div>
          )}

          {children}
        </div>
      </div>
    </NavLink>
  );
};

export default NavLinkIconWrapper;
