import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepartmentsAndSubDepartments1714320000000
  implements MigrationInterface
{
  name = "CreateDepartmentsAndSubDepartments1714320000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "department" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "sub_department" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "departmentId" integer, CONSTRAINT "PK_8a0e0a0a0a0a0a0a0a0a0a0a0a0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "sub_department" ADD CONSTRAINT "FK_8a0e0a0a0a0a0a0a0a0a0a0a0a0" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_department" DROP CONSTRAINT "FK_8a0e0a0a0a0a0a0a0a0a0a0a0a0"`
    );
    await queryRunner.query(`DROP TABLE "sub_department"`);
    await queryRunner.query(`DROP TABLE "department"`);
  }
}
