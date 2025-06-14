import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// import storage from 'redux-persist/lib/storage';
import languageSlice from "./languageSlice";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
// SSR 환경에서도 동작하는 NoopStorage
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// 클라이언트 사이드에서만 localStorage 사용
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user"], // 필요한 reducer만 persist
  blacklist: ["temporary"], // persist하지 않을 reducer
};

const persistedLanguageReducer = persistReducer(persistConfig, languageSlice);

export const store = configureStore({
  reducer: {
    language: persistedLanguageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
