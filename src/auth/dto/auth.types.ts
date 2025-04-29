import { Field, ObjectType, InputType } from "@nestjs/graphql";
import { IsNotEmpty, MinLength } from "class-validator";

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

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

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
