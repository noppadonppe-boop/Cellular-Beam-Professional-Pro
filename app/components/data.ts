export const navGroups = [
  { label: "Workspace", items: [["▦", "Dashboard"], ["▣", "Projects"], ["◇", "Design Criteria"]] },
  { label: "Model", items: [["⌁", "Geometry"], ["▤", "Materials"], ["▥", "Sections"], ["⌂", "Supports"], ["↓", "Loads"], ["∑", "Load Combinations"]] },
  { label: "Results", items: [["∿", "Analysis"], ["✓", "Design Checks"], ["↗", "Optimization"], ["⌑", "Drawings"], ["▧", "Report"]] },
];

export const checks = [
  { check: "Global bending resistance", location: "x = 6.00 m", ref: "Member", combo: "ULS-01", demand: "412.6 kN·m", capacity: "526.4 kN·m", ratio: 0.784, status: "PASS", clause: "AISC 360-22 F2" },
  { check: "Global shear resistance", location: "x = 0.42 m", ref: "Web", combo: "ULS-01", demand: "168.2 kN", capacity: "312.8 kN", ratio: 0.538, status: "PASS", clause: "AISC 360-22 G2" },
  { check: "Opening shear", location: "x = 1.20 m", ref: "O-02", combo: "ULS-01", demand: "141.7 kN", capacity: "172.1 kN", ratio: 0.823, status: "WARNING", clause: "Framework only" },
  { check: "Vierendeel mechanism", location: "x = 5.40 m", ref: "O-09", combo: "ULS-01", demand: "—", capacity: "—", ratio: null, status: "NOT IMPLEMENTED", clause: "Pending verification" },
];

export const steps = ["Project", "Criteria", "Geometry", "Section", "Supports", "Loads", "Analysis", "Design", "Review", "Report"];
