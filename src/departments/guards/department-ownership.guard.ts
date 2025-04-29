import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { DepartmentsService } from "../departments.service";
import { SubDepartmentsService } from "../services/sub-departments.service";

@Injectable()
export class DepartmentOwnershipGuard implements CanActivate {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly subDepartmentsService: SubDepartmentsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const args = ctx.getArgs();

    if (!req.user) {
      throw new ForbiddenException(
        "You must be authenticated to perform this action"
      );
    }

    const userId = req.user.id;
    const operation = ctx.getInfo().operation.name.value;

    if (
      operation.includes("Department") &&
      !operation.includes("SubDepartment")
    ) {
      if (operation.startsWith("create")) {
        return true; 
      }

      const departmentId = args.id;
      const department = await this.departmentsService.findOne(departmentId);

      if (!department) {
        throw new ForbiddenException("Department not found");
      }

      if (department.createdBy.id !== userId) {
        throw new ForbiddenException(
          "You do not have permission to modify this department"
        );
      }

      return true;
    }

    // For sub-department operations
    if (operation.includes("SubDepartment")) {
      if (operation.startsWith("create")) {
        const departmentId = args.departmentId;
        const department = await this.departmentsService.findOne(departmentId);

        if (!department || department.createdBy.id !== userId) {
          throw new ForbiddenException(
            "You do not have permission to add sub-departments to this department"
          );
        }

        return true;
      }

      const subDepartmentId = args.id;
      const subDepartment =
        await this.subDepartmentsService.findOne(subDepartmentId);

      if (!subDepartment) {
        throw new ForbiddenException("Sub-department not found");
      }

      if (subDepartment.department.createdBy.id !== userId) {
        throw new ForbiddenException(
          "You do not have permission to modify this sub-department"
        );
      }

      return true;
    }

    return false;
  }
}
