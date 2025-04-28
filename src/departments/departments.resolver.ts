import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { DepartmentsService } from "./departments.service";
import { Department } from "./entities/department.entity";
import { CreateDepartmentInput } from "./dto/create-department.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Resolver(() => Department)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Mutation(() => Department)
  @UseGuards(JwtAuthGuard)
  createDepartment(
    @Args("createDepartmentInput") createDepartmentInput: CreateDepartmentInput
  ) {
    return this.departmentsService.create(createDepartmentInput);
  }

  @Query(() => [Department], { name: "departments" })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.departmentsService.findAll();
  }

  @Query(() => Department, { name: "department" })
  @UseGuards(JwtAuthGuard)
  findOne(@Args("id") id: number) {
    return this.departmentsService.findOne(id);
  }
}
