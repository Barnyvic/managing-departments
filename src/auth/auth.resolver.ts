import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResponse, LoginInput, RegisterInput } from "./dto/auth.types";
import { User } from "./entities/user.entity";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args("input") input: LoginInput): Promise<AuthResponse> {
    const user = await this.authService.validateUser(
      input.username,
      input.password
    );
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.authService.login(user);
  }

  @Mutation(() => User)
  async register(@Args("input") input: RegisterInput): Promise<User> {
    return this.authService.register(input.username, input.password);
  }
}
