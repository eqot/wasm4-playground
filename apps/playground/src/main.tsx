import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";

import RootView from "./views/RootView";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootView />
  </React.StrictMode>,
);

function ignoreKeyHandlerFromWasm4(): void {
  const originalFunction = window.addEventListener;

  window.addEventListener = (type: string, listener: unknown) => {
    // @ts-ignore
    if (type !== "keydown" && type !== "keyup") originalFunction(type, listener);
  };
}
ignoreKeyHandlerFromWasm4();
