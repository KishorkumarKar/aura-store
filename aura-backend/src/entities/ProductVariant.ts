import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Product } from "./Product";

@Entity({ name: "product_variants" })
export class ProductVariant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ name: "product_id" })
  productId!: string;

  @Column({ type: "varchar", length: 60, nullable: true })
  color!: string | null;

  @Column({ name: "color_hex", type: "varchar", length: 7, nullable: true })
  colorHex!: string | null;

  @Column({ type: "varchar", length: 30, nullable: true })
  size!: string | null;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  price!: string;

  @Column({ type: "int", default: 0 })
  stock!: number;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 60, unique: true })
  sku!: string;
}
