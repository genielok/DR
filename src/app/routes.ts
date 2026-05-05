import { createHashRouter } from "react-router";
import { AppLayout } from "./components/AppLayout";
import ProjectDetail from "./pages/ProjectDetail";
import DataImport from "./pages/DataImport";

export const router = createHashRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        path: "projects/:id",
        Component: ProjectDetail,
      },
      {
        path: "projects/:projectId/import",
        Component: DataImport,
      },
    ],
  },
]);
