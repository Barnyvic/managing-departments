import { Field, InputType } from "@nestjs/graphql";
import { IsString, MinLength, MaxLength, Matches } from "class-validator";

@InputType()
export class SubDepartmentInput {
  @Field()
  @IsString({ message: "Sub-department name must be a string" })
  @MinLength(2, {
    message: "Sub-department name must be at least 2 characters long",
  })
  @MaxLength(50, { message: "Sub-department name cannot exceed 50 characters" })
  @Matches(/^[a-zA-Z0-9\s-]+$/, {
    message:
      "Sub-department name can only contain letters, numbers, spaces, and hyphens",
  })
  name: string;
}

@InputType()
export class UpdateSubDepartmentInput {
  @Field()
  @IsString({ message: "Sub-department name must be a string" })
  @MinLength(2, {
    message: "Sub-department name must be at least 2 characters long",
  })
  @MaxLength(50, { message: "Sub-department name cannot exceed 50 characters" })
  @Matches(/^[a-zA-Z0-9\s-]+$/, {
    message:
      "Sub-department name can only contain letters, numbers, spaces, and hyphens",
  })
  name: string;
}
