import { X } from "lucide-react";
import { useNotificationStore } from "@/stores/notification-store";

export function ToastViewport() {
  const notifications = useNotificationStore((state) => state.notifications);
  const dismiss = useNotificationStore((state) => state.dismiss);
  return <div className="toast-viewport" aria-live="polite">{notifications.map((item) => <article className={`toast toast-${item.tone}`} key={item.id}><div><strong>{item.title}</strong><p>{item.message}</p></div><button onClick={() => dismiss(item.id)} aria-label="Dismiss notification"><X size={15} /></button></article>)}</div>;
}
