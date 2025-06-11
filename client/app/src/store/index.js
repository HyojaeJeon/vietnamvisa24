import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import languageReducer from "./languageSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "language"], // auth와 language 상태만 persist
};

const rootReducer = combineReducers({
  auth: authReducer,
  language: languageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// Redux store를 전역에서 접근할 수 있도록 설정
if (typeof window !== "undefined") {
  window.__REDUX_STORE__ = store;
}
