import { ChatTypes, MessageType } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state
interface ChatsState {
  chats: ChatTypes[];
  selectedChat: ChatTypes | null;
}

const initialState: ChatsState = {
  chats: [],
  selectedChat: null,
};

// Create the slice
export const chatsSlice = createSlice({
  name: "Chats",
  initialState,
  reducers: {
    // addChat: (state, action: PayloadAction<ChatTypes>) => {
    //   state.chats.push(action.payload);
    // },
    // addChats: (state, action: PayloadAction<ChatTypes[]>) => {
    //   const newChats = action.payload;

    //   newChats.forEach((newChat: ChatTypes) => {
    //     const existingChat = state.chats.find(
    //       (chats) => chats._id === newChat._id
    //     );

    //     if (!existingChat) {
    //       state.chats.push(newChat);
    //     }
    //   });
    // },

    setChats: (state, action: PayloadAction<ChatTypes[]>) => {
      const chats = action.payload;
      state.chats = chats;
    },
    // setSelectedChat: (state, action: PayloadAction<ChatTypes>) => {
    //   state.selectedChat = action.payload;
    // },
    setSelectedChatById: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      const selectedChat = state.chats.find((chat) => chat._id === chatId);
      if (selectedChat) {
        state.selectedChat = selectedChat;
      } else {
        state.selectedChat = null;
      }
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
    updateChatUnreadedMessage: (state, action: PayloadAction<MessageType>) => {
      const message = action.payload;
      if (typeof message.chatId === "string" ) return;
      const index = state.chats.findIndex(
        (chat) => chat._id === message.chatId._id
      );
      state.chats[index].unreadMessages.push(message);
    },
    removeUnreadMessages: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId);

      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadMessages = [];
      }
    },
    updateChatLatestMessage: (state, action: PayloadAction<MessageType>) => {
      const message = action.payload;
      const index = state.chats.findIndex(
        (chat) => chat._id === message.chatId._id
      );
      state.chats[index].latestMessage = message;
    },
    resetChats: () => {
      return initialState;
    },
    // Other reducers for updating, removing, or clearing chats...
  },
});

// Export the reducer functions
export const {
  setChats,
  setSelectedChatById,
  clearSelectedChat,
  updateChatLatestMessage,
  updateChatUnreadedMessage,
  removeUnreadMessages,
  resetChats,
} = chatsSlice.actions;

// Export the reducer
export default chatsSlice.reducer;
