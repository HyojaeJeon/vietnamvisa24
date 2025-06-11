
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import languageSlice from './languageSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['language']
};

const persistedLanguageReducer = persistReducer(persistConfig, languageSlice);

export const store = configureStore({
  reducer: {
    language: persistedLanguageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
