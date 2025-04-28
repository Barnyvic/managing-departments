import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@InputType()
class SubDepartmentInput {
  @Field()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}

@InputType()
export class CreateDepartmentInput {
  @Field()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Field(() => [SubDepartmentInput], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => SubDepartmentInput)
  subDepartments?: SubDepartmentInput[];
}
