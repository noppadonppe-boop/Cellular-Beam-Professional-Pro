export const organizationRoles = [
  "organizationAdmin",
  "projectAdmin",
  "designer",
  "checker",
  "approver",
  "viewer",
] as const;
export type OrganizationRole = (typeof organizationRoles)[number];
export type ProjectRole = Exclude<OrganizationRole, "organizationAdmin">;
export type ProjectPermission =
  "read" | "editModel" | "review" | "approve" | "manageMembers" | "deleteProject";

const permissionMatrix: Readonly<Record<ProjectRole, readonly ProjectPermission[]>> = {
  projectAdmin: ["read", "editModel", "review", "approve", "manageMembers", "deleteProject"],
  designer: ["read", "editModel"],
  checker: ["read", "review"],
  approver: ["read", "approve"],
  viewer: ["read"],
};

export function hasProjectPermission(role: ProjectRole, permission: ProjectPermission): boolean {
  return permissionMatrix[role].includes(permission);
}
