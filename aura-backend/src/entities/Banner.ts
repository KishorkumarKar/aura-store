import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "banners" })
export class Banner {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  eyebrow!: string;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text" })
  copy!: string;

  @Column({ name: "cta_href", type: "varchar", length: 200 })
  ctaHref!: string;

  @Column({ name: "cta_label", type: "varchar", length: 100 })
  ctaLabel!: string;

  @Column({ type: "varchar", length: 500 })
  image!: string;

  @Column({ name: "sort_order", type: "int", default: 0 })
  sortOrder!: number;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;
}
