import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { firebaseEnvResult } from "@/lib/env";
import { useNotificationStore } from "@/stores/notification-store";
import { useAuth } from "@/features/auth/AuthProvider";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});
type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const notify = useNotificationStore((state) => state.notify);
  const { signInEmail, signInGoogle, status } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const onSubmit = async (values: LoginValues) => {
    try {
      await signInEmail(values.email, values.password);
      void navigate("/dashboard");
    } catch (error) {
      notify({
        tone: "error",
        title: "Sign-in failed",
        message: error instanceof Error ? error.message : "Unable to sign in.",
      });
    }
  };
  const onGoogle = async () => {
    try {
      await signInGoogle();
      void navigate("/dashboard");
    } catch (error) {
      notify({
        tone: "error",
        title: "Google sign-in failed",
        message: error instanceof Error ? error.message : "Unable to sign in.",
      });
    }
  };
  return (
    <main className="login-page">
      <section className="login-brand">
        <div className="login-copy">
          <span className="login-kicker">STRUCTURAL ENGINEERING PLATFORM</span>
          <h1>
            Cellular Beam
            <br />
            Professional
          </h1>
          <p>
            Project foundation for traceable analysis, verified design checks, and professional
            calculation reports.
          </p>
          <div className="phase-note">
            <LockKeyhole size={18} />
            <span>
              Phase 3 adds Firebase authentication and role-based security. Engineering calculations
              are not included.
            </span>
          </div>
        </div>
      </section>
      <section className="login-panel">
        <form
          className="login-card"
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event);
          }}
        >
          <div className="brand-login">
            <span>CB</span>
            <strong>Sign in</strong>
          </div>
          <p>เข้าสู่ระบบเพื่อจัดการโครงการของคุณ</p>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              placeholder="engineer@company.com"
            />
            {errors.email && <small>{errors.email.message}</small>}
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              {...register("password")}
              placeholder="••••••••"
            />
            {errors.password && <small>{errors.password.message}</small>}
          </label>
          <Button type="submit" disabled={isSubmitting}>
            Continue
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={status === "unavailable"}
            onClick={() => {
              void onGoogle();
            }}
          >
            Continue with Google
          </Button>
          {!firebaseEnvResult.success && (
            <div className="env-warning">
              Firebase is not configured. Copy <code>.env.example</code> to <code>.env.local</code>.
            </div>
          )}
          <Link to="/dashboard">Continue to foundation preview →</Link>
        </form>
      </section>
    </main>
  );
}
