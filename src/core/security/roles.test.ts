import { describe, expect, it } from "vitest";
import { hasProjectPermission } from "@/core/security/roles";

describe("project role permissions", () => {
  it("allows designers to edit models but not approve", () => {
    expect(hasProjectPermission("designer", "editModel")).toBe(true);
    expect(hasProjectPermission("designer", "approve")).toBe(false);
  });
  it("allows checkers to review but not edit models", () => {
    expect(hasProjectPermission("checker", "review")).toBe(true);
    expect(hasProjectPermission("checker", "editModel")).toBe(false);
  });
  it("allows approvers to approve but not manage members", () => {
    expect(hasProjectPermission("approver", "approve")).toBe(true);
    expect(hasProjectPermission("approver", "manageMembers")).toBe(false);
  });
  it("keeps viewers read-only", () => {
    expect(hasProjectPermission("viewer", "read")).toBe(true);
    expect(hasProjectPermission("viewer", "editModel")).toBe(false);
  });
});
