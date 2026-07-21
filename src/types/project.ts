export type ProjectStatus = "draft" | "inReview" | "approved" | "superseded";

export type ProjectSummary = {
  id: string;
  organizationId: string;
  name: string;
  number: string;
  status: ProjectStatus;
  createdAtIso: string;
  updatedAtIso: string;
};
