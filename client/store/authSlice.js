import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;

      // localStorage에도 저장
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;

      // localStorage에서도 제거
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token"); // 기존 키도 제거
        localStorage.removeItem("authToken"); // 기존 키도 제거
      }
    },
    updateTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }

      // localStorage 업데이트
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      }
    },
    rehydrateAuth: (state) => {
      // localStorage에서 토큰 복원
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken) {
          state.isAuthenticated = true;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;

          // 토큰 키 통일 (token, authToken -> accessToken)
          if (localStorage.getItem("token") || localStorage.getItem("authToken")) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.removeItem("token");
            localStorage.removeItem("authToken");
          }
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateTokens, rehydrateAuth, clearError } = authSlice.actions;

export default authSlice.reducer;
