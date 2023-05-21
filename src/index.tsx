import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Editor from "./modules/editor/Editor";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import PlacementPlayground from "modules/playground/placement/PlacementPlayground";
import ArrowsPlayground from "modules/playground/arrows/ArrowsPlayground";
import { Analytics } from "@vercel/analytics/react";
import { Signin, Signup } from "modules/account/Account";
import ScreenshotPlayground from "modules/playground/screenshots/ScreenshotPlayground";
import Dashboard from "modules/dashboard/Dashboard";
import { getUser } from "modules/core/project-utils";
import {
  fetchAllBoardsQuery,
  getBoardQuery,
  getDraftQuery,
  getDocumentVersionsQuery,
  fetchAllDocumentsQuery,
} from "modules/core/network-utils";
import DocumentVersions from "modules/editor/DocumentVersions";
import WriterPage from "modules/writer/WriterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    loader: async () => {
      const user = getUser();
      if (!user) return redirect("/account/register?then=/");

      const boards = await fetchAllBoardsQuery();
      const documents = await fetchAllDocumentsQuery();
      console.log("outer docks", documents, documents.data);
      return { user, boards: boards.data, documents: documents.data };
    },
  },
  {
    path: "/boards/:boardId",
    element: <Editor />,
    loader: async ({ params }) => {
      const user = getUser();
      if (!user)
        return redirect(`/account/register?then=/boards/${params.boardId}`);

      const board = await getBoardQuery(params.boardId || "");
      return { user, board: board.data };
    },
    children: [
      {
        path: "/boards/:boardId/versions/:documentId",
        element: <DocumentVersions />,
        loader: async ({ params }) => {
          const documents = await getDocumentVersionsQuery(
            params.documentId || ""
          );
          return { documents };
        },
      },
    ],
  },
  {
    path: "/drafts/:docId",
    element: <WriterPage />,
    loader: async ({ params }) => {
      const user = getUser();
      if (!user)
        return redirect(`/account/register?then=/drafts/${params.docId}`);

      const draft = await getDraftQuery(params.docId || "");
      return { user, draft: draft.data };
    },
  },
  {
    path: "/account/login",
    element: <Signin />,
  },
  {
    path: "/account/register",
    element: <Signup />,
  },
  // {
  //   path: "/playground/placement",
  //   element: <PlacementPlayground />,
  // },
  // {
  //   path: "/playground/arrows",
  //   element: <ArrowsPlayground />,
  // },
  // {
  //   path: "/playground/screenshot",
  //   element: <ScreenshotPlayground />,
  // },
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
