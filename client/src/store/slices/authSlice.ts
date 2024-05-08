import { AuthStateType } from "@/types/type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


// Define the initial state
const initialState: AuthStateType = {
  isAuthenticated: false,
  userId: undefined,
  userPic: undefined,
  accessToken: undefined,
  name: undefined,
};

// Create the slice
export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    signin: (
      _,
      action: PayloadAction<{
        name: string | undefined;
        _id: string | undefined;
        userPic?: string | undefined;
        accessToken: string | undefined;
      }>
    ) => {
      const { name, _id, userPic=undefined, accessToken } = action.payload;
      return {
        isAuthenticated: true,
        name,
        userId: _id,
        userPic,
        accessToken,
      };
    },
    resetAuth: () => {
     return initialState
    },
    setAccessToken:(state,action)=>{
      state.accessToken = action.payload;
    }
  },
});

// Export the reducer functions
export const { signin, resetAuth, setAccessToken } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
