import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubDepartment } from "../entities/sub-department.entity";
import { Department } from "../entities/department.entity";
import { SubDepartmentInput } from "../dto/sub-department.input";
import { User } from "../../auth/entities/user.entity";
import {
  DepartmentNotFoundException,
  SubDepartmentNotFoundException,
  DepartmentNameConflictException,
} from "../../common/exceptions/department.exceptions";

@Injectable()
export class SubDepartmentsService {
  private readonly logger = new Logger(SubDepartmentsService.name);

  constructor(
    @InjectRepository(SubDepartment)
    private subDepartmentsRepository: Repository<SubDepartment>,
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>
  ) {}

  /**
   * Validates that a department exists
   * @param departmentId - ID of the department to validate
   * @throws {DepartmentNotFoundException} If department not found
   */
  private async validateDepartment(departmentId: number): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id: departmentId },
    });

    if (!department) {
      throw new DepartmentNotFoundException(departmentId);
    }

    return department;
  }

  /**
   * Validates that a department exists and belongs to the user
   * @param departmentId - ID of the department to validate
   * @param userId - User ID to check ownership
   * @throws {DepartmentNotFoundException} If department not found or doesn't belong to user
   */
  private async validateDepartmentOwnership(
    departmentId: number,
    userId: number
  ): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: {
        id: departmentId,
        createdBy: { id: userId },
      },
    });

    if (!department) {
      throw new DepartmentNotFoundException(departmentId);
    }

    return department;
  }

  /**
   * Creates a new sub-department within a department
   * @param departmentId - ID of the parent department
   * @param subDepartmentInput - Sub-department creation data
   * @param userId - ID of the user creating the sub-department
   * @throws {DepartmentNotFoundException} If parent department not found or doesn't belong to user
   * @throws {DepartmentNameConflictException} If sub-department name already exists in department
   * @returns The created sub-department
   */
  async create(
    departmentId: number,
    subDepartmentInput: SubDepartmentInput,
    userId: number
  ) {
    this.logger.log(
      `Creating sub-department in department ${departmentId}: ${JSON.stringify(subDepartmentInput)}`
    );

    const department = await this.validateDepartmentOwnership(
      departmentId,
      userId
    );

    const existingSubDepartment = await this.subDepartmentsRepository.findOne({
      where: {
        name: subDepartmentInput.name,
        department: { id: departmentId },
      },
    });

    if (existingSubDepartment) {
      throw new DepartmentNameConflictException(subDepartmentInput.name);
    }

    const subDepartment = this.subDepartmentsRepository.create({
      ...subDepartmentInput,
      department,
    });

    return this.subDepartmentsRepository.save(subDepartment);
  }

  /**
   * Updates a sub-department
   * @param id - ID of the sub-department to update
   * @param updateData - Updated sub-department data
   * @param userId - ID of the user updating the sub-department
   * @throws {SubDepartmentNotFoundException} If sub-department not found
   * @throws {DepartmentNotFoundException} If parent department not found or doesn't belong to user
   * @throws {DepartmentNameConflictException} If new name conflicts with existing sub-department
   * @returns The updated sub-department
   */
  async update(id: number, updateData: { name: string }, userId: number) {
    this.logger.log(
      `Updating sub-department ${id}: ${JSON.stringify(updateData)}`
    );

    const subDepartment = await this.subDepartmentsRepository.findOne({
      where: { id },
      relations: ["department"],
    });

    if (!subDepartment) {
      throw new SubDepartmentNotFoundException(id);
    }

    await this.validateDepartmentOwnership(subDepartment.department.id, userId);

    if (updateData.name !== subDepartment.name) {
      const existingSubDepartment = await this.subDepartmentsRepository.findOne(
        {
          where: {
            name: updateData.name,
            department: { id: subDepartment.department.id },
          },
        }
      );

      if (existingSubDepartment) {
        throw new DepartmentNameConflictException(updateData.name);
      }
    }

    subDepartment.name = updateData.name;
    return this.subDepartmentsRepository.save(subDepartment);
  }

  /**
   * Retrieves all sub-departments with pagination
   * @param pagination - Pagination parameters
   * @param departmentId - Optional department ID to filter by
   * @throws {DepartmentNotFoundException} If specified department not found
   * @returns Paginated sub-departments
   */
  async findAll(
    pagination: { page: number; limit: number },
    departmentId?: number
  ) {
    this.logger.log(
      `Fetching sub-departments with pagination: ${JSON.stringify(pagination)}`
    );

    if (departmentId) {
      await this.validateDepartment(departmentId);
    }

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.subDepartmentsRepository
      .createQueryBuilder("subDepartment")
      .innerJoinAndSelect("subDepartment.department", "department")
      .leftJoinAndSelect("department.createdBy", "user");

    if (departmentId) {
      queryBuilder.where("department.id = :departmentId", { departmentId });
    }

    const [subDepartments, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy("subDepartment.createdAt", "DESC")
      .getManyAndCount();

    return {
      subDepartments,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Removes a sub-department
   * @param id - ID of the sub-department to remove
   * @param userId - ID of the user removing the sub-department
   * @throws {SubDepartmentNotFoundException} If sub-department not found
   * @throws {DepartmentNotFoundException} If parent department not found or doesn't belong to user
   * @returns The removed sub-department
   */
  async remove(id: number, userId: number) {
    this.logger.log(`Removing sub-department ${id}`);

    const subDepartment = await this.subDepartmentsRepository.findOne({
      where: { id },
      relations: ["department"],
    });

    if (!subDepartment) {
      throw new SubDepartmentNotFoundException(id);
    }

    await this.validateDepartmentOwnership(subDepartment.department.id, userId);

    const subDepartmentToReturn = { ...subDepartment };
    await this.subDepartmentsRepository.remove(subDepartment);
    return subDepartmentToReturn;
  }

  /**
   * Retrieves a single sub-department by ID
   * @param id - ID of the sub-department to retrieve
   * @throws {SubDepartmentNotFoundException} If sub-department not found
   * @returns The sub-department with its relations
   */
  async findOne(id: number) {
    this.logger.log(`Fetching sub-department ${id}`);

    const subDepartment = await this.subDepartmentsRepository.findOne({
      where: { id },
      relations: ["department", "department.createdBy"],
    });

    if (!subDepartment) {
      throw new SubDepartmentNotFoundException(id);
    }

    return subDepartment;
  }
}
