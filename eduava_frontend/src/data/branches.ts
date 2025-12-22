import { Branch } from "@/types";

export const branches: Branch[] = [
  {
    id: "cse",
    name: "Computer Science",
    slug: "cse",
    icon: "💻",
    description: "Computer Science & Engineering notes covering programming, databases, networks, and more."
  },
  {
    id: "ece",
    name: "Electronics & Communication",
    slug: "ece",
    icon: "📡",
    description: "ECE notes on circuits, signals, communication systems, and electronics."
  },
  {
    id: "me",
    name: "Mechanical Engineering",
    slug: "me",
    icon: "⚙️",
    description: "Mechanical Engineering notes on thermodynamics, mechanics, and manufacturing."
  },
  {
    id: "ee",
    name: "Electrical Engineering",
    slug: "ee",
    icon: "⚡",
    description: "Electrical Engineering notes on power systems, machines, and control."
  },
  {
    id: "ce",
    name: "Civil Engineering",
    slug: "ce",
    icon: "🏗️",
    description: "Civil Engineering notes on structures, surveying, and construction."
  },
  {
    id: "it",
    name: "Information Technology",
    slug: "it",
    icon: "🌐",
    description: "IT notes covering software development, web technologies, and systems."
  }
];

export const getBranchBySlug = (slug: string): Branch | undefined => {
  return branches.find(branch => branch.slug === slug);
};
