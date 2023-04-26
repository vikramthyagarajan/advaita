import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Editor from "./modules/editor/Editor";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import PlacementPlayground from "modules/playground/placement/PlacementPlayground";
import ArrowsPlayground from "modules/playground/arrows/ArrowsPlayground";
import { Analytics } from "@vercel/analytics/react";
import { Signin, Signup } from "modules/account/Account";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Editor />,
  },
  {
    path: "/account/login",
    element: <Signin />,
  },
  {
    path: "/account/register",
    element: <Signup />,
  },
  {
    path: "/playground/placement",
    element: <PlacementPlayground />,
  },
  {
    path: "/playground/arrows",
    element: <ArrowsPlayground />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <div className="w-full h-full">
    <RouterProvider router={router} />
    <Analytics />
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
