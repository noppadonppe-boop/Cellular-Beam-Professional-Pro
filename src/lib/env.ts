import { z } from "zod";

const firebaseEnvSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
});

export const firebaseEnvResult = firebaseEnvSchema.safeParse(import.meta.env);

export type FirebaseEnvironment = z.infer<typeof firebaseEnvSchema>;

export function getFirebaseEnvironment(): FirebaseEnvironment | null {
  return firebaseEnvResult.success ? firebaseEnvResult.data : null;
}
