import { Field, InputType, Int } from "@nestjs/graphql";
import {
  IsString,
  MinLength,
  IsOptional,
  ValidateNested,
  IsNumber,
  Min,
  IsInt,
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
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  @Min(1)
  limit: number;
}
