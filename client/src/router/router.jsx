import { createBrowserRouter } from "react-router-dom";
import ChatUi from "../components/ChatUi";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatUi />,
  },
]);
