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
import { Logger } from "@nestjs/common";
import {
  DepartmentNotFoundException,
  DepartmentNameConflictException,
  InvalidDepartmentDataException,
  SubDepartmentNotFoundException,
} from "../common/exceptions/department.exceptions";

@Resolver(() => Department)
@UseGuards(JwtAuthGuard)
export class DepartmentsResolver {
  private readonly logger = new Logger(DepartmentsResolver.name);

  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly subDepartmentsService: SubDepartmentsService
  ) {}

  @Query(() => PaginatedDepartments)
  async getDepartments(
    @Args("paginationInput") paginationInput: PaginationInput
  ) {
    try {
      return await this.departmentsService.findAll(paginationInput);
    } catch (error) {
      this.logger.error(
        `Error fetching departments: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  @Query(() => PaginatedSubDepartments)
  async getSubDepartments(
    @Args("paginationInput") paginationInput: PaginationInput,
    @Args("departmentId", { type: () => Int, nullable: true })
    departmentId: number
  ) {
    try {
      return await this.subDepartmentsService.findAll(
        paginationInput,
        departmentId
      );
    } catch (error) {
      this.logger.error(
        `Error fetching sub-departments: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  @Query(() => Department)
  async getDepartment(@Args("id", { type: () => Int }) id: number) {
    try {
      return await this.departmentsService.findOne(id);
    } catch (error) {
      if (error instanceof DepartmentNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error fetching department ${id}: ${error.message}`,
        error.stack
      );
      throw new DepartmentNotFoundException(id);
    }
  }

  @Mutation(() => Department)
  async createDepartment(
    @Args("createDepartmentInput") createDepartmentInput: CreateDepartmentInput,
    @CurrentUser() user: User
  ) {
    try {
      return await this.departmentsService.create(createDepartmentInput, user);
    } catch (error) {
      if (
        error instanceof DepartmentNameConflictException ||
        error instanceof InvalidDepartmentDataException
      ) {
        throw error;
      }
      this.logger.error(
        `Error creating department: ${error.message}`,
        error.stack
      );
      throw new InvalidDepartmentDataException("Failed to create department");
    }
  }

  @Mutation(() => Department)
  @UseGuards(DepartmentOwnershipGuard)
  async updateDepartment(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateDepartmentInput") updateDepartmentInput: UpdateDepartmentInput
  ) {
    try {
      return await this.departmentsService.update(id, updateDepartmentInput);
    } catch (error) {
      if (
        error instanceof DepartmentNotFoundException ||
        error instanceof DepartmentNameConflictException ||
        error instanceof InvalidDepartmentDataException
      ) {
        throw error;
      }
      this.logger.error(
        `Error updating department ${id}: ${error.message}`,
        error.stack
      );
      throw new InvalidDepartmentDataException("Failed to update department");
    }
  }

  @Mutation(() => Department)
  @UseGuards(DepartmentOwnershipGuard)
  async removeDepartment(@Args("id", { type: () => Int }) id: number) {
    try {
      return await this.departmentsService.remove(id);
    } catch (error) {
      if (error instanceof DepartmentNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error removing department ${id}: ${error.message}`,
        error.stack
      );
      throw new DepartmentNotFoundException(id);
    }
  }

  @Mutation(() => SubDepartment)
  @UseGuards(DepartmentOwnershipGuard)
  async createSubDepartment(
    @Args("departmentId", { type: () => Int }) departmentId: number,
    @Args("createSubDepartmentInput")
    createSubDepartmentInput: SubDepartmentInput,
    @CurrentUser() user: User
  ) {
    try {
      return await this.subDepartmentsService.create(
        departmentId,
        createSubDepartmentInput,
        user.id
      );
    } catch (error) {
      if (
        error instanceof DepartmentNotFoundException ||
        error instanceof InvalidDepartmentDataException
      ) {
        throw error;
      }
      this.logger.error(
        `Error creating sub-department: ${error.message}`,
        error.stack
      );
      throw new InvalidDepartmentDataException(
        "Failed to create sub-department"
      );
    }
  }

  @Mutation(() => SubDepartment)
  @UseGuards(DepartmentOwnershipGuard)
  async updateSubDepartment(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateSubDepartmentInput")
    updateSubDepartmentInput: UpdateSubDepartmentInput,
    @CurrentUser() user: User
  ) {
    try {
      return await this.subDepartmentsService.update(
        id,
        updateSubDepartmentInput,
        user.id
      );
    } catch (error) {
      if (
        error instanceof SubDepartmentNotFoundException ||
        error instanceof InvalidDepartmentDataException
      ) {
        throw error;
      }
      this.logger.error(
        `Error updating sub-department ${id}: ${error.message}`,
        error.stack
      );
      throw new SubDepartmentNotFoundException(id);
    }
  }

  @Mutation(() => SubDepartment)
  @UseGuards(DepartmentOwnershipGuard)
  async removeSubDepartment(
    @Args("id", { type: () => Int }) id: number,
    @CurrentUser() user: User
  ) {
    try {
      return await this.subDepartmentsService.remove(id, user.id);
    } catch (error) {
      if (error instanceof SubDepartmentNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error removing sub-department ${id}: ${error.message}`,
        error.stack
      );
      throw new SubDepartmentNotFoundException(id);
    }
  }
}
