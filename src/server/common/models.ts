export interface MegateamModel {
  id: number,
  name: string,
  description?: string,
}

export interface AreaModel {
  id: number,
  name: string,
  room: string,
  megateam: MegateamModel,
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

export interface UserDetailsModel {
  discord_id?: string,
  discord_name?: string,
  full_name: string,
  preferred_name: string,
  age?: number,
  phone_number?: string,
  university?: string,
  graduation_year?: string,
  ethnicity?: string,
  gender?: string,
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
  created_at: Date,
  updated_at: Date,
}

export type UserIdentifierModel = Pick<UserModel, "id" | "preferred_name">

export interface QRCodeModel {
  id: number,
  name: string,
  description?: string,
  payload: string,
  points_value: number,
  state: boolean,
  start_time: Date,
  expiry_time: Date,
  creator: UserModel,
}

export interface PointModel {
  id: number,
  value: number,
  qrcode: QRCodeModel,
  redeemer: UserModel,
}