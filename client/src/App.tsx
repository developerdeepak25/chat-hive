import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import SignUp from "./pages/auth/signup/SignUp";
import SignIn from "./pages/auth/signin/SignIn";
import AuthPage from "./pages/auth/AuthPage";
import Home from "./pages/home/Home";
import NotificationPage from "./pages/home/nested/NotificationPage";
import SearchPage from "./pages/home/nested/SearchPage";
import ChatPage from "./pages/home/nested/ChatPage";
import SingleChat from "./pages/home/nested/SingleChat";
import PrivateRoute from "./components/Auth/PrivateRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import PersistSignIn from "./components/Auth/PersistSignIn";
import FillerComponent from "./components/Shared/FillerComponent/FillerComponent";
import { ToastContainer } from "react-toastify";
import useMobileView from "./Hooks/useMobileView";
import { Toaster } from "./components/ui/sonner";
import CallPage from "./pages/CallPage/CallPage";
import { useCallback, useEffect } from "react";
import socket from "./Socket";
import { playSound } from "./utils/functions";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useCallToast } from "./Hooks/CallPage.hooks";
import {
  setCallStage,
  setEndCall,
  setStartCall,
} from "./store/slices/callSlice";
import { rejectCall } from "./utils/callFunctions";
import { toast } from "sonner";

type CallerType = {
  username: string;
  userId: string;
};

