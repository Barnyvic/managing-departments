import { Field, ObjectType, Int } from "@nestjs/graphql";
import { Department } from "../entities/department.entity";

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
