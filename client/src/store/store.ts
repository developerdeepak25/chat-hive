import { configureStore } from "@reduxjs/toolkit";
import  authSlice  from "./slices/authSlice";
import notificationSlice from "./slices/notificationSlice";
import chatsSlice from "./slices/chatsSlice";

const store = configureStore({
  reducer: {
    Auth: authSlice,
    Notification: notificationSlice,
    Chats: chatsSlice,

  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch