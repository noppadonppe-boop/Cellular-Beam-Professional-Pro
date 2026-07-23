/**
 * Shared Firestore location for this installation.  Every menu stores its
 * documents below this one root document; data is deliberately not scoped by
 * user ID or anonymous session.
 */
export const FIRESTORE_ROOT_COLLECTION = "Cellular Beam Professional Pro";
export const FIRESTORE_ROOT_DOCUMENT = "root";

export const firestoreMenuCollectionPath = (menu: string) =>
  [FIRESTORE_ROOT_COLLECTION, FIRESTORE_ROOT_DOCUMENT, menu] as const;
