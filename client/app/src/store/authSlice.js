import { createSlice } from "@reduxjs/toolkit";

// 초기 상태
const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 로그인 성공: user, accessToken만 상태에 저장
    loginSuccess: (state, action) => {
      const { user, accessToken } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.accessToken = accessToken;
    },
    // 로그아웃: 초기 상태로 리셋
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
    // 사용자 정보 업데이트
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }, // accessToken 갱신
    updateTokens: (state, action) => {
      const { accessToken } = action.payload;
      console.log("🔄 Redux: Updating access token", {
        oldToken: state.accessToken ? state.accessToken.substring(0, 20) + "..." : "none",
        newToken: accessToken ? accessToken.substring(0, 20) + "..." : "none",
      });
      state.accessToken = accessToken;
    },
  },
});

export const { loginSuccess, logout, updateUser, updateTokens } = authSlice.actions;
export default authSlice.reducer;
