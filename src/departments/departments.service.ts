import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "./entities/department.entity";
import { SubDepartment } from "./entities/sub-department.entity";
import { CreateDepartmentInput } from "./dto/department.input";
import { SubDepartmentInput } from "./dto/sub-department.input";
import { User } from "../auth/entities/user.entity";
import {
  DepartmentNotFoundException,
  SubDepartmentNotFoundException,
  DepartmentNameConflictException,
  InvalidDepartmentDataException,
} from "../common/exceptions/department.exceptions";

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(SubDepartment)
    private subDepartmentsRepository: Repository<SubDepartment>
  ) {}

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
        page,
        limit,
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
        const subDepartments = createDepartmentInput.subDepartments.map(
          (subDept) =>
            this.subDepartmentsRepository.create({
              name: subDept.name,
              department: savedDepartment,
            })
        );
        savedDepartment.subDepartments =
          await this.subDepartmentsRepository.save(subDepartments);
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

  async update(id: number, updateDepartmentInput: { name: string }) {
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

  async remove(id: number) {
    this.logger.log(`Removing department ${id}`);
    const department = await this.findOne(id);

    // Store department data before removal
    const departmentToReturn = {
      id: department.id,
      name: department.name,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
      createdBy: department.createdBy,
      subDepartments: department.subDepartments,
    };

    await this.departmentsRepository.remove(department);
    return departmentToReturn;
  }

  async createSubDepartment(
    departmentId: number,
    subDepartmentInput: SubDepartmentInput
  ) {
    const department = await this.findOne(departmentId);

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

  async updateSubDepartment(
    id: number,
    updateSubDepartmentInput: { name: string }
  ) {
    const subDepartment = await this.subDepartmentsRepository.findOne({
      where: { id },
      relations: ["department"],
    });

    if (!subDepartment) {
      throw new SubDepartmentNotFoundException(id);
    }

    // Check if new name conflicts with existing subdepartment in the same department
    if (updateSubDepartmentInput.name !== subDepartment.name) {
      const existingSubDepartment = await this.subDepartmentsRepository.findOne(
        {
          where: {
            name: updateSubDepartmentInput.name,
            department: { id: subDepartment.department.id },
          },
        }
      );

      if (existingSubDepartment) {
        throw new DepartmentNameConflictException(
          updateSubDepartmentInput.name
        );
      }
    }

    subDepartment.name = updateSubDepartmentInput.name;
    return this.subDepartmentsRepository.save(subDepartment);
  }

  async removeSubDepartment(id: number) {
    const subDepartment = await this.subDepartmentsRepository.findOne({
      where: { id },
      relations: ["department"],
    });

    if (!subDepartment) {
      throw new SubDepartmentNotFoundException(id);
    }

    // Store subdepartment data before removal
    const subDepartmentToReturn = {
      id: subDepartment.id,
      name: subDepartment.name,
      createdAt: subDepartment.createdAt,
      updatedAt: subDepartment.updatedAt,
      department: subDepartment.department,
    };

    await this.subDepartmentsRepository.remove(subDepartment);
    return subDepartmentToReturn;
  }

  async findAllSubDepartments(
    pagination: { page: number; limit: number },
    currentUser: User,
    departmentId?: number
  ) {
    this.logger.log(
      `Fetching subdepartments with pagination: ${JSON.stringify(pagination)}, departmentId: ${departmentId}`
    );
    try {
      // If departmentId is provided, verify it exists and belongs to the user
      if (departmentId) {
        const department = await this.departmentsRepository.findOne({
          where: {
            id: departmentId,
            createdBy: { id: currentUser.id },
          },
        });

        if (!department) {
          throw new DepartmentNotFoundException(departmentId);
        }
      }

      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      const queryBuilder = this.subDepartmentsRepository
        .createQueryBuilder("subDepartment")
        .innerJoinAndSelect("subDepartment.department", "department")
        .innerJoinAndSelect("department.createdBy", "createdBy")
        .where("createdBy.id = :userId", { userId: currentUser.id });

      if (departmentId) {
        queryBuilder.andWhere("department.id = :departmentId", {
          departmentId,
        });
      }

      const [subDepartments, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy("subDepartment.createdAt", "DESC")
        .getManyAndCount();

      this.logger.log(`Found ${subDepartments.length} subdepartments`);
      return {
        subDepartments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(
        `Error fetching subdepartments: ${error.message}`,
        error.stack
      );
      if (error instanceof DepartmentNotFoundException) {
        throw error;
      }
      throw new InvalidDepartmentDataException(
        "Failed to fetch subdepartments. Please check your input."
      );
    }
  }
}
