import { Field, ObjectType, Int } from "@nestjs/graphql";
import { Department } from "../entities/department.entity";
import { SubDepartment } from "../entities/sub-department.entity";

@ObjectType()
export class PaginatedDepartments {
  @Field(() => [Department])
  departments: Department[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

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
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}
