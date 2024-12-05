import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

type DecodeToken = {
  DisplayName: string;
  nameid: string;
};

type UserStore = {
  displayName: string;
  userId: string;
  isLogin: boolean;
  setDisplayName: (token: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  displayName: "",
  userId: "",
  isLogin: false,
  setDisplayName: (token: string) => {
    if (token) {
      const decodeToken: DecodeToken = jwtDecode(token);
      set({
        displayName: decodeToken.DisplayName || "",
        userId: decodeToken.nameid || "",
        isLogin: true,
      });
    } else {
      set({ isLogin: false });
    }
  },
}));
