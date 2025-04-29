import { Field, InputType, Int } from "@nestjs/graphql";
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  ValidateNested,
  IsInt,
  Min,
  Max,
  Matches,
  ArrayMaxSize,
} from "class-validator";
import { Type } from "class-transformer";
import { SubDepartmentInput } from "./sub-department.input";

@InputType()
export class CreateDepartmentInput {
  @Field()
  @IsString({ message: "Department name must be a string" })
  @MinLength(2, {
    message: "Department name must be at least 2 characters long",
  })
  @MaxLength(50, { message: "Department name cannot exceed 50 characters" })
  @Matches(/^[a-zA-Z0-9\s-]+$/, {
    message:
      "Department name can only contain letters, numbers, spaces, and hyphens",
  })
  name: string;

  @Field(() => [SubDepartmentInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10, {
    message: "Cannot create more than 10 sub-departments at once",
  })
  @Type(() => SubDepartmentInput)
  subDepartments?: SubDepartmentInput[];
}

@InputType()
export class UpdateDepartmentInput {
  @Field()
  @IsString({ message: "Department name must be a string" })
  @MinLength(2, {
    message: "Department name must be at least 2 characters long",
  })
  @MaxLength(50, { message: "Department name cannot exceed 50 characters" })
  @Matches(/^[a-zA-Z0-9\s-]+$/, {
    message:
      "Department name can only contain letters, numbers, spaces, and hyphens",
  })
  name: string;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt({ message: "Page number must be an integer" })
  @Min(1, { message: "Page number must be greater than 0" })
  @Max(1000, { message: "Page number cannot exceed 1000" })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be greater than 0" })
  @Max(100, { message: "Limit cannot exceed 100" })
  limit: number;
}
