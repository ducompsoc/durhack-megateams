export interface Megateam {
  id: number,
  name: string,
  description?: string,
}

export interface Area {
  id: number,
  name: string,
  room: string,
  megateam: Megateam,
}

export interface Team {
  id: number,
  name: string,
  area?: Area,
}

export enum UserRole {
  hacker,
  sponsor,
  volunteer,
  admin,
}

export interface User {
  id: number,
  team?: Team,
  email: string,
  hashed_password?: string,
  discord_id?: string,
  discord_name?: string,
  full_name: string,
  preferred_name: string,
  role: keyof typeof UserRole,
  verify_code?: string,
  verify_sent_at?: number,
  initially_logged_in_at?: Date,
  last_logged_in_at?: Date,
  age?: number,
  phone_number?: string,
  university?: string,
  graduation_year?: string,
  ethnicity?: string,
  gender?: string,
  h_UK_marketing?: boolean,
  h_UK_Consent?: boolean,
  checked_in: boolean,
  created_at: Date,
  updated_at: Date,
}

export interface QRCode {
  id: number,
  name: string,
  description?: string,
  payload: string,
  points_value: number,
  state: boolean,
  start_time: Date,
  expiry_time: Date,
  creator: User,
}

export interface Point {
  id: number,
  value: number,
  qrcode: QRCode,
  redeemer: User,
}