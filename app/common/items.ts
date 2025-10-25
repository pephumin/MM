export enum ItemStatus {
  Draft = 0,
  Published = 1,
  Archived = 2
}

export enum QuestionType {
  A = "rating",
  B = "radiogroup",
  C = "checkbox",
  D = "comment",
  E = "multipletext",
  F = "matrixdropdown",
  G = "text",
  H = "html",
  I = "radiogrouphtml",
  J = "checkboxhtml",
  K = "dropdown"
}

export enum PrivacyLevel {
  Public = 0,
  Private = 1
}

export enum AcceptType {
  OE = "Open-ended",
  SA = "Single answer",
  MA = "Multiple answer"
}

export interface HomeItem {
  id: number;
  title: string;
  description: string | null;
  status: ItemStatus;
  created: Date;
  updated: Date;
  userId: number;
  cookieId: number;
  isPrivate: PrivacyLevel;
  userEmail: string;
  userFullName: string;
  companyId: number;
  companyName: string;
  accessLevel: number;
  rD: boolean;
}

export interface BrowseItem {
  id: number;
  title: string;
  description: string | null;
  status: ItemStatus;
  created: Date;
  updated: Date;
  userId: number;
  cookieId: number;
  isPrivate: PrivacyLevel;
  userEmail: string;
  userFullName: string;
  companyId: number;
  companyName: string;
  accessLevel: number;
  rD: boolean;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string | null;
  status: ItemStatus;
  created: Date;
  updated: Date;
  userId: number;
  cookieId: number;
  isPrivate: PrivacyLevel;
  userEmail: string;
  userFullName: string;
  companyId: number;
  companyName: string;
  accessLevel: number;
  rD: boolean;
}

export interface Questions {
  id: number;
  name: string;
  title?: string | null;
  type?: string | null;
  html?: string | null;
  status?: ItemStatus;
  accept?: string | AcceptType | null;
  items?: { 
    name: string; 
    title: string; 
  }[] | null;
  colCount?: number | null;
  // columns may have varying shapes in the JSON; allow any[] for flexibility
  columns?: any[] | null;
  choices?: { 
    value: string; 
    text: string 
  }[] | null;
  rateValues?: { value: string; text: string }[] | null;
}
