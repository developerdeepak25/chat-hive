import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { ReactNode, Suspense } from "react";
import FallBack from "../Fallback/FallBack";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => {
    return state.Auth;
  });
  console.log(isAuthenticated);

  return !isAuthenticated ? (
    <Suspense fallback={
    <FallBack size={35} />
  }
    >{children}</Suspense>
  ) : (
    <>
      {console.log("herer")}
      <Navigate to="/" />
    </>
  );
};

export default PublicRoute;
