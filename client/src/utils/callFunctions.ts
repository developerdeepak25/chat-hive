import { NavigateFunction } from "react-router-dom";
import { stopSound } from "./functions";
import { toast } from "sonner";
import socket from "@/Socket";
import { setEndCall } from "@/store/slices/callSlice";
import { AppDispatch } from "@/store/store";

export const acceptCall = (
  callId: string,
  callerId: string,
  navigate: NavigateFunction,
  toastId: string | number
) => {
  stopSound("call");
  toast.dismiss(toastId);
  console.log("callId", callId, "callerId", callerId);
  navigate(`call/${callId}`);
};

export const rejectCall = (
  toastId: string | number,
  callId?: string,
  dispatch?: AppDispatch
) => {
  console.log("callId iniside rejectCall", callId);
  if (callId) {
    socket.emit("end-call", callId);
    console.log("call rejected and socket event fired");
  }
  if (dispatch) {
    dispatch(setEndCall());
  }
  stopSound("call");
  console.log(toastId);
  toast.dismiss(toastId);
  
  console.log("call rejected");
};
