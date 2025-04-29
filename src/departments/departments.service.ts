import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "./entities/department.entity";
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "./dto/department.input";
import { User } from "../auth/entities/user.entity";
import {
  DepartmentNotFoundException,
  DepartmentNameConflictException,
  InvalidDepartmentDataException,
} from "../common/exceptions/department.exceptions";
import { SubDepartmentsService } from "./services/sub-departments.service";

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    private subDepartmentsService: SubDepartmentsService
  ) {}

  /**
   * Retrieves all departments with pagination
   * @param pagination - Pagination parameters (page and limit)
   * @param currentUser - The authenticated user requesting the departments
   * @returns Paginated list of departments with their sub-departments
   */
  async findAll(
    pagination: { page: number; limit: number },
    currentUser: User
  ) {
    this.logger.log(
      `Fetching departments with pagination: ${JSON.stringify(pagination)}`
    );
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      const [departments, total] =
        await this.departmentsRepository.findAndCount({
          where: { createdBy: { id: currentUser.id } },
          relations: ["subDepartments"],
          skip,
          take: limit,
          order: { createdAt: "DESC" },
        });

      this.logger.log(`Found ${departments.length} departments`);
      return {
        departments,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(
        `Error fetching departments: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Retrieves a single department by ID
   * @param id - The ID of the department to retrieve
   * @throws {DepartmentNotFoundException} If department not found
   * @returns The department with its sub-departments
   */
  async findOne(id: number) {
    this.logger.log(`Fetching department with id: ${id}`);
    const department = await this.departmentsRepository.findOne({
      where: { id },
      relations: ["subDepartments", "createdBy"],
    });

    if (!department) {
      throw new DepartmentNotFoundException(id);
    }

    return department;
  }

  /**
   * Creates a new department with optional sub-departments
   * @param createDepartmentInput - Department creation data
   * @param currentUser - The user creating the department
   * @throws {DepartmentNameConflictException} If department name already exists
   * @throws {InvalidDepartmentDataException} If creation fails
   * @returns The created department
   */
  async create(
    createDepartmentInput: CreateDepartmentInput,
    currentUser: User
  ) {
    this.logger.log(
      `Creating new department: ${JSON.stringify(createDepartmentInput)}`
    );
    try {
      // Check if department with same name exists for this user
      const existingDepartment = await this.departmentsRepository.findOne({
        where: {
          name: createDepartmentInput.name,
          createdBy: { id: currentUser.id },
        },
      });

      if (existingDepartment) {
        throw new DepartmentNameConflictException(createDepartmentInput.name);
      }

      const department = this.departmentsRepository.create({
        name: createDepartmentInput.name,
        createdBy: currentUser,
      });

      const savedDepartment = await this.departmentsRepository.save(department);

      if (createDepartmentInput.subDepartments?.length) {
        for (const subDeptInput of createDepartmentInput.subDepartments) {
          await this.subDepartmentsService.create(
            savedDepartment.id,
            subDeptInput
          );
        }

        // Refresh department to include created sub-departments
        return this.findOne(savedDepartment.id);
      }

      return savedDepartment;
    } catch (error) {
      if (error instanceof DepartmentNameConflictException) {
        throw error;
      }
      this.logger.error(
        `Error creating department: ${error.message}`,
        error.stack
      );
      throw new InvalidDepartmentDataException(
        "Failed to create department. Please check your input."
      );
    }
  }

  /**
   * Updates a department's information
   * @param id - The ID of the department to update
   * @param updateDepartmentInput - Updated department data
   * @throws {DepartmentNotFoundException} If department not found
   * @throws {DepartmentNameConflictException} If new name conflicts
   * @returns The updated department
   */
  async update(id: number, updateDepartmentInput: UpdateDepartmentInput) {
    this.logger.log(
      `Updating department ${id}: ${JSON.stringify(updateDepartmentInput)}`
    );
    try {
      const department = await this.findOne(id);

      // Check if new name conflicts with existing department
      if (updateDepartmentInput.name !== department.name) {
        const existingDepartment = await this.departmentsRepository.findOne({
          where: { name: updateDepartmentInput.name },
        });

        if (existingDepartment) {
          throw new DepartmentNameConflictException(updateDepartmentInput.name);
        }
      }

      department.name = updateDepartmentInput.name;
      return await this.departmentsRepository.save(department);
    } catch (error) {
      if (
        error instanceof DepartmentNotFoundException ||
        error instanceof DepartmentNameConflictException
      ) {
        throw error;
      }
      throw new InvalidDepartmentDataException(
        "Failed to update department. Please check your input."
      );
    }
  }

  /**
   * Removes a department and all its sub-departments
   * @param id - The ID of the department to remove
   * @throws {DepartmentNotFoundException} If department not found
   * @returns The removed department
   */
  async remove(id: number) {
    this.logger.log(`Removing department ${id}`);
    const department = await this.findOne(id);

    // Store department data before removal
    const departmentToReturn = { ...department };
    await this.departmentsRepository.remove(department);
    return departmentToReturn;
  }
}
