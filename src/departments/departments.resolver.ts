import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { DepartmentsService } from "./departments.service";
import { Department } from "./entities/department.entity";
import { SubDepartment } from "./entities/sub-department.entity";
import { CreateDepartmentInput } from "./dto/department.input";
import { UpdateDepartmentInput } from "./dto/department.input";
import { SubDepartmentInput } from "./dto/sub-department.input";
import { UpdateSubDepartmentInput } from "./dto/sub-department.input";
import { PaginationInput } from "./dto/department.input";
import { PaginatedDepartments } from "./dto/pagination.result";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { DepartmentOwnershipGuard } from "./guards/department-ownership.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../auth/entities/user.entity";

@Resolver(() => Department)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Query(() => PaginatedDepartments)
  @UseGuards(JwtAuthGuard)
  async getDepartments(
    @Args("pagination") pagination: PaginationInput,
    @CurrentUser() user: User
  ) {
    return this.departmentsService.findAll(pagination, user);
  }

  @Query(() => Department)
  @UseGuards(JwtAuthGuard)
  async getDepartment(@Args("id", { type: () => ID }) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Mutation(() => Department)
  @UseGuards(JwtAuthGuard)
  async createDepartment(
    @Args("input") createDepartmentInput: CreateDepartmentInput,
    @CurrentUser() user: User
  ) {
    return this.departmentsService.create(createDepartmentInput, user);
  }

  @Mutation(() => Department)
  @UseGuards(JwtAuthGuard, DepartmentOwnershipGuard)
  async updateDepartment(
    @Args("id", { type: () => ID }) id: number,
    @Args("input") updateDepartmentInput: UpdateDepartmentInput
  ) {
    return this.departmentsService.update(id, updateDepartmentInput);
  }

  @Mutation(() => Department)
  @UseGuards(JwtAuthGuard, DepartmentOwnershipGuard)
  async deleteDepartment(@Args("id", { type: () => ID }) id: number) {
    return this.departmentsService.remove(id);
  }

  @Mutation(() => SubDepartment)
  @UseGuards(JwtAuthGuard, DepartmentOwnershipGuard)
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
  @UseGuards(JwtAuthGuard, DepartmentOwnershipGuard)
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
  @UseGuards(JwtAuthGuard, DepartmentOwnershipGuard)
  async deleteSubDepartment(@Args("id", { type: () => ID }) id: number) {
    return this.departmentsService.removeSubDepartment(id);
  }
}
