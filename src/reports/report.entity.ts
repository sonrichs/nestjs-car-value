import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  make: string;
  @Column()
  mileage: string;
  @Column()
  price: number;
}