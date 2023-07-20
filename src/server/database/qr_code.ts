import { DataType, Table, Column, Model, HasOne } from "sequelize-typescript";
import { QRCodeModel } from "@/server/common/models";
import User from "./user";

interface qrcodeIdentifier {
  id: number,
  name: string,
}

@Table
export default class QRCode extends Model implements QRCodeModel {
  @Column({
    field: "qrcode_id",
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
    id!: number;

  @Column({
    allowNull: false,
  })
    name!: string;

  @HasOne(() => User)
    creator: User;

  @Column({
    allowNull: true,
  })
    description?: string;

  @Column({
    allowNull: false,
  })
    expiry_time!: Date;

  @Column({
    allowNull: false,
  })
    payload!: string;

  @Column({
    allowNull: false,
  })
    points_value!: number;

  @Column({
    allowNull: false,
  })
    start_time!: Date;

  @Column({
    allowNull: false,
  })
    state!: boolean;
}
