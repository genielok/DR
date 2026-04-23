import { createBrowserRouter } from "react-router";
import { PanelLayout } from "./components/PanelLayout";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectMapPage from "./pages/ProjectMapPage";
import SensorDetailPage from "./pages/SensorDetailPage";
import DataImport from "./pages/DataImport";

const NullPage = () => null;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PanelLayout,
    children: [
      { index: true, Component: NullPage },
      { path: "ecosystem-extent", Component: NullPage },
      { path: "ecosystem-condition", Component: NullPage },
      { path: "species-extinction-risk", Component: NullPage },
      { path: "species-populations", Component: NullPage },
      {
        path: "projects/:id",
        Component: ProjectDetail,
      },
      {
        path: "projects/:id/map",
        Component: ProjectMapPage,
      },
      {
        path: "projects/:projectId/sensors/:sensorId",
        Component: SensorDetailPage,
      },
      {
        path: "projects/:projectId/import",
        Component: DataImport,
      },
    ],
  },
]);
