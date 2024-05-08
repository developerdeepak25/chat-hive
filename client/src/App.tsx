import { useEffect } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import { io } from "socket.io-client";
import { Route, Routes } from "react-router-dom";
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

function App() {
  useEffect(() => {
    // const socket = io("http://localhost:5000");
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <>
      <Routes>
        <Route element={<PersistSignIn />}>
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          >
            <Route index element={<SignIn />}></Route>
            <Route path="signin" element={<SignIn />}></Route>
            <Route path="signup" element={<SignUp />}></Route>
          </Route>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<ChatPage />}>
              <Route
                index
                element={
                  <div className=" h-full grow flex flex-col items-center justify-center">
                    <h2 className=" text-lg text-center">
                      Select a chat to start chatting
                    </h2>
                  </div>
                }
              />
            </Route>
            <Route path="chats" element={<ChatPage />}>
              <Route path=":id" element={<SingleChat />} />
              <Route
                index
                element={
                  <div className=" h-full grow flex flex-col items-center justify-center">
                    <h2 className="text-lg text-center">
                      Select a chat to start chatting
                    </h2>
                  </div>
                }
              />
            </Route>
            <Route path="search" element={<SearchPage />} />
            <Route path="notification" element={<NotificationPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;

// import {  useRoutes, Outlet } from "react-router-dom";
// import SignUp from "./pages/auth/signup/SignUp";
// import SignIn from "./pages/auth/signin/SignIn";
// import AuthPage from "./pages/auth/AuthPage";
// import Home from "./pages/home/Home";
// import NotificationPage from "./pages/home/nested/NotificationPage";
// import SearchPage from "./pages/home/nested/SearchPage";
// import ChatPage from "./pages/home/nested/ChatPage";
// import SingleChat from "./pages/home/nested/SingleChat";

// function App() {
//   const routes = useRoutes([
//     {
//       path: "/auth",
//       element: <AuthPage />,
//       children: [
//         { index: true, element: <SignIn /> },
//         { path: "signin", element: <SignIn /> },
//         { path: "signup", element: <SignUp /> },
//       ],
//     },
//     {
//       path: "/",
//       element: <Home />,
//       children: [
//         {
//           path: "/",
//           element: <ChatPage />,
//           children: [
//             // { path: "chats/*", element: <Outlet /> },
//             {
//               path: "chats",
//               element: (
//                 <div className=" h-full grow flex flex-col items-center justify-center">
//                   <h2 className=" text-lg">Select a chat to start chatting</h2>
//                 </div>
//               ),
//             },
//             {
//               path: "/",
//               element: (
//                 <div className=" h-full grow flex flex-col items-center justify-center">
//                   <h2 className=" text-lg">Select a chat to start chatting</h2>
//                 </div>
//               ),
//             },
//             {
//               path: "chats/:id",
//               element: <SingleChat />,
//             },
//           ],
//         },
//         { path: "chats", element: <ChatPage /> },
//         { path: "search", element: <SearchPage /> },
//         { path: "notification", element: <NotificationPage /> },
//       ],
//     },
//   ]);

//   return <>{routes}</>;
// }

// export default App;
