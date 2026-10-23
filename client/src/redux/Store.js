import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import adminReducer from "./slice/adminSlice";
import profileReducer from "./slice/profileSlice";
import socialCardsReducer from "./slice/socialCardsSlice";
import contactButtonsReducer from "./slice/contactButtonsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    profile: profileReducer,
    socialCards: socialCardsReducer,
    contactButtons: contactButtonsReducer,
  },
});

export default store;
