export interface MegateamModel {
  id: number,
  name: string,
  description?: string,
}

export interface AreaModel {
  id: number,
  megateam: MegateamModel,
  name: string,
  location: string,
}

export interface TeamModel {
  id: number,
  name: string,
  area?: AreaModel,
}

export enum UserRole {
  hacker = "hacker",
  sponsor = "sponsor",
  volunteer = "volunteer",
  admin = "admin",
}

export enum Ethnicity {
  american = "american",  //"American Indian or Alaskan Native",
  asian = "asian",        //"Asian / Pacific Islander",
  black = "black",        //"Black or African American",
  hispanic = "hispanic",  //"Hispanic",
  white = "white",        //"White / Caucasian",
  multiple = "multiple",  //"Multiple ethnicity / Other",
  pnts = "pnts",          //"Prefer not to say",
}

export enum Gender {
  male = "male",           // Male
  female = "female",       // Female
  nonbinary = "nonbinary", // Non-binary / Third Gender
  other = "other",         // Other
  pnts = "pnts",           // Prefer not to say
}

export interface UserDetailsModel {
  discord_id?: string,
  discord_name?: string,
  full_name: string,
  preferred_name: string,
  age?: number,
  phone_number?: string,
  university?: string,
  graduation_year?: string,
  ethnicity: keyof typeof Ethnicity,
  gender: keyof typeof Gender,
}

export interface UserModel extends UserDetailsModel {
  id: number,
  team?: TeamModel,
  email: string,
  hashed_password?: Buffer,
  password_salt?: Buffer,
  role: keyof typeof UserRole,
  verify_code?: string,
  verify_sent_at?: number,
  initially_logged_in_at?: Date,
  last_logged_in_at?: Date,
  h_UK_marketing?: boolean,
  h_UK_Consent?: boolean,
  checked_in: boolean,
}

export type UserIdentifierModel = Pick<UserModel, "id" | "preferred_name">

export enum QRCategory {
  workshop = "workshop",
  sponsor = "sponsor",
  challenge = "challenge",
}

export interface QRCodeModel {
  id: number,
  name: string,
  category: keyof typeof QRCategory,
  payload: string,
  points_value: number,
  state: boolean,
  start_time: Date,
  expiry_time: Date,
  creator: UserModel,
  challenge_rank?: number,
}

export interface PointModel {
  id: number,
  value: number,
  qrcode?: QRCodeModel,
  redeemer: UserModel,
}
