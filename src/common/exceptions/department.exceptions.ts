import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";

export class DepartmentNotFoundException extends NotFoundException {
  constructor(id: number) {
    super({
      message: `Department with ID ${id} not found`,
      error: "NOT_FOUND",
      statusCode: 404,
    });
  }
}

export class SubDepartmentNotFoundException extends NotFoundException {
  constructor(id: number) {
    super({
      message: `SubDepartment with ID ${id} not found`,
      error: "NOT_FOUND",
      statusCode: 404,
    });
  }
}

export class DepartmentNameConflictException extends ConflictException {
  constructor(name: string) {
    super({
      message: `Department with name "${name}" already exists`,
      error: "CONFLICT",
      statusCode: 409,
    });
  }
}

export class InvalidDepartmentDataException extends BadRequestException {
  constructor(message: string) {
    super({
      message,
      error: "BAD_REQUEST",
      statusCode: 400,
    });
  }
}
