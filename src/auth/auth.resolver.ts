import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UnauthorizedException, Logger } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  AuthResponse,
  LoginInput,
  RegisterInput,
  RegisterResponse,
} from "./dto/auth.types";
import { User } from "./entities/user.entity";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  InvalidCredentialsException,
  UserNotFoundException,
} from "../common/exceptions/auth.exceptions";

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args("input") input: LoginInput): Promise<AuthResponse> {
    this.logger.log(`Login attempt for user: ${input.username}`);
    try {
      const user = await this.authService.validateUser(
        input.username,
        input.password
      );
      return this.authService.login(user);
    } catch (error) {
      if (
        error instanceof InvalidCredentialsException ||
        error instanceof UserNotFoundException
      ) {
        throw error;
      }
      this.logger.error(
        `Unexpected error during login: ${error.message}`,
        error.stack
      );
      throw new InvalidCredentialsException();
    }
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Args("input") input: RegisterInput
  ): Promise<RegisterResponse> {
    this.logger.log(`Registration attempt for user: ${input.username}`);
    const user = await this.authService.register(
      input.username,
      input.password
    );
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
