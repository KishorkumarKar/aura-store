import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "categories" })
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 100, unique: true })
  slug!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  image!: string | null;

  @Column({ name: "sort_order", type: "int", default: 0 })
  sortOrder!: number;
}
