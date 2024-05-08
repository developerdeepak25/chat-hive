import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { ReactNode, Suspense } from "react";
import { Loader2 } from "lucide-react";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => {
    return state.Auth;
  });
  console.log(isAuthenticated);

  return !isAuthenticated ? (
    <Suspense
      fallback={<Loader2 className="h-12 aspect-square animate-spin" />}
    >
      {children}
    </Suspense>
  ) : (
    <>
      {console.log("herer")}
      <Navigate to="/" />
    </>
  );
};

export default PublicRoute;
