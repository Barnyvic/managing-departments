import { Field, ObjectType, ID } from "@nestjs/graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { SubDepartment } from "./sub-department.entity";
import { User } from "../../auth/entities/user.entity";

@ObjectType()
@Entity()
export class Department {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 255 })
  name: string;

  @Field(() => [SubDepartment], { nullable: true })
  @OneToMany(() => SubDepartment, (subDepartment) => subDepartment.department)
  subDepartments: SubDepartment[];

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
