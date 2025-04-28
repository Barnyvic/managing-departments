import { Field, InputType } from "@nestjs/graphql";
import { IsString, MinLength } from "class-validator";

@InputType()
export class SubDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;
}

@InputType()
export class UpdateSubDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;
}
