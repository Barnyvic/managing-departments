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
   * Creates a new sub-department within a department
   * @param departmentId - ID of the parent department
   * @param subDepartmentInput - Sub-department creation data
   * @throws {DepartmentNotFoundException} If parent department not found
   * @throws {DepartmentNameConflictException} If sub-department name already exists in department
   * @returns The created sub-department
   */
  async create(departmentId: number, subDepartmentInput: SubDepartmentInput) {
    this.logger.log(
      `Creating sub-department in department ${departmentId}: ${JSON.stringify(subDepartmentInput)}`
    );

    const department = await this.departmentsRepository.findOne({
      where: { id: departmentId },
      relations: ["subDepartments"],
    });

    if (!department) {
      throw new DepartmentNotFoundException(departmentId);
    }

    // Check if subdepartment with same name exists in the department
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
   * @throws {SubDepartmentNotFoundException} If sub-department not found
   * @throws {DepartmentNameConflictException} If new name conflicts with existing sub-department
   * @returns The updated sub-department
   */
  async update(id: number, updateData: { name: string }) {
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

    // Check for name conflicts within the same department
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
   * @param currentUser - Current authenticated user
   * @param departmentId - Optional department ID to filter by
   * @returns Paginated sub-departments
   */
  async findAll(
    pagination: { page: number; limit: number },
    currentUser: User,
    departmentId?: number
  ) {
    this.logger.log(
      `Fetching sub-departments with pagination: ${JSON.stringify(pagination)}`
    );

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.subDepartmentsRepository
      .createQueryBuilder("subDepartment")
      .innerJoinAndSelect("subDepartment.department", "department")
      .innerJoin("department.createdBy", "user")
      .where("user.id = :userId", { userId: currentUser.id });

    if (departmentId) {
      queryBuilder.andWhere("department.id = :departmentId", { departmentId });
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
   * @throws {SubDepartmentNotFoundException} If sub-department not found
   * @returns The removed sub-department
   */
  async remove(id: number) {
    this.logger.log(`Removing sub-department ${id}`);

    const subDepartment = await this.subDepartmentsRepository.findOne({
      where: { id },
      relations: ["department"],
    });

    if (!subDepartment) {
      throw new SubDepartmentNotFoundException(id);
    }

    const subDepartmentToReturn = { ...subDepartment };
    await this.subDepartmentsRepository.remove(subDepartment);
    return subDepartmentToReturn;
  }
}
