import manifest from "@/data/notes-manifest.json";

type Note = {
  label: string;
  r2Path: string;
  type: "unit" | "quantum" | "all";
  unitNumber?: number;
};

export function getSubjectsByBranch(branch: string) {
  const subjects = new Set<string>();

  Object.keys(manifest).forEach(path => {
    if (path.startsWith(branch + "/")) {
      const parts = path.split("/");
      subjects.add(parts[1]); // subject slug
    }
  });

  return Array.from(subjects).map(slug => ({
    slug,
    name: slug.replace(/-/g, " "),
  }));
}

export function getNotesForSubject(branch: string, subject: string): Note[] {
  return Object.keys(manifest)
    .filter(path => path.startsWith(`${branch}/${subject}/`))
    .map(path => {
      const parts = path.split("/");
      const unitFolder = parts[2]; // unit-1, quantum, all-units

      // 🔥 TYPE DETECTION
      let type: Note["type"] = "unit";
      let unitNumber: number | undefined;

      if (unitFolder.startsWith("unit-")) {
        type = "unit";
        const num = unitFolder.replace("unit-", "").split("&")[0];
        unitNumber = Number(num);
      } else if (unitFolder.includes("quantum")) {
        type = "quantum";
      } else {
        type = "all";
      }

      return {
        label: unitFolder.replace(/-/g, " ").toUpperCase(),
        r2Path: path,
        type,
        unitNumber,
      };
    });
}
