import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { ToastViewport } from "@/components/feedback/ToastViewport";
import { router } from "@/app/router";
import { useAppStore } from "@/stores/app-store";
import { AuthProvider } from "@/features/auth/AuthProvider";

export function App() {
  const theme = useAppStore((state) => state.theme);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  return (
    <ErrorBoundary>
      <AuthProvider><RouterProvider router={router} /></AuthProvider>
      <ToastViewport />
    </ErrorBoundary>
  );
}
