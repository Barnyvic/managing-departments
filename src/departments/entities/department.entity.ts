import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SubDepartment } from "./sub-department.entity";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SubDepartment, (subDepartment) => subDepartment.department, {
    cascade: true,
  })
  subDepartments: SubDepartment[];
}
