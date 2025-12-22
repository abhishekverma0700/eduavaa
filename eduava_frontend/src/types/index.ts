export type Branch = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
};

export type NoteType = 'unit' | 'quantum' | 'all';

export type Note = {
  id: string;
  type: NoteType;
  label: string;
  price: number;
  r2Path: string;
  unitNumber?: number;
  isAvailable: boolean;
};

export type Subject = {
  id: string;
  branch: string;
  name: string;
  slug: string;
  semester: number;
  description: string;
  notes: Note[];
};

export type NotesManifest = {
  [key: string]: boolean;
};
