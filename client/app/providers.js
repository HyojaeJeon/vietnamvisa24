"use client";
import { Provider } from "react-redux";
import store from "../store";
import { ToastProvider } from "./src/hooks/useToast";
import { Toaster } from "./src/components/ui/toaster";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </Provider>
  );
}