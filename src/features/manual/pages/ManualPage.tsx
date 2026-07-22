import { ArrowRight, BookOpen, CircleAlert, FileCheck2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

type ManualStep = {
  number: string;
  title: string;
  description: string;
  route: string;
  action: string;
  note?: string;
};

const steps: ManualStep[] = [
  {
    number: "01",
    title: "Create or select a project",
    description:
      "Open Projects to start a project workspace. Project persistence requires Firebase authentication and access rules to be configured.",
    route: "/projects",
    action: "Open Projects",
    note: "Project creation is not yet connected to a production Firestore workflow.",
  },
  {
    number: "02",
    title: "Set project context",
    description:
      "Open Project Settings and record the project identity, revision context, units, and responsible review process before relying on any output.",
    route: "/projects/demo/settings",
    action: "Project Settings",
  },
  {
    number: "03",
    title: "Define criteria",
    description:
      "Record the intended design context. The current application does not select or verify a design-code edition, clauses, or resistance factors.",
    route: "/projects/demo/criteria",
    action: "Define Criteria",
    note: "Do not interpret screening output as a code-compliant design check.",
  },
  {
    number: "04",
    title: "Create cellular geometry",
    description:
      "Enter the parent section and opening geometry. Review dimensions, opening spacing, end zones, and the generated geometry summary.",
    route: "/projects/demo/geometry",
    action: "Build Geometry",
    note: "Asymmetric sections, stiffeners, camber, reinforcement, exclusion zones, and fabrication detailing are outside the current generator.",
  },
  {
    number: "05",
    title: "Select materials and sections",
    description:
      "Use Material Verification to review benchmarks, then choose or define an I-section. Check source, revision, and verification status for every selected record.",
    route: "/sections",
    action: "Select Section",
    note: "Use only verified or appropriately reviewed user-provided data for engineering work.",
  },
  {
    number: "06",
    title: "Define straight-beam loads",
    description:
      "Enter supported straight-beam load cases and review their source. Self-weight, UDL, and point-load workflows are available in the current analysis foundation.",
    route: "/projects/demo/loads",
    action: "Set Loads",
    note: "A dedicated load-combination workflow is not yet implemented.",
  },
  {
    number: "07",
    title: "Run and inspect analysis",
    description:
      "Review the elastic 2D FEM response, reactions, member actions, shear, moment, rotation, and deflection diagrams. Confirm modelling assumptions independently.",
    route: "/projects/demo/analysis",
    action: "Review Analysis",
    note: "The engine is linear elastic; nonlinear and stability effects are not included.",
  },
  {
    number: "08",
    title: "Review design screening",
    description:
      "Review gross-section member screening plus extracted cellular, weld, stiffener, and concentrated-load actions. Treat these as calculation-support evidence only.",
    route: "/projects/demo/design",
    action: "Open Screening",
    note: "Cellular, weld, local web, Vierendeel, and code-capacity PASS/FAIL checks are not yet provided.",
  },
  {
    number: "09",
    title: "Verify before issuing",
    description:
      "Open Verification to inspect calculation benchmarks and unit-conversion checks. Resolve any pending verification or review item before issuing documents.",
    route: "/verification",
    action: "Verify Evidence",
  },
  {
    number: "10",
    title: "Download the draft report",
    description:
      "Create the available PDF calculation snapshot only after the engineer has reviewed the inputs, assumptions, and supporting evidence.",
    route: "/projects/demo/report",
    action: "Open Report",
    note: "The PDF is DRAFT / FOR REVIEW, not an approved calculation report or fabrication document.",
  },
];

const availability = [
  [
    "Units, quantities, I-sections",
    "Available",
    "Canonical SI values, conversion, formatting, and I-section properties.",
  ],
  [
    "Cellular geometry",
    "Available",
    "Deterministic circular opening geometry within documented limits.",
  ],
  [
    "Straight and continuous beam analysis",
    "Available",
    "Linear elastic calculation support; review model assumptions.",
  ],
  [
    "Arch, composite, optimization",
    "Screening only",
    "Reference values and supplied-candidate ranking; not capacity design.",
  ],
  [
    "Design-code capacity checks",
    "Not available",
    "No verified code edition, clauses, applicability, or resistance factors.",
  ],
  [
    "Fabrication drawings / approved report",
    "Not available",
    "Draft PDF snapshot is available for engineering review only.",
  ],
] as const;

export default function ManualPage() {
  return (
    <div className="page manual-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">USER GUIDE · REVIEW BEFORE USE</span>
          <h1>คู่มือการใช้งาน / Manual</h1>
          <p>ลำดับการทำงานที่ตรงกับโมดูลปัจจุบัน พร้อมขอบเขตที่ต้องให้วิศวกรตรวจทาน</p>
        </div>
      </header>

      <section className="manual-intro">
        <BookOpen size={24} />
        <div>
          <h2>เริ่มจากข้อมูลที่ตรวจสอบได้</h2>
          <p>
            ระบบนี้ช่วยจัดระเบียบข้อมูลและการคำนวณเชิงเส้น ไม่ได้แทนการออกแบบ รับรอง
            หรืออนุมัติงานก่อสร้างโดยวิศวกรผู้มีใบอนุญาต
          </p>
        </div>
      </section>

      <section className="manual-warning" aria-label="Engineering responsibility notice">
        <CircleAlert size={19} />
        <p>
          <strong>สำคัญ:</strong> ห้ามใช้ค่าหน้า Dashboard ที่ระบุว่า Demonstration
          เป็นผลการออกแบบจริง และห้ามใช้ผล screening เป็น PASS/FAIL
          ตามมาตรฐานจนกว่าจะเลือกและตรวจสอบมาตรฐาน สมมติฐาน และสมการที่เกี่ยวข้อง
        </p>
      </section>

      <section className="manual-section" aria-labelledby="workflow-title">
        <div className="manual-section-heading">
          <div>
            <span className="eyebrow">RECOMMENDED WORKFLOW</span>
            <h2 id="workflow-title">ทำงานตามลำดับนี้</h2>
          </div>
          <span>10 steps</span>
        </div>
        <ol className="manual-steps">
          {steps.map((step) => (
            <li key={step.number}>
              <span className="manual-step-number">{step.number}</span>
              <div className="manual-step-copy">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {step.note && <p className="manual-step-note">Limit: {step.note}</p>}
              </div>
              <Link to={step.route} className="manual-step-link">
                {step.action}
                <ArrowRight size={14} />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="manual-section" aria-labelledby="availability-title">
        <div className="manual-section-heading">
          <div>
            <span className="eyebrow">CURRENT CAPABILITY</span>
            <h2 id="availability-title">สิ่งที่ระบบทำได้ในปัจจุบัน</h2>
          </div>
          <ShieldCheck size={19} />
        </div>
        <div className="manual-availability">
          {availability.map(([module, status, detail]) => (
            <article key={module}>
              <div>
                <h3>{module}</h3>
                <span className={status === "Available" ? "available" : "limited"}>{status}</span>
              </div>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="manual-review">
        <FileCheck2 size={21} />
        <div>
          <h2>ก่อนนำผลไปใช้งาน</h2>
          <p>
            ตรวจแหล่งที่มาและ revision ของข้อมูล, หน่วย, boundary conditions, load cases, ผล
            benchmark และข้อจำกัดของโมดูล
            จากนั้นให้วิศวกรผู้รับผิดชอบตรวจทานและรับรองตามกฎหมาย/มาตรฐานที่ใช้กับโครงการ
          </p>
        </div>
        <Link to="/verification" className="button">
          Open Verification
        </Link>
      </section>
    </div>
  );
}
