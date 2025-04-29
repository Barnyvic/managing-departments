import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedByToDepartment1714320000002
  implements MigrationInterface
{
  name = "AddCreatedByToDepartment1714320000002";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add createdBy column to department table
    await queryRunner.query(
      `ALTER TABLE "department" 
       ADD COLUMN "createdById" integer,
       ADD CONSTRAINT "FK_department_createdBy" 
       FOREIGN KEY ("createdById") 
       REFERENCES "user"("id") 
       ON DELETE NO ACTION 
       ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the foreign key constraint and column
    await queryRunner.query(
      `ALTER TABLE "department" 
       DROP CONSTRAINT "FK_department_createdBy",
       DROP COLUMN "createdById"`
    );
  }
}
