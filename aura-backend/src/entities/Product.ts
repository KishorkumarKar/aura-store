import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./Category";
import { ProductVariant } from "./ProductVariant";

export type ProductType = "simple" | "configurable";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 200, unique: true })
  slug!: string;

  @Column({ type: "varchar", length: 200 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 20 })
  type!: ProductType;

  @ManyToOne(() => Category, { eager: true, onDelete: "RESTRICT" })
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @Column({ name: "category_id" })
  categoryId!: string;

  // For "simple" products only. Null for "configurable" — price/stock
  // live on the variant rows instead.
  @Column({ type: "numeric", precision: 10, scale: 2, nullable: true })
  price!: string | null;

  @Column({ type: "int", nullable: true })
  stock!: number | null;

  @Column({ type: "varchar", length: 60, nullable: true })
  color!: string | null;

  @Column({ name: "color_hex", type: "varchar", length: 7, nullable: true })
  colorHex!: string | null;

  @Column({ type: "numeric", precision: 2, scale: 1, default: 0 })
  rating!: string;

  // Ordered list of image URLs.
  @Column({ type: "jsonb", default: () => "'[]'" })
  images!: string[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants!: ProductVariant[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
