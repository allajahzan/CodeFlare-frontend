import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.tsx";
import { StrictMode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import {UserContextProvider} from "./context/userContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <Provider store={store}>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </Provider>
    </NextUIProvider>
  </StrictMode>
);
