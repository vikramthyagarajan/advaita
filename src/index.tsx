import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Editor from "./modules/editor/Editor";
import { Center, ChakraProvider, CSSReset } from "@chakra-ui/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import PlacementPlayground from "modules/playground/placement/PlacementPlayground";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ChakraProvider>
        <CSSReset />
        <Editor />
      </ChakraProvider>
    ),
  },
  {
    path: "/playground/placement",
    element: <PlacementPlayground />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
