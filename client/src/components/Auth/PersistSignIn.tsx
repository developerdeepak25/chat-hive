import { authAxios } from "@/AxiosInstance/AxiosInstance";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signin } from "@/store/slices/authSlice";
import { addUnreadNotifications } from "@/store/slices/notificationSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import FallBack from "../Fallback/FallBack";

const PersistSignIn = () => {
  const { isAuthenticated } = useAppSelector((state) => {
    return state.Auth;
  });
  const requestSignIn = async () => {
    const response = await authAxios.get("/refresh");
    return response;
  };
  const dispatch = useAppDispatch();

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["persistSignIn"],
    queryFn: () => requestSignIn(),
    enabled: !isAuthenticated,
    retry: false,
  });
  useEffect(() => {
    console.log("inside PersistSignin", data);

    if (isSuccess) {
      console.log("here inside effect");

      dispatch(signin(data?.data));
      dispatch(addUnreadNotifications(data?.data.unreadNotifications));
    }
  }, [data, dispatch, isSuccess]);

  return isLoading ? <FallBack size={35} /> : <Outlet />;
};

export default PersistSignIn;

// import { authAxios } from "@/AxiosInstance/AxiosInstance";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { signin } from "@/store/slices/authSlice";
// import { useQuery } from "@tanstack/react-query";
// import { Loader2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";

// const PersistSignIn = () => {
//   const { isAuthenticated } = useAppSelector((state) => state.Auth);
//   const [stateUpdated, setStateUpdated] = useState(false);
//   const requestSignIn = async () => {
//     const response = await authAxios.get("/refresh");
//     return response;
//   };
//   const dispatch = useAppDispatch();
//   const { data, isSuccess, isLoading, isError } = useQuery({
//     queryKey: ["persistSignIn"],
//     queryFn: () => requestSignIn(),
//     enabled: !isAuthenticated,
//     retry: false,
//   });

//   useEffect(() => {
//     if (isSuccess) {
//       console.log("here inside effect");
//       dispatch(signin(data?.data));
//       setStateUpdated(true);
//     }
//   }, [data, dispatch, isSuccess]);

//   if (isLoading) {
//     return <Loader2 className="h-12 aspect-square animate-spin" />;
//   }
//   if (isError) {
//     return <Outlet />;
//   }
//   if (stateUpdated) {
//     return <Outlet />;
//   }

//   return null;
// };

// export default PersistSignIn;
