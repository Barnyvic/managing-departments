import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Department } from "./department.entity";

@Entity()
export class SubDepartment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Department, (department) => department.subDepartments)
  department: Department;
}
