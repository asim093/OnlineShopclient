import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthSlice } from "../../models/AuthSlice";

interface LoginProps {
  username: string;
  image: string; // Fixed the `image` type to match conventions
  password: string;
}

const initialState: AuthSlice = {
  isLoggedIn:
    localStorage.getItem("username") !== null &&
    localStorage.getItem("username") !== undefined &&
    localStorage.getItem("username") !== "",
  modalOpen: false,
  username: localStorage.getItem("username") ?? "",
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    updateModal: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
    doLogin: (state, action: PayloadAction<LoginProps>) => {
      const { username, image } = action.payload;

      if (username || image) {
        localStorage.setItem("username", username);
        localStorage.setItem("profileimage", image);

        state.username = username;
        state.modalOpen = false;
        state.isLoggedIn = true;
      }
    },
    doLogout: (state) => {
      localStorage.removeItem("username");
      localStorage.removeItem("authToken");
      localStorage.removeItem("profileimage"); 

      state.username = "";
      state.isLoggedIn = false;
    },
  },
});

export const { updateModal, doLogin, doLogout } = authSlice.actions;
export default authSlice.reducer;
