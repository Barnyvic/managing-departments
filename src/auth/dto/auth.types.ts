import { Field, ObjectType, InputType } from "@nestjs/graphql";

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;
}

@InputType()
export class LoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
