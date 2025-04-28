import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { DepartmentsService } from "./departments.service";
import { Department } from "./entities/department.entity";
import { SubDepartment } from "./entities/sub-department.entity";
import { CreateDepartmentInput } from "./dto/department.input";
import { UpdateDepartmentInput } from "./dto/department.input";
import { SubDepartmentInput } from "./dto/sub-department.input";
import { UpdateSubDepartmentInput } from "./dto/sub-department.input";
import { PaginationInput } from "./dto/department.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Resolver(() => Department)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Query(() => [Department])
  @UseGuards(JwtAuthGuard)
  async getDepartments(@Args("pagination") pagination: PaginationInput) {
    return this.departmentsService.findAll(pagination);
  }

  @Query(() => Department)
  @UseGuards(JwtAuthGuard)
  async getDepartment(@Args("id", { type: () => ID }) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Mutation(() => Department)
  @UseGuards(JwtAuthGuard)
  async createDepartment(
    @Args("input") createDepartmentInput: CreateDepartmentInput
  ) {
    return this.departmentsService.create(createDepartmentInput);
  }

  @Mutation(() => Department)
  @UseGuards(JwtAuthGuard)
  async updateDepartment(
    @Args("id", { type: () => ID }) id: number,
    @Args("input") updateDepartmentInput: UpdateDepartmentInput
  ) {
    return this.departmentsService.update(id, updateDepartmentInput);
  }

  @Mutation(() => Department)
  @UseGuards(JwtAuthGuard)
  async deleteDepartment(@Args("id", { type: () => ID }) id: number) {
    return this.departmentsService.remove(id);
  }

  @Mutation(() => SubDepartment)
  @UseGuards(JwtAuthGuard)
  async createSubDepartment(
    @Args("departmentId", { type: () => ID }) departmentId: number,
    @Args("input") subDepartmentInput: SubDepartmentInput
  ) {
    return this.departmentsService.createSubDepartment(
      departmentId,
      subDepartmentInput
    );
  }

  @Mutation(() => SubDepartment)
  @UseGuards(JwtAuthGuard)
  async updateSubDepartment(
    @Args("id", { type: () => ID }) id: number,
    @Args("input") updateSubDepartmentInput: UpdateSubDepartmentInput
  ) {
    return this.departmentsService.updateSubDepartment(
      id,
      updateSubDepartmentInput
    );
  }

  @Mutation(() => SubDepartment)
  @UseGuards(JwtAuthGuard)
  async deleteSubDepartment(@Args("id", { type: () => ID }) id: number) {
    return this.departmentsService.removeSubDepartment(id);
  }
}
