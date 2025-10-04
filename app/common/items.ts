export enum ItemStatus {
  Draft = 0,
  Published = 1,
  Archived = 2
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

export interface BaseItem {
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

export interface HomeItem extends BaseItem {
  // Add any Home-specific properties here
}

export interface BrowseItem extends BaseItem {
  // Add any Browse-specific properties here
}

export interface Questions {
  id: number;
  name: string;
  title: string | null;
  type: string;
  html: string | null;
  accept: string | null;
  items: { 
    name: string; 
    title: string 
  }[];
  colCount: number | null;
  columns: {
    name: string;
    title: string;
    choices: { 
      value: string; 
      text: string 
    }[];
    isRequired: boolean;
  }[]; 
  choices: { 
    value: string; 
    text: string 
  }[];
  rateValues: { value: string; text: string }[];
  status: ItemStatus;
  acceptType: AcceptType;
}
