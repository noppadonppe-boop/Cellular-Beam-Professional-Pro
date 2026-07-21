import { Download, FileText, ShieldAlert } from "lucide-react";
export default function ReportPage() {
  return (
    <div className="page report-page"><header className="page-header"><div><span className="eyebrow">CALCULATION REPORT · PHASE 15</span><h1>Professional PDF Report</h1><p>Draft calculation snapshot with evidence and engineering limitations.</p></div></header><section className="foundation-banner"><FileText size={24}/><div><h2>Phase 15 report package</h2><p>The report includes metadata, module evidence, warnings, page numbers, and professional responsibility statement.</p></div><a className="button report-download" href="/reports/cellular-beam-professional-phase15-report.pdf" download><Download size={15}/>Download PDF</a></section><section className="design-notice"><ShieldAlert size={18}/><p><strong>DRAFT / FOR REVIEW.</strong> This report is a calculation-support snapshot. Results must be checked and certified by a legally licensed engineer before construction use.</p></section></div>
  );
}
