import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("GraphQL");

  use(req: Request, res: Response, next: NextFunction) {
    const { operationName, query, variables } = req.body;

    this.logger.log(`
      Operation: ${operationName || "Anonymous"}
      Query: ${query?.replace(/\s+/g, " ")}
      Variables: ${JSON.stringify(variables)}
      IP: ${req.ip}
      User-Agent: ${req.get("user-agent")}
    `);

    const startTime = Date.now();

    res.on("finish", () => {
      const endTime = Date.now();
      this.logger.log(`
        Operation completed in ${endTime - startTime}ms
        Status: ${res.statusCode}
      `);
    });

    next();
  }
}
