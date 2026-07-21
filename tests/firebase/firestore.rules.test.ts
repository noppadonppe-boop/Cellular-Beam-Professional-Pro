import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";

let environment: RulesTestEnvironment;

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-no-project",
    firestore: { rules: readFileSync(resolve("firestore.rules"), "utf8") },
    storage: { rules: readFileSync(resolve("storage.rules"), "utf8") },
  });
});
beforeEach(async () => {
  await environment.clearFirestore();
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "projects", "p1"), { organizationId: "o1", createdBy: "admin" });
    await setDoc(doc(db, "projectMembers", "p1_viewer"), {
      projectId: "p1",
      userId: "viewer",
      role: "viewer",
    });
    await setDoc(doc(db, "projectMembers", "p1_designer"), {
      projectId: "p1",
      userId: "designer",
      role: "designer",
    });
  });
});
afterAll(async () => {
  await environment.cleanup();
});

describe("Firestore project authorization", () => {
  it("denies anonymous project reads", async () => {
    await assertFails(
      getDoc(doc(environment.unauthenticatedContext().firestore(), "projects", "p1")),
    );
  });
  it("allows project members to read", async () => {
    await assertSucceeds(
      getDoc(doc(environment.authenticatedContext("viewer").firestore(), "projects", "p1")),
    );
  });
  it("denies viewer settings writes", async () => {
    await assertFails(
      setDoc(doc(environment.authenticatedContext("viewer").firestore(), "projectSettings", "p1"), {
        projectId: "p1",
      }),
    );
  });
  it("allows designer settings writes", async () => {
    await assertSucceeds(
      setDoc(
        doc(environment.authenticatedContext("designer").firestore(), "projectSettings", "p1"),
        { projectId: "p1" },
      ),
    );
  });
  it("prevents clients from assigning project membership", async () => {
    await assertFails(
      setDoc(
        doc(
          environment.authenticatedContext("designer").firestore(),
          "projectMembers",
          "p1_attacker",
        ),
        { projectId: "p1", userId: "attacker", role: "projectAdmin" },
      ),
    );
  });
  it("denies viewer project uploads", async () => {
    await assertFails(
      uploadString(
        ref(environment.authenticatedContext("viewer").storage(), "projects/p1/model.json"),
        "{}",
      ),
    );
  });
  it("allows designer project uploads", async () => {
    await assertSucceeds(
      uploadString(
        ref(environment.authenticatedContext("designer").storage(), "projects/p1/model.json"),
        "{}",
      ),
    );
  });
});
