import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Auth, User } from "firebase/auth";
import { firebaseEnvResult } from "@/lib/env";

type AuthStatus = "loading" | "authenticated" | "anonymous" | "unavailable";
type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  signInEmail: (email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authRef = useRef<Auth | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(
    firebaseEnvResult.success ? "loading" : "unavailable",
  );
  useEffect(() => {
    if (!firebaseEnvResult.success) return undefined;
    let unsubscribe: (() => void) | undefined;
    let active = true;
    void Promise.all([import("@/lib/firebase"), import("firebase/auth")]).then(
      ([{ initializeFirebase }, { onAuthStateChanged, signInAnonymously }]) => {
        if (!active) return;
        const firebase = initializeFirebase();
        if (!firebase) {
          setStatus("unavailable");
          return;
        }
        authRef.current = firebase.auth;
        unsubscribe = onAuthStateChanged(firebase.auth, (next) => {
          setUser(next);
          setStatus(next ? "authenticated" : "anonymous");
        });
        // All visitors work in the shared root document. Anonymous auth gives
        // Firestore a valid request identity without creating per-user folders.
        if (!firebase.auth.currentUser) {
          void signInAnonymously(firebase.auth).catch((error: unknown) => {
            console.error("Anonymous Firebase sign-in failed", error);
            setStatus("anonymous");
          });
        }
      },
    );
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);
  const requireAuth = (): Auth => {
    if (!authRef.current) throw new Error("Firebase Authentication is not ready.");
    return authRef.current;
  };
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      signInEmail: async (email, password) => {
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        await signInWithEmailAndPassword(requireAuth(), email, password);
      },
      signInGoogle: async () => {
        const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
        await signInWithPopup(requireAuth(), new GoogleAuthProvider());
      },
      signOutUser: async () => {
        const { signOut } = await import("firebase/auth");
        if (authRef.current) await signOut(authRef.current);
      },
    }),
    [status, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
