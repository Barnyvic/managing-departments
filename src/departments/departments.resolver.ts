import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { DepartmentsService } from "./departments.service";
import { SubDepartmentsService } from "./services/sub-departments.service";
import { Department } from "./entities/department.entity";
import { SubDepartment } from "./entities/sub-department.entity";
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  PaginationInput,
} from "./dto/department.input";
import {
  SubDepartmentInput,
  UpdateSubDepartmentInput,
} from "./dto/sub-department.input";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../auth/entities/user.entity";
import { DepartmentOwnershipGuard } from "./guards/department-ownership.guard";
import {
  PaginatedDepartments,
  PaginatedSubDepartments,
} from "./entities/paginated-response.entity";
import { Field, ObjectType } from "@nestjs/graphql";


@Resolver(() => Department)
@UseGuards(JwtAuthGuard)
export class DepartmentsResolver {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly subDepartmentsService: SubDepartmentsService
  ) {}

  @Query(() => PaginatedDepartments)
  async getDepartments(
    @Args("paginationInput") paginationInput: PaginationInput,
    @CurrentUser() user: User
  ) {
    return this.departmentsService.findAll(paginationInput, user);
  }

  @Query(() => PaginatedSubDepartments)
  async getSubDepartments(
    @Args("paginationInput") paginationInput: PaginationInput,
    @Args("departmentId", { type: () => Int, nullable: true })
    departmentId: number,
    @CurrentUser() user: User
  ) {
    return this.subDepartmentsService.findAll(
      paginationInput,
      user,
      departmentId
    );
  }

  @Query(() => Department)
  @UseGuards(DepartmentOwnershipGuard)
  async getDepartment(@Args("id", { type: () => Int }) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Mutation(() => Department)
  async createDepartment(
    @Args("createDepartmentInput") createDepartmentInput: CreateDepartmentInput,
    @CurrentUser() user: User
  ) {
    return this.departmentsService.create(createDepartmentInput, user);
  }

  @Mutation(() => Department)
  @UseGuards(DepartmentOwnershipGuard)
  async updateDepartment(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateDepartmentInput") updateDepartmentInput: UpdateDepartmentInput
  ) {
    return this.departmentsService.update(id, updateDepartmentInput);
  }

  @Mutation(() => Department)
  @UseGuards(DepartmentOwnershipGuard)
  async removeDepartment(@Args("id", { type: () => Int }) id: number) {
    return this.departmentsService.remove(id);
  }

  @Mutation(() => SubDepartment)
  @UseGuards(DepartmentOwnershipGuard)
  async createSubDepartment(
    @Args("departmentId", { type: () => Int }) departmentId: number,
    @Args("createSubDepartmentInput")
    createSubDepartmentInput: SubDepartmentInput
  ) {
    return this.subDepartmentsService.create(
      departmentId,
      createSubDepartmentInput
    );
  }

  @Mutation(() => SubDepartment)
  @UseGuards(DepartmentOwnershipGuard)
  async updateSubDepartment(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateSubDepartmentInput")
    updateSubDepartmentInput: UpdateSubDepartmentInput
  ) {
    return this.subDepartmentsService.update(id, updateSubDepartmentInput);
  }

  @Mutation(() => SubDepartment)
  @UseGuards(DepartmentOwnershipGuard)
  async removeSubDepartment(@Args("id", { type: () => Int }) id: number) {
    return this.subDepartmentsService.remove(id);
  }
}
