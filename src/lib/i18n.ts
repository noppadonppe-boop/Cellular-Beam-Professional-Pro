export type Locale = "th" | "en";

export const messages = {
  en: {
    appName: "Cellular Beam Professional", dashboard: "Dashboard", projects: "Projects",
    criteria: "Design Criteria", geometry: "Geometry", loads: "Loads", analysis: "Analysis",
    design: "Design", report: "Report", settings: "Settings", verification: "Verification",
    noProject: "No project selected", phaseOne: "Project foundation is ready",
  },
  th: {
    appName: "Cellular Beam Professional", dashboard: "แดชบอร์ด", projects: "โครงการ",
    criteria: "เกณฑ์การออกแบบ", geometry: "เรขาคณิต", loads: "น้ำหนักบรรทุก", analysis: "การวิเคราะห์",
    design: "การออกแบบ", report: "รายงาน", settings: "การตั้งค่า", verification: "การตรวจสอบความถูกต้อง",
    noProject: "ยังไม่ได้เลือกโครงการ", phaseOne: "โครงสร้างพื้นฐานโครงการพร้อมใช้งาน",
  },
} as const;

export function translate(locale: Locale, key: keyof (typeof messages)["en"]): string { return messages[locale][key]; }
