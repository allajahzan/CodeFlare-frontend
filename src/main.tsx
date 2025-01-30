import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.tsx";
// import { StrictMode } from "react";
import { UserContextProvider } from "./context/user-context.tsx";
import { ThemeContextProvider } from "./context/theme-context.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <ThemeContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </ThemeContextProvider>
  </Provider>
  // </StrictMode>
);
