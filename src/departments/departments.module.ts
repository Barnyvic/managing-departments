import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentsService } from "./departments.service";
import { DepartmentsResolver } from "./departments.resolver";
import { Department } from "./entities/department.entity";
import { SubDepartment } from "./entities/sub-department.entity";
import { SubDepartmentsService } from "./services/sub-departments.service";
import { DepartmentOwnershipGuard } from "./guards/department-ownership.guard";

@Module({
  imports: [TypeOrmModule.forFeature([Department, SubDepartment])],
  providers: [
    DepartmentsResolver,
    DepartmentsService,
    SubDepartmentsService,
    DepartmentOwnershipGuard,
  ],
  exports: [DepartmentsService, SubDepartmentsService],
})
export class DepartmentsModule {}
