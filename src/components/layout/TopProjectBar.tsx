import { Bell, Languages, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translate } from "@/lib/i18n";
import { useAppStore } from "@/stores/app-store";
import { useNotificationStore } from "@/stores/notification-store";

export function TopProjectBar() {
  const { locale, setLocale, theme, toggleTheme, setSidebarOpen } = useAppStore();
  const notify = useNotificationStore((state) => state.notify);
  return <header className="topbar"><Button variant="ghost" size="icon" className="menu-trigger" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={19} /></Button><div className="project-context"><span className="project-monogram">CB</span><div><strong>{translate(locale, "noProject")}</strong><small>Project Foundation · Phase 1</small></div></div><div className="topbar-actions"><Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle color theme">{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</Button><Button variant="outline" size="sm" onClick={() => setLocale(locale === "th" ? "en" : "th")}><Languages size={15} />{locale.toUpperCase()}</Button><Button variant="ghost" size="icon" onClick={() => notify({ tone: "info", title: "Notifications", message: locale === "th" ? "ยังไม่มีการแจ้งเตือนใหม่" : "There are no new notifications." })} aria-label="Open notifications"><Bell size={17} /></Button><span className="avatar">PE</span></div></header>;
}
