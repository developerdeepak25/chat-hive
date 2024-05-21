export interface ApiResponse<T> {
  // error: string;
  status: number;
  data: T;
}

export type AuthStateType = {
  isAuthenticated: boolean;
  userId: undefined | string;
  userPic?: undefined | string;
  accessToken: undefined | string;
  name: undefined | string;
};

export interface SVGProps {
  width?: string;
  height?: string;
  // viewBox?: string;
  // fill?: string;
  // path?: string;
}

export type SignInResponse = {
  _id: string;
  name: string;
  email: string;
  userPic?: string;
  error?: string;
  accessToken: string;
  unreadNotifications:string[];
};

// result user types
export type UserDataType = {
  username: string;
  profilePicture?: string;
  _id: string;
  email?: string;
};
export type ChatType = {
  _id: string;
  chatPartner: UserDataType;
  // latestMessage: { createdAt: "string"; content : string};
  latestMessage: MessageType;
  unreadMessages: MessageType[];
};

export type NotificationType = {
  _id: string;
  recipientId: string;
  senderId: { _id: string; username: string; profilePicture: string };
  type: "reqReceived" | "reqAccepted" | "reqRejected" ;
};


export type MessageType = {
  _id: string;
  chatId: ChatType;
  senderId: UserDataType;
  content: string;
  type: "text" | "media";
  createdAt: string;
};
// export type UnreadMessageType = {
//   _id: string;
//   chatId:  string ;
//   senderId: string;
//   content: string;
//   type: "text" | "media";
//   createdAt: string;
// };