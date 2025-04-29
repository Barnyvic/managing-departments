import { Field, ObjectType, Int } from "@nestjs/graphql";
import { Department } from "./department.entity";
import { SubDepartment } from "./sub-department.entity";

@ObjectType()
export class PaginatedDepartments {
  @Field(() => [Department])
  departments: Department[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}

@ObjectType()
export class PaginatedSubDepartments {
  @Field(() => [SubDepartment])
  subDepartments: SubDepartment[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}
