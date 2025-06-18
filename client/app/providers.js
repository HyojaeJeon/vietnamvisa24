"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store";
import { ToastProvider } from "./src/hooks/useToast";
import { Toaster } from "./src/components/ui/toaster";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}
