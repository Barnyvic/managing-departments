import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentsService } from "./departments.service";
import { DepartmentsResolver } from "./departments.resolver";
import { Department } from "./entities/department.entity";
import { SubDepartment } from "./entities/sub-department.entity";
import { DepartmentOwnershipGuard } from "./guards/department-ownership.guard";

@Module({
  imports: [TypeOrmModule.forFeature([Department, SubDepartment])],
  providers: [
    DepartmentsResolver,
    DepartmentsService,
    DepartmentOwnershipGuard,
  ],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
