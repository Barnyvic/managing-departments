import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as argon2 from "argon2";
import {
  InvalidCredentialsException,
  UserNotFoundException,
  UsernameAlreadyExistsException,
  InvalidPasswordException,
} from "../common/exceptions/auth.exceptions";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    this.logger.log(`Validating user: ${username}`);
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new UserNotFoundException(username);
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  async login(user: User) {
    this.logger.log(`Generating JWT token for user: ${user.username}`);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string): Promise<User> {
    this.logger.log(`Registering new user: ${username}`);
    try {
      // Check if username already exists
      const existingUser = await this.usersRepository.findOne({
        where: { username },
      });

      if (existingUser) {
        throw new UsernameAlreadyExistsException(username);
      }

      // Validate password
      if (password.length < 6) {
        throw new InvalidPasswordException();
      }

      const hashedPassword = await argon2.hash(password);
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
      });

      const savedUser = await this.usersRepository.save(user);
      this.logger.log(`Successfully registered user: ${username}`);
      return savedUser;
    } catch (error) {
      if (
        error instanceof UsernameAlreadyExistsException ||
        error instanceof InvalidPasswordException
      ) {
        throw error;
      }
      this.logger.error(
        `Error registering user: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
