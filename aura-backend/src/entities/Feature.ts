import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * Small homepage "why shop with us" strip items
 * (e.g. "Free shipping over $100", "30-day returns").
 */
@Entity({ name: "features" })
export class Feature {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  title!: string;

  @Column({ type: "varchar", length: 250 })
  copy!: string;

  @Column({ name: "sort_order", type: "int", default: 0 })
  sortOrder!: number;
}
