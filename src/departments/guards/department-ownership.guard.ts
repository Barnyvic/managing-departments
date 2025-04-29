import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { DepartmentsService } from "../departments.service";

@Injectable()
export class DepartmentOwnershipGuard implements CanActivate {
  constructor(private departmentsService: DepartmentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const args = ctx.getArgs();

    const departmentId = args.id || args.departmentId;
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
