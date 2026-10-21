import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import adminReducer from "./slice/adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
  },
});

export default store;
