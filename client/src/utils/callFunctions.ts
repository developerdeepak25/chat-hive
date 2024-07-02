import { NavigateFunction } from "react-router-dom";

export const onAcceptCall = (roomId:string, callerId:string, navigate: NavigateFunction) =>{
    console.log('roomId', roomId, 'callerId', callerId);
    navigate(`call/${roomId}`)
}

export const onRejectCall = ()=> {
 console.log('call rejected');
}