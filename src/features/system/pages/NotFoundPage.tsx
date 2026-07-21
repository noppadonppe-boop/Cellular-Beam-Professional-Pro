import { EmptyState } from "@/components/states/EmptyState";
import { SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
export function NotFoundPage() { const navigate = useNavigate(); return <div className="page"><div className="content-card"><EmptyState title="Page not found" description="The requested application route does not exist." actionLabel="Back to dashboard" onAction={() => { void navigate("/dashboard"); }} icon={SearchX} /></div></div>; }
