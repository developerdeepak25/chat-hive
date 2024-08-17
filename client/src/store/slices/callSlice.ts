import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state

type callStage =
  | "ringing"
  | "waiting"
  | "connecting"
  | "connected"
  // | "ended"
  | null;
const initialState: {
  isInCall: boolean;
  callStage: callStage;
  callId: string | null;
} = {
  isInCall: false,
  callStage: null,
  callId:null
};

// Create the slice
export const callSlice = createSlice({
  name: "Call",
  initialState,
  reducers: {
    setStartCall: (state,action:PayloadAction<string>) => {
      state.isInCall = true;
      state.callId = action.payload;
    },
    setEndCall: (state) => {
      state.isInCall = false;
      state.callStage = null;
      // state.callId = null;
    },
    setCallStage: (state, action: PayloadAction<callStage>) => {
      state.callStage = action.payload;
    },
  },
});

// Export the reducer functions
export const { setStartCall, setEndCall, setCallStage } = callSlice.actions;

// Export the reducer
export default callSlice.reducer;
