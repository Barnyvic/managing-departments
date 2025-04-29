import { Field, InputType } from "@nestjs/graphql";
import {
  IsString,
  MinLength,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { SubDepartmentInput } from "./sub-department.input";
import { Float } from "@nestjs/graphql";

@InputType()
export class CreateDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => [SubDepartmentInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubDepartmentInput)
  subDepartments?: SubDepartmentInput[];
}

@InputType()
export class UpdateDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;
}

@InputType()
export class PaginationInput {
  @Field(() => Float, { defaultValue: 1 })
  page: number;

  @Field(() => Float, { defaultValue: 10 })
  limit: number;
}
