import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentsService } from "./departments.service";
import { DepartmentsResolver } from "./departments.resolver";
import { Department } from "./entities/department.entity";
import { SubDepartment } from "./entities/sub-department.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Department, SubDepartment])],
  providers: [DepartmentsResolver, DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
