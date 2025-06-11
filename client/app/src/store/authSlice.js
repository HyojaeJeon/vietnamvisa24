
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    rememberMe: false,
    autoLogin: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token, refreshToken, rememberMe, autoLogin } = action.payload;
      
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken || null;
      state.rememberMe = rememberMe || false;
      state.autoLogin = autoLogin || false;
      
      // localStorage에도 저장 (Apollo Client에서 사용)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.rememberMe = false;
      state.autoLogin = false;
      
      // localStorage에서도 제거
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('autoLoginEmail');
        localStorage.removeItem('autoLoginPassword');
        localStorage.removeItem('autoLoginEnabled');
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      // localStorage 업데이트
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    setAutoLogin: (state, action) => {
      state.autoLogin = action.payload;
    },
    updateTokens: (state, action) => {
      const { token, refreshToken } = action.payload;
      state.token = token;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      
      // localStorage 업데이트
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      }
    }
  }
});

export const { 
  loginSuccess, 
  logout, 
  updateUser, 
  setRememberMe, 
  setAutoLogin,
  updateTokens 
} = authSlice.actions;

export default authSlice.reducer;
