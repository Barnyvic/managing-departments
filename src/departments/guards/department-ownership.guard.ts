import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { DepartmentsService } from "../departments.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubDepartment } from "../entities/sub-department.entity";

@Injectable()
export class DepartmentOwnershipGuard implements CanActivate {
  constructor(
    private departmentsService: DepartmentsService,
    @InjectRepository(SubDepartment)
    private subDepartmentsRepository: Repository<SubDepartment>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const args = ctx.getArgs();
    const operation =
      ctx.getInfo().operation.selectionSet.selections[0].name.value;

    let departmentId: number;

    // Handle different operations
    if (operation.includes("SubDepartment")) {
      if (
        operation === "updateSubDepartment" ||
        operation === "deleteSubDepartment"
      ) {
        const subDepartment = await this.subDepartmentsRepository.findOne({
          where: { id: args.id },
          relations: ["department", "department.createdBy"],
        });

        if (!subDepartment) {
          return false;
        }

        departmentId = subDepartment.department.id;
        if (subDepartment.department.createdBy.id !== req.user.id) {
          throw new ForbiddenException(
            "You do not have permission to modify this subdepartment"
          );
        }
        return true;
      } else if (operation === "createSubDepartment") {
        departmentId = args.departmentId;
      }
    } else {
      departmentId = args.id;
    }

    if (!departmentId) return true;

    const department = await this.departmentsService.findOne(departmentId);
    if (!department) return false;

    if (department.createdBy.id !== req.user.id) {
      throw new ForbiddenException(
        "You do not have permission to modify this department"
      );
    }

    return true;
  }
}