function AppLayout() {
  const ismobile = useMobileView();
  const { isInCall, callStage } = useAppSelector((state) => state.Call);
  const dispatch = useAppDispatch();
  const { showToast, toastId } = useCallToast();

  const handleIncomingCall = useCallback(
    (callId: string, caller: CallerType) => {
      if (isInCall) return socket.emit("callee-busy", caller.userId);

      socket.emit("initiate-call", callId);
      playSound({ loop: true, type: "call" });
      dispatch(setStartCall(callId));
      dispatch(setCallStage("ringing"));
      console.log("callroom id:", callId, " caller ID", caller.userId);
      console.log(caller.username, caller, "called you");

      showToast(caller.username, callId, caller.userId); // shows the call popup //Todo: name more concise
    },
    [dispatch, isInCall, showToast]
  );

  useEffect(() => {
    socket.on("incoming-call", handleIncomingCall);
    return () => {
      socket.off("incoming-call", handleIncomingCall);
    };
  }, [handleIncomingCall]);



  const handleEndCallOnRinging = useCallback(() => {
    toast('Call Ended')
    if (callStage !== "ringing") return;
    console.log("call hung up before pickup"); //
    dispatch(setEndCall());
    rejectCall(toastId!); 
  }, [callStage, dispatch, toastId]);

  useEffect(() => {
    // ths event is also listening in the callPage here it is sepecifically for scernio when caller has hanged call before reciver answers it
    //Todo this socket event will be the main and only endCall event ending the call currently this is listening in CallPage as well initially this was meant to end call on ring only but not anymore
    socket.on("end-call", handleEndCallOnRinging);
    return () => {
      socket.off("end-call", handleEndCallOnRinging);
    };
  }, [callStage, handleEndCallOnRinging]);

  return (
    <>
      <Outlet />
      <ToastContainer
        position={ismobile ? "top-center" : "bottom-right"}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      <Toaster
        theme="dark"
        className="dark"
        richColors
        position={ismobile ? "top-center" : "bottom-right"}
        closeButton={true}
      />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <PersistSignIn />,
        children: [
          {
            path: "/auth",
            element: (
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            ),
            children: [
              { index: true, element: <SignIn /> },
              { path: "signin", element: <SignIn /> },
              { path: "signup", element: <SignUp /> },
            ],
          },
          {
            path: "/",
            element: (
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            ),
            children: [
              {
                path: "/",
                element: <ChatPage />,
                children: [{ index: true, element: <FillerComponent /> }],
              },
              {
                path: "chats",
                element: <ChatPage />,
                children: [
                  { path: ":id", element: <SingleChat /> },
                  { index: true, element: <FillerComponent /> },
                ],
              },
              { path: "search", element: <SearchPage /> },
              { path: "notification", element: <NotificationPage /> },
            ],
          },
          { path: "/call/:callId", element: <CallPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;



// import { Route, Routes } from "react-router-dom";
// import SignUp from "./pages/auth/signup/SignUp";
// import SignIn from "./pages/auth/signin/SignIn";
// import AuthPage from "./pages/auth/AuthPage";
// import Home from "./pages/home/Home";
// import NotificationPage from "./pages/home/nested/NotificationPage";
// import SearchPage from "./pages/home/nested/SearchPage.tsx";
// import ChatPage from "./pages/home/nested/ChatPage";
// import SingleChat from "./pages/home/nested/SingleChat";
// import PrivateRoute from "./components/Auth/PrivateRoute";
// import PublicRoute from "./components/Auth/PublicRoute";
// import PersistSignIn from "./components/Auth/PersistSignIn";
// import FillerComponent from "./components/Shared/FillerComponent/FillerComponent";
// import { ToastContainer } from "react-toastify";
// import useMobileView from "./Hooks/useMobileView";
// import { Toaster } from "./components/ui/sonner.tsx";
// import CallPage from "./pages/CallPage/CallPage.tsx";
// import { useCallback, useEffect } from "react";
// import socket from "./Socket.ts";
// import { playSound } from "./utils/functions.ts";
// import { useAppDispatch, useAppSelector } from "./store/hooks.ts";
// import { useCallToast } from "./Hooks/CallPage.hooks.tsx";
// import { setStartCall } from "./store/slices/callSlice.ts";

// type CallerType = {
//   username: string;
//   userId: string;
// };
// function App() {
//     const ismobile = useMobileView();
//     const { isInCall } = useAppSelector((state) => {
//       return state.Call;
//     });
//     const dispatch = useAppDispatch();
//     const { showToast } = useCallToast();

//    const handleIncomingCall = useCallback(
//      (callId: string, caller: CallerType) => {
//        // if (isInCall) return  toast('person is busy')
//        if (isInCall) return socket.emit("callee-busy", caller.userId);

//        playSound({ loop: true, type: "call" });
//        dispatch(setStartCall());
//        console.log("callroom id:", callId, " caller ID", caller.userId);
//        console.log(caller.username, caller, "called you");

//        showToast(caller.username, callId, caller.userId);
//      },
//      [dispatch, isInCall, showToast]
//    );
//    useEffect(() => {
//      socket.on("incoming-call", handleIncomingCall);
//      return () => {
//        socket.off("incoming-call", handleIncomingCall);
//      };
//    }, [handleIncomingCall]);

//   return (
//     <>
//       <Routes>
//         <Route element={<PersistSignIn />}>
//           <Route
//             path="/auth"
//             // element={<AuthPage />}
//             element={
//               <PublicRoute>
//                 <AuthPage />
//               </PublicRoute>
//             }
//           >
//             <Route index element={<SignIn />}></Route>
//             <Route path="signin" element={<SignIn />}></Route>
//             <Route path="signup" element={<SignUp />}></Route>
//           </Route> 
//           <Route
//             path="/"
//             // element={<Home />}
//             element={
//               <PrivateRoute>
//                 <Home />
//               </PrivateRoute>
//             }
//           >
//             <   path="/" element={<ChatPage />}>
//               <Route index element={<FillerComponent />} />
//             </>
//             <Route path="chats" element={<ChatPage />}>
//               <Route path=":id" element={<SingleChat />} />
//               <Route index element={<FillerComponent />} />
//             </Route>
//             <Route path="search" element={<SearchPage />} />
//             <Route path="notification" element={<NotificationPage />} />
//           </Route>
//           <Route path="/call/:callId" element={<CallPage/>}></Route>
//         </Route>
//       </Routes>

//       {/* one toast is to be removed */}
//       <ToastContainer
//         position={ismobile ? "top-center" : "bottom-right"}
//         pauseOnFocusLoss={false}
//         pauseOnHover={false}
//       />
//       {/* giving any class to the Toaster component turns theme to dark(what i want) probably a bug or idk what is it */}
//       <Toaster theme='dark' className="dark" richColors position={ismobile ? "top-center" : "bottom-right"} />
//     </>
//   );
// }

// export default App;