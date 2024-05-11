import { Outlet } from "react-router-dom";

// import '../../styles/variable.scss'
import "./AuthPage.scss";
import { useEffect } from "react";

const AuthPage = () => {
  useEffect(() => {}, []);
  return (
    <>
      <div className="auth_Wrapper flex items-center justify-center w-full h-dvh">
        <Outlet />
      </div>
    </>
  );
};

export default AuthPage;
