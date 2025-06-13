"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function StoreProvider({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 서버사이드에서는 PersistGate 없이 기본 Provider만 사용
  if (!isClient) {
    return <Provider store={store}>{children}</Provider>;
  }

  // 클라이언트사이드에서만 PersistGate 사용
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
