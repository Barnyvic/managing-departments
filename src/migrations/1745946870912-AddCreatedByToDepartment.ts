import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedByToDepartment1745946870912 implements MigrationInterface {
    name = 'AddCreatedByToDepartment1745946870912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_department" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departmentId" integer, CONSTRAINT "PK_7f04797afdf7f75b8be0630b5e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_66d2edf6d1ebd0caf136b5f63d8" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_department" ADD CONSTRAINT "FK_e1b1566895082e852aa1cb84eb2" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_department" DROP CONSTRAINT "FK_e1b1566895082e852aa1cb84eb2"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_66d2edf6d1ebd0caf136b5f63d8"`);
        await queryRunner.query(`DROP TABLE "sub_department"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
