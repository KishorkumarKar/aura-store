import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";

export type OrderStatus = "pending" | "paid" | "cancelled";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column({ name: "order_number", type: "varchar", length: 20, unique: true })
  orderNumber!: string;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "user_id" })
  userId!: string;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 200 })
  name!: string;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  subtotal!: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  shipping!: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  tax!: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  total!: string;

  @Column({ type: "varchar", length: 20, default: "paid" })
  status!: OrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items!: OrderItem[];

  @CreateDateColumn({ name: "placed_at" })
  placedAt!: Date;
}

@Entity({ name: "order_items" })
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @Column({ name: "order_id" })
  orderId!: string;

  @ManyToOne(() => Product, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ name: "product_id" })
  productId!: string;

  @ManyToOne(() => ProductVariant, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn({ name: "variant_id" })
  variant!: ProductVariant | null;

  @Column({ name: "variant_id", nullable: true })
  variantId!: string | null;

  // Snapshots — orders must stay accurate even if the product changes later.
  @Column({ name: "product_name", type: "varchar", length: 200 })
  productName!: string;

  @Column({ name: "variant_label", type: "varchar", length: 150, nullable: true })
  variantLabel!: string | null;

  @Column({ name: "image", type: "varchar", length: 500 })
  image!: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  price!: string;

  @Column({ type: "int" })
  quantity!: number;
}
