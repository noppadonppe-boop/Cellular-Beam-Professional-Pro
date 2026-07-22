import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/states/LoadingState";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";
import { NotFoundPage } from "@/features/system/pages/NotFoundPage";

const CriteriaPage = lazy(() => import("@/features/criteria/pages/CriteriaPage"));
const GeometryPage = lazy(() => import("@/features/geometry/pages/GeometryPage"));
const LoadsPage = lazy(() => import("@/features/loads/pages/LoadsPage"));
const AnalysisPage = lazy(() => import("@/features/analysis/pages/AnalysisPage"));
const DesignPage = lazy(() => import("@/features/design/pages/DesignPage"));
const ReportPage = lazy(() => import("@/features/reports/pages/ReportPage"));
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage"));
const VerificationPage = lazy(() => import("@/features/verification/pages/VerificationPage"));
const SectionsPage = lazy(() => import("@/features/sections/pages/SectionsPage"));
const ProjectSettingsPage = lazy(() => import("@/features/project-settings/pages/ProjectSettingsPage"));
const ManualPage = lazy(() => import("@/features/manual/pages/ManualPage"));

const deferred = (element: React.ReactNode) => <Suspense fallback={<LoadingState />}>{element}</Suspense>;

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    element: <AppShell />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/sections", element: deferred(<SectionsPage />) },
      { path: "/projects/:projectId/criteria", element: deferred(<CriteriaPage />) },
      { path: "/projects/:projectId/settings", element: deferred(<ProjectSettingsPage />) },
      { path: "/projects/:projectId/geometry", element: deferred(<GeometryPage />) },
      { path: "/projects/:projectId/loads", element: deferred(<LoadsPage />) },
      { path: "/projects/:projectId/analysis", element: deferred(<AnalysisPage />) },
      { path: "/projects/:projectId/design", element: deferred(<DesignPage />) },
      { path: "/projects/:projectId/report", element: deferred(<ReportPage />) },
      { path: "/settings", element: deferred(<SettingsPage />) },
      { path: "/verification", element: deferred(<VerificationPage />) },
      { path: "/manual", element: deferred(<ManualPage />) },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
