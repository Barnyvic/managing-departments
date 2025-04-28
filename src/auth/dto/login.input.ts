import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
