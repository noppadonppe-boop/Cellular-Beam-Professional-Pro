import { ChevronDown, Diamond, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { useNotificationStore } from "@/stores/notification-store";

export function TopProjectBar() {
  const { locale, setLocale, setSidebarOpen } = useAppStore();
  const notify = useNotificationStore((state) => state.notify);
  return (
    <header className="topbar">
      <Button
        variant="ghost"
        size="icon"
        className="menu-trigger"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={19} />
      </Button>
      <div className="project-context">
        <span className="project-monogram">CB</span>
        <div>
          <strong>CB-24018 · Warehouse Roof Beam</strong>
          <small>Bang Na Logistics Center</small>
        </div>
      </div>
      <div className="topbar-actions">
        <span className="saved-state">
          <i /> Saved
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocale(locale === "th" ? "en" : "th")}
        >
          {locale.toUpperCase()}
          <ChevronDown size={12} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            notify({
              tone: "info",
              title: "Notifications",
              message:
                locale === "th" ? "ยังไม่มีการแจ้งเตือนใหม่" : "There are no new notifications.",
            })
          }
          aria-label="Open notifications"
        >
          <Diamond size={15} />
        </Button>
        <span className="notification-dot" />
        <span className="avatar">SK</span>
      </div>
    </header>
  );
}
