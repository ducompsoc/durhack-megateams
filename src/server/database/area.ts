import { DataType, Table, Column, Model, HasOne } from "sequelize-typescript";
import { AreaModel } from "@/server/common/models";
import Megateam from "@/server/database/megateam";

interface areaIdentifier {
  id: number,
  name: string,
}

@Table
export default class Area extends Model implements AreaModel {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
    id!: number;

  @HasOne(() => Megateam)
    megateam!: Megateam;

  @Column
    name!: string;

  @Column
    room!: string;

  static async listAreas(): Promise<areaIdentifier[]> {
    throw new Error("Not implemented.");
  }

  static async getArea(id: number): Promise<AreaModel> {
    throw new Error("Not implemented.");
  }
}
