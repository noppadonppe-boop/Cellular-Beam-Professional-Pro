import { create } from "zustand";

export type NotificationTone = "info" | "success" | "warning" | "error";
export type Notification = { id: string; title: string; message: string; tone: NotificationTone };
type NotificationState = {
  notifications: Notification[];
  notify: (notification: Omit<Notification, "id">) => void;
  dismiss: (id: string) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  notify: (notification) => set((state) => ({ notifications: [...state.notifications, { ...notification, id: crypto.randomUUID() }] })),
  dismiss: (id) => set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) })),
}));
