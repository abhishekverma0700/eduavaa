import notesManifest from "./notes-manifest.json";

type Subject = {
  slug: string;
  name: string;
  branch: string;
};

const manifest = notesManifest as Record<string, boolean>;

/**
 * Extract subjects automatically from manifest
 */
export const getSubjectsByBranch = (branchSlug: string): Subject[] => {
  const subjectsMap = new Map<string, Subject>();

  Object.keys(manifest).forEach((path) => {
    // example: cse/artificial-intelligence/unit-1/file.pdf
    if (!path.startsWith(branchSlug + "/")) return;

    const parts = path.split("/");
    const subjectSlug = parts[1];

    if (!subjectsMap.has(subjectSlug)) {
      subjectsMap.set(subjectSlug, {
        slug: subjectSlug,
        name: subjectSlug.replace(/-/g, " "),
        branch: branchSlug,
      });
    }
  });

  return Array.from(subjectsMap.values());
};

/**
 * Kept only for compatibility with old imports
 * SubjectPage no longer uses this
 */
export const getSubjectBySlug = () => undefined;
