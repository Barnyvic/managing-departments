import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import {
  InvalidTokenException,
  MissingTokenException,
} from "../../common/exceptions/auth.exceptions";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    this.logger.log(`Validating JWT payload for user: ${payload.username}`);
    if (!payload) {
      throw new InvalidTokenException();
    }
    return { id: payload.sub, username: payload.username };
  }
}
