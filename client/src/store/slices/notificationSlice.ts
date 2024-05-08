import { NotificationType } from "@/types/type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState: {
  notifications: NotificationType[];
  unreadNotificationsId: string[];
} = {
  notifications: [],
  unreadNotificationsId: [],
};

// Create the slice
export const notificationSlice = createSlice({
  name: "Notifications",
  initialState,
  reducers: {
    // addNotification: (state, action) => {
    //   state.notifications.push(action.payload);
    // },
    // getNotificationsStart: (state) => {

    // },
    addNotifications: (state, action) => {
      const newNotifications = action.payload;

      newNotifications.forEach((newNotification: NotificationType) => {
        const existingNotification = state.notifications.find(
          (notification) => notification._id === newNotification._id
        );

        if (!existingNotification) {
          state.notifications.unshift(newNotification);
        }
      });
    },
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== notificationId
      );
    },
    addUnreadNotifications: (state, action: PayloadAction<string[]>) => {
      // state.unreadNotificationsId = action.payload;
      action.payload.forEach((unreadNotificationId)=>{
        state.unreadNotificationsId.push(unreadNotificationId);
      })
    },
    clearUnreadNotifications: (state) => {
      state.unreadNotificationsId = []
    },
    resetNotifications: () => {
      return initialState;
    }

  },
});

// Export the reducer functions
export const {
  addNotifications,
  removeNotification,
  addUnreadNotifications,
  clearUnreadNotifications,
  resetNotifications,
} = notificationSlice.actions;

// Export the reducer
export default notificationSlice.reducer;
