import {  createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState: {isInCall: boolean} = {
 isInCall: false,

};

// Create the slice
export const callSlice = createSlice({
  name: "Call",
  initialState,
  reducers: {
    startCall: (state) => {
      state.isInCall = true;
    },
    endCall: (state) => {
      state.isInCall = false;
    },
  },
});

// Export the reducer functions
export const { startCall, endCall } = callSlice.actions;

// Export the reducer
export default callSlice.reducer;
