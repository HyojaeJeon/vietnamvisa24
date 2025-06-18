// src/store/index.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import authReducer from "./authSlice";
import languageReducer from "./languageSlice";
import applyFormReducer from "./applyFormSlice";

// SSR 환경에서도 동작하는 NoopStorage 생성
const createNoopStorage = () => ({
  getItem(_key) {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem(_key) {
    return Promise.resolve();
  },
});

// 클라이언트 사이드에서만 localStorage 사용
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

// Persist 설정: auth 슬라이스는 제외하고 language/applyForm 만 저장
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["language", "applyForm"],
};

const rootReducer = combineReducers({
  auth: authReducer, // accessToken 만 메모리에 보관 (persist 제외)
  language: languageReducer, // 언어 설정만 persist
  applyForm: applyFormReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist action 무시
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// 디버깅/테스트 목적: 전역에서 Redux store 접근 가능
if (typeof window !== "undefined") {
  window.__REDUX_STORE__ = store;
}
