import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
  ) {}

  async create(createDepartmentInput: CreateDepartmentInput): Promise<Department> {
    const department = this.departmentsRepository.create(createDepartmentInput);
    return this.departmentsRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentsRepository.find({
      relations: ['subDepartments'],
    });
  }

  async findOne(id: number): Promise<Department> {
    return this.departmentsRepository.findOne({
      where: { id },
      relations: ['subDepartments'],
    });
  }
} 