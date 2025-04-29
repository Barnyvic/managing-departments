import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "./entities/department.entity";
import { SubDepartment } from "./entities/sub-department.entity";
import { CreateDepartmentInput } from "./dto/department.input";
import { SubDepartmentInput } from "./dto/sub-department.input";

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(SubDepartment)
    private subDepartmentsRepository: Repository<SubDepartment>
  ) {}

  async findAll(pagination: { page: number; limit: number }) {
    this.logger.log(
      `Fetching departments with pagination: ${JSON.stringify(pagination)}`
    );
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      const [departments, total] =
        await this.departmentsRepository.findAndCount({
          relations: ["subDepartments"],
          skip,
          take: limit,
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
    try {
      const department = await this.departmentsRepository.findOne({
        where: { id },
        relations: ["subDepartments"],
      });

      if (!department) {
        this.logger.warn(`Department with ID ${id} not found`);
        throw new NotFoundException(`Department with ID ${id} not found`);
      }

      return department;
    } catch (error) {
      this.logger.error(
        `Error fetching department ${id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async create(createDepartmentInput: CreateDepartmentInput) {
    this.logger.log(
      `Creating new department: ${JSON.stringify(createDepartmentInput)}`
    );
    try {
      const department = this.departmentsRepository.create({
        name: createDepartmentInput.name,
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

      this.logger.log(`Created department with id: ${savedDepartment.id}`);
      return savedDepartment;
    } catch (error) {
      this.logger.error(
        `Error creating department: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async update(id: number, updateDepartmentInput: { name: string }) {
    this.logger.log(
      `Updating department ${id}: ${JSON.stringify(updateDepartmentInput)}`
    );
    try {
      const department = await this.findOne(id);
      department.name = updateDepartmentInput.name;
      const updatedDepartment =
        await this.departmentsRepository.save(department);
      this.logger.log(`Updated department ${id}`);
      return updatedDepartment;
    } catch (error) {
      this.logger.error(
        `Error updating department ${id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async remove(id: number) {
    this.logger.log(`Removing department ${id}`);
    try {
      const department = await this.findOne(id);
      const removedDepartment =
        await this.departmentsRepository.remove(department);
      this.logger.log(`Removed department ${id}`);
      return removedDepartment;
    } catch (error) {
      this.logger.error(
        `Error removing department ${id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async createSubDepartment(
    departmentId: number,
    subDepartmentInput: SubDepartmentInput
  ) {
    const department = await this.findOne(departmentId);
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
    });

    if (!subDepartment) {
      throw new NotFoundException(`Sub-department with ID ${id} not found`);
    }

    subDepartment.name = updateSubDepartmentInput.name;
    return this.subDepartmentsRepository.save(subDepartment);
  }

  async removeSubDepartment(id: number) {
    const subDepartment = await this.subDepartmentsRepository.findOne({
      where: { id },
    });

    if (!subDepartment) {
      throw new NotFoundException(`Sub-department with ID ${id} not found`);
    }

    return this.subDepartmentsRepository.remove(subDepartment);
  }
}
