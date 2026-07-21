import type { SectionRecord } from "@/core/sections/models";

export type SectionQuery = Readonly<{
  verificationStatus?: SectionRecord["provenance"]["verificationStatus"];
  search?: string;
}>;

export type SectionRepository = {
  getById: (id: string) => Promise<SectionRecord | null>;
  list: (query?: SectionQuery) => Promise<readonly SectionRecord[]>;
  save: (section: SectionRecord) => Promise<void>;
};
