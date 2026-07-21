import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };
  public static getDerivedStateFromError(): State { return { hasError: true }; }
  public componentDidCatch(error: Error, info: ErrorInfo) { console.error("Unhandled application error", error, info); }
  public render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="state-page"><div className="state-card"><span className="state-icon state-icon-error">!</span><h1>Application error</h1><p>เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาโหลดหน้าใหม่อีกครั้ง</p><Button onClick={() => window.location.reload()}>Reload application</Button></div></main>;
  }
}
