import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "./entities/department.entity";
import { SubDepartment } from "./entities/sub-department.entity";
import { CreateDepartmentInput } from "./dto/department.input";
import { SubDepartmentInput } from "./dto/sub-department.input";

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(SubDepartment)
    private subDepartmentsRepository: Repository<SubDepartment>
  ) {}

  async findAll(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [departments, total] = await this.departmentsRepository.findAndCount({
      relations: ["subDepartments"],
      skip,
      take: limit,
    });

    return {
      departments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const department = await this.departmentsRepository.findOne({
      where: { id },
      relations: ["subDepartments"],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async create(createDepartmentInput: CreateDepartmentInput) {
    const department = this.departmentsRepository.create({
      name: createDepartmentInput.name,
    });

    if (createDepartmentInput.subDepartments?.length) {
      department.subDepartments = createDepartmentInput.subDepartments.map(
        (subDept) =>
          this.subDepartmentsRepository.create({
            name: subDept.name,
          })
      );
    }

    return this.departmentsRepository.save(department);
  }

  async update(id: number, updateDepartmentInput: { name: string }) {
    const department = await this.findOne(id);
    department.name = updateDepartmentInput.name;
    return this.departmentsRepository.save(department);
  }

  async remove(id: number) {
    const department = await this.findOne(id);
    return this.departmentsRepository.remove(department);
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
